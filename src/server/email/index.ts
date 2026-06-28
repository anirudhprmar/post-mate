import "server-only";

import { Resend } from "resend";
import { env } from "~/env";
import type { ReactNode } from "react";

type SendEmailParams = {
  to: string | string[];
  subject: string;
  react?: ReactNode;
  html?: string;
};

export async function sendEmail({ to, subject, react, html }: SendEmailParams) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    if (env.NODE_ENV === "development") {
      console.warn(
        "Resend not configured — skipping email to",
        to,
        "with subject:",
        subject,
      );
      return;
    }
    throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL must be set");
  }

  const resend = new Resend(env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw error;
  }

  return data;
}

export async function sendBroadcastEmail(
  params: Omit<SendEmailParams, "to"> & { to: string[] },
) {
  return sendEmail(params);
}
