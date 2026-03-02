import { createTransport } from 'nodemailer';

const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';

const transporter = createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 1025),
  secure: process.env.SMTP_SECURE === 'true',
  ...(smtpUser && smtpPass ? { auth: { user: smtpUser, pass: smtpPass } } : {}),
});

const FROM = process.env.FROM_EMAIL || 'noreply@nmqmatch.com';

export async function sendOtpEmail(
  to: string,
  otp: string,
  type: string,
): Promise<void> {
  const subject =
    type === 'sign-in'
      ? 'Your NMQ Match sign-in code'
      : 'Your NMQ Match verification code';

  await transporter.sendMail({
    from: `"NMQ Match" <${FROM}>`,
    to,
    subject,
    text: `Your one-time code is: ${otp}\n\nThis code expires in 5 minutes. If you didn't request this, ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1E3A5F; margin-bottom: 8px;">NMQ B2B Match</h2>
        <p style="color: #475569; font-size: 15px;">Your one-time code is:</p>
        <div style="background: #F1F5F9; border-radius: 12px; padding: 24px; text-align: center; margin: 16px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0F172A;">${otp}</span>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
