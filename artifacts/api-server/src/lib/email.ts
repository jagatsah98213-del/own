import nodemailer from "nodemailer";

type EmailOptions = {
  replyTo?: string;
};

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

export async function sendEmail(to: string, subject: string, html: string, options?: EmailOptions) {
  const transport = getTransport();
  if (!transport) {
    console.warn("[email] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) – skipping send");
    return;
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    await transport.sendMail({
      from,
      to,
      subject,
      html,
      ...(options?.replyTo ? { replyTo: options.replyTo } : {}),
    });
    console.info(`[email] Sent "${subject}" → ${to}`);
  } catch (err) {
    console.error("[email] Failed to send email:", err);
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayValue(value: string | null | undefined) {
  return escapeHtml(value || "Not provided");
}

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
    <p class="sub">Hi ${escapeHtml(name)}, thank you for reaching out to Trivinex Partners.</p>
    <div class="card">
      <p><strong>Service requested:</strong> ${escapeHtml(serviceNeeded.replace(/_/g, " "))}</p>
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
    <p class="sub">Hi ${escapeHtml(fullName)}, thank you for your interest in joining Trivinex Partners.</p>
    <div class="card">
      <p><strong>Applied for:</strong> ${escapeHtml(serviceCategory.replace(/_/g, " "))}</p>
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

function slotDetails(slot: { date: string; startTime: string; meetLink?: string | null }) {
  return `
    <p><strong>Date:</strong> ${escapeHtml(slot.date)}</p>
    <p><strong>Time:</strong> ${escapeHtml(slot.startTime)}</p>
    ${slot.meetLink ? `<p><strong>Meeting link:</strong> <a href="${escapeHtml(slot.meetLink)}">${escapeHtml(slot.meetLink)}</a></p>` : ""}
  `;
}

export function consultationConfirmationEmail(
  clientName: string,
  slot: { date: string; startTime: string; meetLink?: string | null },
) {
  return emailShell(`
    <h1>Your consultation is booked ✅</h1>
    <p class="sub">Hi ${escapeHtml(clientName)}, thank you for booking a consultation with Trivinex Partners.</p>
    <div class="card">
      ${slotDetails(slot)}
      <p style="margin-top:10px;">We look forward to speaking with you. If you need to reschedule, reply to this email and our team will help you.</p>
    </div>
  `);
}

export function interviewBookingConfirmationEmail(
  fullName: string,
  slot: { date: string; startTime: string; meetLink?: string | null },
) {
  return emailShell(`
    <h1>Your interview is scheduled ✅</h1>
    <p class="sub">Hi ${escapeHtml(fullName)}, your interview with Trivinex Partners has been scheduled.</p>
    <div class="card">
      ${slotDetails(slot)}
      <p style="margin-top:10px;">Please be ready a few minutes early and keep your portfolio or work samples nearby.</p>
    </div>
  `);
}

export function inquiryAdminNotificationEmail(inquiry: {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceNeeded: string;
  projectDetails: string;
  budgetRange?: string | null;
  timeline?: string | null;
}) {
  return emailShell(`
    <h1>New quote request</h1>
    <p class="sub">A new client inquiry was submitted on the Trivinex Partners website.</p>
    <div class="card">
      <p><strong>Inquiry #:</strong> ${inquiry.id}</p>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
      <p><strong>Service:</strong> ${escapeHtml(inquiry.serviceNeeded.replace(/_/g, " "))}</p>
      <p><strong>Budget:</strong> ${displayValue(inquiry.budgetRange)}</p>
      <p><strong>Timeline:</strong> ${displayValue(inquiry.timeline)}</p>
    </div>
    <p style="color:#1D1D1F;font-size:14px;line-height:1.7;"><strong>Project details</strong><br/>${escapeHtml(inquiry.projectDetails).replaceAll("\\n", "<br/>")}</p>
  `);
}

export function consultationAdminNotificationEmail(booking: {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string | null;
  slot: { date: string; startTime: string; meetLink?: string | null };
}) {
  return emailShell(`
    <h1>New consultation booking</h1>
    <p class="sub">A client booked a consultation slot on the Trivinex Partners website.</p>
    <div class="card">
      <p><strong>Booking #:</strong> ${booking.id}</p>
      <p><strong>Name:</strong> ${escapeHtml(booking.clientName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(booking.clientEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(booking.clientPhone)}</p>
      ${slotDetails(booking.slot)}
      ${booking.notes ? `<p><strong>Notes:</strong> ${escapeHtml(booking.notes).replaceAll("\\n", "<br/>")}</p>` : ""}
    </div>
  `);
}

export function applicantAdminNotificationEmail(applicant: {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  serviceCategory: string;
  yearsExperience?: number | null;
  availability?: string | null;
  expectedRate?: string | null;
  coverNote?: string | null;
  resumeUrl?: string | null;
}) {
  return emailShell(`
    <h1>New freelancer application</h1>
    <p class="sub">A new freelancer application was submitted on the Trivinex Partners website.</p>
    <div class="card">
      <p><strong>Application #:</strong> ${applicant.id}</p>
      <p><strong>Name:</strong> ${escapeHtml(applicant.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(applicant.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(applicant.phone)}</p>
      <p><strong>Category:</strong> ${escapeHtml(applicant.serviceCategory.replace(/_/g, " "))}</p>
      <p><strong>Experience:</strong> ${applicant.yearsExperience ?? "Not provided"}</p>
      <p><strong>Availability:</strong> ${displayValue(applicant.availability)}</p>
      <p><strong>Expected rate:</strong> ${displayValue(applicant.expectedRate)}</p>
      ${applicant.resumeUrl ? `<p><strong>Resume:</strong> <a href="${escapeHtml(applicant.resumeUrl)}">${escapeHtml(applicant.resumeUrl)}</a></p>` : ""}
    </div>
    ${applicant.coverNote ? `<p style="color:#1D1D1F;font-size:14px;line-height:1.7;"><strong>Cover note</strong><br/>${escapeHtml(applicant.coverNote).replaceAll("\\n", "<br/>")}</p>` : ""}
  `);
}

export function interviewAdminNotificationEmail(booking: {
  id: number;
  applicant: { fullName: string; email: string; phone: string };
  slot: { date: string; startTime: string; meetLink?: string | null };
}) {
  return emailShell(`
    <h1>Interview scheduled</h1>
    <p class="sub">An interview was scheduled from the admin or applicant flow.</p>
    <div class="card">
      <p><strong>Booking #:</strong> ${booking.id}</p>
      <p><strong>Applicant:</strong> ${escapeHtml(booking.applicant.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(booking.applicant.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(booking.applicant.phone)}</p>
      ${slotDetails(booking.slot)}
    </div>
  `);
}
