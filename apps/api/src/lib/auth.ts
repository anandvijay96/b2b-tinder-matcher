import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { db } from './db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[Auth] OTP for ${email} (${type}): ${otp}`);
        // TODO Phase 7: Integrate Resend or SendGrid for transactional email
        // Example: await resend.emails.send({ to: email, subject: 'Your OTP', html: `<p>${otp}</p>` })
      },
      otpLength: 6,
      expiresIn: 300,
    }),
  ],
  trustedOrigins: (process.env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});

export type Auth = typeof auth;
