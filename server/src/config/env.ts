import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

// Validate environment variables once, at startup, and fail fast with a clear
// message if anything required is missing or malformed. Everything in the app
// should read config from `env` rather than touching `process.env` directly.
const envSchema = z.object({
  DB_URL: z.string().min(1, "DB_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  PORT: z.coerce.number().int().positive().default(3029),
  // GCS credentials: either the JSON blob (Railway) or a local key file is used.
  // gcs.ts validates the actual presence of one of these, so both are optional here.
  GOOGLE_APPLICATION_CREDENTIALS_JSON: z.string().optional(),
  // Twilio (optional): used to send password-reset OTPs by SMS. When absent, the
  // OTP service falls back to logging the code to the server console.
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  // eslint-disable-next-line no-console
  console.error(`\n❌ Invalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
