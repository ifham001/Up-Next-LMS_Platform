import { Context } from "hono";
import { z } from "zod";
import puppeteer from "puppeteer";
import {
  issueCertificate,
  listCertificates,
  getCertificateByNumber,
} from "../../queries/user/certificate.queries";
import { createNotifications } from "../../queries/user/notification.queries";
import { generateCertificateHTML } from "../../util/certificate";
import { getValidated } from "../../util/validate";
import { ok, created } from "../../util/response";
import { ForbiddenError, BadRequestError, NotFoundError, UnauthorizedError } from "../../util/errors";

export const issueCertificateSchema = z.object({
  courseId: z.string().uuid(),
});

export const certNumberParamSchema = z.object({
  certificateNumber: z.string().min(3).max(40),
});

const currentUserId = (c: Context): string => {
  const payload = c.get("user") as { id?: string } | undefined;
  if (!payload?.id) throw new UnauthorizedError("Authentication required");
  return payload.id;
};

const formatDate = (d: Date): string =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

// POST /user/certificates — issue (or return existing) certificate for a course.
export const issueMyCertificate = async (c: Context) => {
  const userId = currentUserId(c);
  const { courseId } = getValidated<z.infer<typeof issueCertificateSchema>>(c, "body");

  const result = await issueCertificate(userId, courseId);
  switch (result.status) {
    case "not_enrolled":
      throw new ForbiddenError("You are not enrolled in this course");
    case "incomplete":
      throw new BadRequestError(
        `Course not completed yet (${result.completedPercent}%). Finish the course to earn a certificate.`
      );
    case "issued":
      // Best-effort notification; never block issuance on it.
      await createNotifications([
        {
          userId,
          type: "certificate",
          title: "Certificate earned 🎉",
          body: `Your certificate (${result.certificate.certificateNumber}) is ready to download.`,
          courseId,
        },
      ]).catch(() => {});
      return created(c, { certificate: result.certificate }, "Certificate issued");
    case "already_issued":
      return ok(c, { certificate: result.certificate }, "Certificate already issued");
  }
};

// GET /user/certificates — the caller's certificates.
export const getMyCertificates = async (c: Context) => {
  const userId = currentUserId(c);
  const certificates = await listCertificates(userId);
  return ok(c, { certificates }, "Certificates fetched");
};

// GET /user/certificates/verify/:certificateNumber — PUBLIC verification.
export const verifyCertificate = async (c: Context) => {
  const { certificateNumber } =
    getValidated<z.infer<typeof certNumberParamSchema>>(c, "params");
  const cert = await getCertificateByNumber(certificateNumber);
  if (!cert) return ok(c, { valid: false }, "Certificate not found");
  // Public response: confirm authenticity without exposing the internal userId.
  // The recipient name and course are already printed on the certificate, so
  // surfacing them is the point of verification; the internal id is not.
  return ok(
    c,
    {
      valid: true,
      certificate: {
        certificateNumber: cert.certificateNumber,
        recipientName: cert.recipientName,
        courseTitle: cert.courseTitle,
        issuedAt: cert.issuedAt,
      },
    },
    "Certificate is valid"
  );
};

// GET /user/certificates/:certificateNumber/download — owner-only PDF (base64).
export const downloadCertificate = async (c: Context) => {
  const userId = currentUserId(c);
  const { certificateNumber } =
    getValidated<z.infer<typeof certNumberParamSchema>>(c, "params");

  const cert = await getCertificateByNumber(certificateNumber, userId);
  if (!cert) throw new NotFoundError("Certificate not found");

  const html = generateCertificateHTML({
    recipientName: cert.recipientName ?? "Student",
    courseTitle: cert.courseTitle,
    certificateNumber: cert.certificateNumber,
    issuedDate: formatDate(new Date(cert.issuedAt)),
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ printBackground: true, landscape: true, format: "A4" });
    return ok(
      c,
      {
        certificateNumber: cert.certificateNumber,
        pdf: Buffer.from(pdfBuffer).toString("base64"),
      },
      "Certificate generated"
    );
  } finally {
    await browser.close();
  }
};
