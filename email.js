import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_SECRET);

export async function sendEmail({ to, subject, html }) {
  await resend.emails.send({
    from: "Booiq kartor <noreply@booiq.com>",
    to,
    subject,
    html,
  });
}
