import { Resend } from "resend";

export type SubscriptionEmailInput = {
  customerName: string;
  email: string;
  assignedLink: string;
};

export type SubscriptionEmailResult = {
  sent: boolean;
  skipped: boolean;
  id?: string;
  reason?: string;
};

export async function sendSubscriptionEmail(input: SubscriptionEmailInput): Promise<SubscriptionEmailResult> {
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
  const bodyText = `প্রিয় গ্রাহক,

BD Subscription HuB থেকে Gemini Pro 18 Months সাবস্ক্রিপশন কেনার জন্য আপনাকে আন্তরিক ধন্যবাদ।

আপনার সাবস্ক্রিপশন সফলভাবে প্রস্তুত হয়েছে।

প্রোডাক্ট: Gemini Pro 18 Months
স্ট্যাটাস: ✅ Ready to Use

Subscription খুলুন:

${input.assignedLink}`;

  const result = await resend.emails
    .send({
      from,
      to: input.email,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL,
      subject: "🎉 আপনার Gemini Pro 18 Months Subscription প্রস্তুত",
      text: bodyText,
      html: `
        <!doctype html>
        <html lang="bn">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title>🎉 আপনার Gemini Pro 18 Months Subscription প্রস্তুত</title>
          </head>
          <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,'Noto Sans Bengali','Noto Sans Bengali UI','SolaimanLipi',sans-serif;color:#172033;">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;font-size:1px;">
              আপনার Gemini Pro 18 Months সাবস্ক্রিপশন সফলভাবে প্রস্তুত হয়েছে।
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background-color:#f4f7fb;margin:0;padding:0;border-collapse:collapse;">
              <tr>
                <td align="center" style="padding:32px 14px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:22px;border:1px solid #e5edf7;box-shadow:0 18px 48px rgba(23,32,51,0.12);overflow:hidden;border-collapse:separate;">
                    <tr>
                      <td style="padding:30px 28px 18px 28px;text-align:center;background-color:#ffffff;">
                        <div style="display:inline-block;width:54px;height:54px;line-height:54px;border-radius:18px;background-color:#0f766e;color:#ffffff;font-size:26px;font-weight:800;text-align:center;margin:0 0 14px 0;">
                          B
                        </div>
                        <div style="font-size:24px;line-height:32px;font-weight:800;color:#102033;letter-spacing:0;margin:0;">
                          BD Subscription HuB
                        </div>
                        <div style="width:56px;height:4px;background-color:#16a34a;border-radius:99px;margin:14px auto 0 auto;line-height:4px;font-size:4px;">
                          &nbsp;
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:12px 28px 0 28px;text-align:center;background-color:#ffffff;">
                        <h1 style="margin:0;color:#111827;font-size:28px;line-height:38px;font-weight:800;letter-spacing:0;">
                          🎉 আপনার Gemini Pro 18 Months Subscription প্রস্তুত
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:24px 28px 0 28px;background-color:#ffffff;">
                        <p style="margin:0 0 12px 0;color:#263247;font-size:17px;line-height:28px;font-weight:700;">
                          প্রিয় গ্রাহক,
                        </p>
                        <p style="margin:0 0 12px 0;color:#46566f;font-size:16px;line-height:28px;font-weight:400;">
                          BD Subscription HuB থেকে Gemini Pro 18 Months সাবস্ক্রিপশন কেনার জন্য আপনাকে আন্তরিক ধন্যবাদ।
                        </p>
                        <p style="margin:0;color:#46566f;font-size:16px;line-height:28px;font-weight:400;">
                          আপনার সাবস্ক্রিপশন সফলভাবে প্রস্তুত হয়েছে।
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:24px 28px 0 28px;background-color:#ffffff;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;background-color:#f8fbff;border:1px solid #e4edf8;border-radius:18px;">
                          <tr>
                            <td style="padding:20px 20px 18px 20px;">
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                                <tr>
                                  <td style="padding:0 0 12px 0;color:#66758c;font-size:13px;line-height:18px;font-weight:700;text-transform:uppercase;letter-spacing:0;">
                                    প্রোডাক্ট
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0 0 18px 0;color:#111827;font-size:21px;line-height:28px;font-weight:800;">
                                    Gemini Pro 18 Months
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0;">
                                    <span style="display:inline-block;background-color:#ecfdf5;border:1px solid #bbf7d0;border-radius:999px;color:#047857;font-size:14px;line-height:20px;font-weight:800;padding:9px 14px;">
                                      ✅ Ready to Use
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding:28px 28px 8px 28px;background-color:#ffffff;">
                        <a href="${escapeAttribute(input.assignedLink)}" target="_blank" style="display:block;width:100%;max-width:360px;background-color:#16a34a;color:#ffffff;text-decoration:none;border-radius:14px;padding:16px 22px;font-size:18px;line-height:24px;font-weight:800;text-align:center;box-shadow:0 12px 24px rgba(22,163,74,0.24);">
                          👉 Subscription খুলুন
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:22px 28px 0 28px;background-color:#ffffff;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;background-color:#fffaf0;border:1px solid #fde7b0;border-radius:16px;">
                          <tr>
                            <td style="padding:18px 18px 16px 18px;">
                              <p style="margin:0 0 12px 0;color:#6b4e16;font-size:15px;line-height:25px;font-weight:600;">
                                যদি উপরের বাটন কাজ না করে, তাহলে নিচের লিংকটি কপি করে ব্রাউজারে খুলুন।
                              </p>
                              <p style="margin:0;word-break:break-all;overflow-wrap:anywhere;color:#0f766e;font-size:14px;line-height:23px;font-weight:700;">
                                <a href="${escapeAttribute(input.assignedLink)}" target="_blank" style="color:#0f766e;text-decoration:underline;word-break:break-all;overflow-wrap:anywhere;">
                                  ${escapeHtml(input.assignedLink)}
                                </a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:28px 28px 30px 28px;background-color:#ffffff;text-align:center;">
                        <p style="margin:0 0 12px 0;color:#46566f;font-size:15px;line-height:24px;font-weight:600;">
                          <a href="https://bdsubscriptionhub.shop/" target="_blank" style="color:#0f766e;text-decoration:none;font-weight:800;">https://bdsubscriptionhub.shop</a>
                        </p>
                        <p style="margin:0 0 12px 0;color:#46566f;font-size:15px;line-height:25px;font-weight:400;">
                          আপনার বিশ্বাসই আমাদের অনুপ্রেরণা।
                        </p>
                        <p style="margin:0;color:#172033;font-size:15px;line-height:25px;font-weight:700;">
                          ধন্যবাদ,<br>
                          BD Subscription HuB
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    })
    .catch((error: unknown) => {
      console.error("Resend email delivery failed.", error);
      return {
        data: null,
        error: {
          message: "Email delivery failed. The assigned link is saved and can be resent later.",
          name: "application_error" as const
        }
      };
    });

  if (result.error) {
    console.error("Resend email delivery failed.", result.error);
    return {
      sent: false,
      skipped: false,
      reason: "Email delivery failed. The assigned link is saved and can be resent later."
    };
  }

  return {
    sent: true,
    skipped: false,
    id: result.data.id
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
