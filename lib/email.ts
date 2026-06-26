import { Resend } from "resend";

export type SubscriptionEmailInput = {
  customerName: string;
  email: string;
  assignedLink: string;
};

export async function sendSubscriptionEmail(input: SubscriptionEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("Resend email skipped. RESEND_API_KEY or RESEND_FROM_EMAIL is missing.");
    return {
      sent: false,
      skipped: true,
      reason: "Missing RESEND_API_KEY or RESEND_FROM_EMAIL."
    };
  }

  const resend = new Resend(apiKey);
  const bodyText = `Hello ${input.customerName}

Thank you for your purchase.

Your Subscription Link:

${input.assignedLink}`;

  const result = await resend.emails.send({
    from,
    to: input.email,
    replyTo: process.env.RESEND_REPLY_TO_EMAIL,
    subject: "Your Gemini Pro Subscription",
    text: bodyText,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <p>Hello ${escapeHtml(input.customerName)}</p>
        <p>Thank you for your purchase.</p>
        <p>Your Subscription Link:</p>
        <p><a href="${escapeAttribute(input.assignedLink)}">${escapeHtml(input.assignedLink)}</a></p>
      </div>
    `
  });

  return {
    sent: true,
    skipped: false,
    id: result.data?.id
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
