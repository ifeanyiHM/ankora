import nodemailer, { type Transporter } from "nodemailer";

export class MailConfigError extends Error {}

let cached: Transporter | null | undefined;

function transporter(): Transporter {
  if (cached !== undefined) {
    if (!cached) throw new MailConfigError("SMTP is not configured");
    return cached;
  }
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    cached = null;
    throw new MailConfigError("SMTP is not configured");
  }
  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return cached;
}

export interface MailMessage { to: string; subject: string; html: string; text: string }

/**
 * Sends an email, or logs it to the console when SMTP isn't configured, so the rest of the
 * app (checkout, order status updates) never has to know or care whether email is set up.
 * Never throws: a broken mail server should not break a checkout or a status update.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  const from = process.env.SMTP_FROM ?? "Ankora <no-reply@ankora.ng>";
  try {
    await transporter().sendMail({ from, ...message });
  } catch (err) {
    if (err instanceof MailConfigError) {
      console.info(`[mail] SMTP not configured, skipping email to ${message.to}: ${message.subject}`);
    } else {
      console.error(`[mail] Failed to send "${message.subject}" to ${message.to}:`, err);
    }
  }
}
