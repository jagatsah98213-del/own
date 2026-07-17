import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transport = getTransport();
  if (!transport) {
    console.warn("[email] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) – skipping send");
    return;
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    await transport.sendMail({ from, to, subject, html });
    console.info(`[email] Sent "${subject}" → ${to}`);
  } catch (err) {
    console.error("[email] Failed to send email:", err);
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

function emailShell(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#F5F5F7; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
  .wrap { max-width:580px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.07); }
  .header { background:#06060A; padding:36px 40px; text-align:center; }
  .logo { color:#fff; font-size:20px; font-weight:800; letter-spacing:-0.5px; }
  .logo span { color:#60A5FA; }
  .body { padding:40px; }
  h1 { font-size:24px; font-weight:800; color:#1D1D1F; margin-bottom:8px; letter-spacing:-0.5px; }
  .sub { color:#6E6E73; font-size:15px; margin-bottom:28px; line-height:1.5; }
  .card { background:#F5F5F7; border-radius:12px; padding:20px 24px; margin-bottom:24px; }
  .card p { color:#1D1D1F; font-size:14px; line-height:1.7; }
  .card strong { color:#1D1D1F; }
  .divider { height:1px; background:#E8E8ED; margin:24px 0; }
  .cta { display:inline-block; background:#1D1D1F; color:#fff !important; padding:14px 28px; border-radius:100px; font-size:14px; font-weight:700; text-decoration:none; margin:8px 0 24px; }
  .footer-text { color:#8E8E9A; font-size:12px; line-height:1.7; }
  .footer { background:#F5F5F7; border-top:1px solid #E8E8ED; padding:24px 40px; text-align:center; }
  .footer p { color:#8E8E9A; font-size:12px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">TRIVINEX<span> PARTNERS</span></div>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Trivinex Partners · All rights reserved</p>
    <p style="margin-top:4px;">You received this because you submitted a form on our website.</p>
  </div>
</div>
</body>
</html>`;
}

export function clientInquiryConfirmationEmail(name: string, serviceNeeded: string) {
  return emailShell(`
    <h1>We've received your request 🎉</h1>
    <p class="sub">Hi ${name}, thank you for reaching out to Trivinex Partners.</p>
    <div class="card">
      <p><strong>Service requested:</strong> ${serviceNeeded.replace(/_/g, " ")}</p>
      <p style="margin-top:10px;">Your inquiry has been logged and a member of our team will review it shortly. We typically respond within <strong>24–48 business hours</strong>.</p>
    </div>
    <p style="color:#6E6E73;font-size:14px;line-height:1.7;margin-bottom:20px;">
      While you wait, feel free to explore our portfolio and learn more about what we do. If your project is urgent, you can also book a free consultation call directly.
    </p>
    <a href="https://trivinexpartners.com/consultation" class="cta">Book a Free Consultation</a>
    <div class="divider"></div>
    <p class="footer-text">
      <strong>What happens next?</strong><br/>
      1. Our team reviews your project brief<br/>
      2. We'll send you a tailored proposal &amp; pricing<br/>
      3. We schedule a kickoff call to get started
    </p>
  `);
}

export function freelancerApplicationConfirmationEmail(fullName: string, serviceCategory: string) {
  return emailShell(`
    <h1>Your application has been received ✅</h1>
    <p class="sub">Hi ${fullName}, thank you for your interest in joining Trivinex Partners.</p>
    <div class="card">
      <p><strong>Applied for:</strong> ${serviceCategory.replace(/_/g, " ")}</p>
      <p style="margin-top:10px;">
        Your application is currently <strong>under review</strong> by our talent team. We carefully evaluate each submission to ensure the best fit for our standards.
      </p>
    </div>
    <p style="color:#6E6E73;font-size:14px;line-height:1.7;margin-bottom:20px;">
      Shortly, we will contact you on this same email address to inform you of the date and details of your interview. Please keep an eye on your inbox — and your spam folder just in case.
    </p>
    <div class="divider"></div>
    <p class="footer-text">
      <strong>What to expect:</strong><br/>
      1. Application review (2–4 business days)<br/>
      2. Interview invitation sent to this email<br/>
      3. Technical / portfolio review call<br/>
      4. Onboarding for selected candidates
    </p>
    <div class="divider"></div>
    <p class="footer-text">
      We appreciate your patience and look forward to potentially welcoming you to our team. If you have any questions in the meantime, feel free to reach out to us directly.
    </p>
  `);
}
