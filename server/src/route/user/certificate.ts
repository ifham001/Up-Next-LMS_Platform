import { Hono } from "hono";
import {
  issueMyCertificate,
  getMyCertificates,
  verifyCertificate,
  downloadCertificate,
  issueCertificateSchema,
  certNumberParamSchema,
} from "../../controller/user/certificate.controller";
import { authMiddleware } from "../../util/authMiddleware";
import { validateBody, validateParams } from "../../util/validate";

const certificate = new Hono();

// Public verification (no auth) — registered before param-auth routes.
certificate.get(
  "/certificates/verify/:certificateNumber",
  validateParams(certNumberParamSchema),
  verifyCertificate
);

certificate.post(
  "/certificates",
  authMiddleware,
  validateBody(issueCertificateSchema),
  issueMyCertificate
);
certificate.get("/certificates", authMiddleware, getMyCertificates);
certificate.get(
  "/certificates/:certificateNumber/download",
  authMiddleware,
  validateParams(certNumberParamSchema),
  downloadCertificate
);

export default certificate;
