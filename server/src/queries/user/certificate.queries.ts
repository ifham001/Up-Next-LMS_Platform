import { and, eq, desc } from "drizzle-orm";
import { dbDrizzle } from "../../config/pg.db";
import { certificate } from "../../schema/user/certificate";
import { userCourses } from "../../schema/user/userCourses";
import { course } from "../../schema/admin/course";
import { user } from "../../schema/auth";
import { courseProgress } from "./progress.queries";

// Generate a human-shareable certificate number, e.g. UN-2026-AB12CD34.
const buildCertificateNumber = (): string => {
  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `UN-${year}-${suffix}`;
};

// The user's enrollment row for a course (or undefined if not enrolled).
const getEnrollment = async (userId: string, courseId: string) => {
  const rows = await dbDrizzle
    .select({ id: userCourses.id })
    .from(userCourses)
    .where(and(eq(userCourses.userId, userId), eq(userCourses.courseId, courseId)))
    .limit(1);
  return rows[0];
};

export type IssueResult =
  | { status: "not_enrolled" }
  | { status: "incomplete"; completedPercent: number }
  | { status: "issued" | "already_issued"; certificate: typeof certificate.$inferSelect };

// Issue (or return the existing) certificate, gated on 100% course progress.
export const issueCertificate = async (
  userId: string,
  courseId: string
): Promise<IssueResult> => {
  const enrollment = await getEnrollment(userId, courseId);
  if (!enrollment) return { status: "not_enrolled" };

  // Already issued? Idempotent — return it.
  const existingRows = await dbDrizzle
    .select()
    .from(certificate)
    .where(and(eq(certificate.userId, userId), eq(certificate.courseId, courseId)))
    .limit(1);
  if (existingRows[0]) {
    return { status: "already_issued", certificate: existingRows[0] };
  }

  // Recompute progress from the source of truth before issuing.
  const progress = await courseProgress(enrollment.id);
  const completedPercent =
    progress.success && "completedPercent" in progress
      ? (progress.completedPercent as number)
      : 0;
  if (completedPercent < 100) {
    return { status: "incomplete", completedPercent };
  }

  // Insert; tolerate a race on the unique (userId, courseId) constraint by
  // falling back to the existing row.
  const [issued] = await dbDrizzle
    .insert(certificate)
    .values({ userId, courseId, certificateNumber: buildCertificateNumber() })
    .onConflictDoNothing({ target: [certificate.userId, certificate.courseId] })
    .returning();

  if (issued) return { status: "issued", certificate: issued };

  const [raced] = await dbDrizzle
    .select()
    .from(certificate)
    .where(and(eq(certificate.userId, userId), eq(certificate.courseId, courseId)))
    .limit(1);
  return { status: "already_issued", certificate: raced };
};

// All certificates for a user, with course titles, newest first.
export const listCertificates = async (userId: string) => {
  return dbDrizzle
    .select({
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      courseId: certificate.courseId,
      courseTitle: course.title,
      issuedAt: certificate.issuedAt,
    })
    .from(certificate)
    .innerJoin(course, eq(certificate.courseId, course.id))
    .where(eq(certificate.userId, userId))
    .orderBy(desc(certificate.issuedAt));
};

// Full certificate detail with recipient + course names. Owner check optional:
// pass userId to scope (for owner-only fetch), omit for public verification.
export const getCertificateByNumber = async (
  certificateNumber: string,
  userId?: string
) => {
  const filters = [eq(certificate.certificateNumber, certificateNumber)];
  if (userId) filters.push(eq(certificate.userId, userId));

  const rows = await dbDrizzle
    .select({
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      userId: certificate.userId,
      recipientName: user.name,
      courseId: certificate.courseId,
      courseTitle: course.title,
      issuedAt: certificate.issuedAt,
    })
    .from(certificate)
    .innerJoin(user, eq(certificate.userId, user.id))
    .innerJoin(course, eq(certificate.courseId, course.id))
    .where(and(...filters))
    .limit(1);

  return rows[0];
};
