import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db.js";
import { sendEmail } from "./email.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: ["http://localhost:3001", "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Återställ ditt lösenord",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2>Återställ ditt lösenord</h2>
            <p>Hej,</p>
            <p>Klicka på knappen nedan för att återställa ditt lösenord:</p>
            <a
              href="${url}"
              style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;"
            >
              Återställ lösenord
            </a>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              Om du inte har begärt en lösenordsåterställning kan du ignorera
              detta meddelande.
            </p>
          </div>
        `,
      });
    },
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const verificationUrl =
        url.slice(0, -1) + "http://localhost:5173/sign-in";
      await sendEmail({
        to: user.email,
        subject: "Verifiera din e-postadress",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2>Verifiera din e-postadress</h2>
            <p>Hej,</p>
            <p>Klicka på knappen nedan för att verifiera din e-postadress:</p>
            <a
              href="${verificationUrl}"
              style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;"
            >
              Verifiera e-post
            </a>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
              Om du inte har skapat ett konto eller begärt denna verifiering kan
              du ignorera detta meddelande.
            </p>
          </div>
        `,
      });
    },
    autoSignInAfterVerification: true,
  },
});
