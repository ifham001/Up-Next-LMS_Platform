import { env } from "../config/env";

// Generate a cryptographically-random 6-digit OTP as a string.
export const generateOtp = (): string => {
  // 0..999999, left-padded to 6 digits.
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return n.toString().padStart(6, "0");
};

const twilioConfigured = (): boolean =>
  Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER);

// Deliver an OTP. When Twilio is configured AND a destination phone is known we
// send an SMS; otherwise we log to the server console (dev / email-only setups).
// Returns the channel used so callers can surface it in non-production.
export const sendOtp = async (
  destination: { email: string; phone?: string },
  otp: string
): Promise<"sms" | "console"> => {
  const message = `Your Up Next password reset code is ${otp}. It expires in 10 minutes.`;

  if (twilioConfigured() && destination.phone) {
    try {
      // Lazy import so the dependency is only loaded when actually used.
      const twilio = (await import("twilio")).default;
      const client = twilio(env.TWILIO_ACCOUNT_SID!, env.TWILIO_AUTH_TOKEN!);
      await client.messages.create({
        body: message,
        from: env.TWILIO_FROM_NUMBER!,
        to: destination.phone,
      });
      return "sms";
    } catch (err) {
      // Fall through to console on delivery failure.
      console.error("Twilio OTP send failed, falling back to console:", err);
    }
  }

  console.log(`[OTP] for ${destination.email}: ${message}`);
  return "console";
};
