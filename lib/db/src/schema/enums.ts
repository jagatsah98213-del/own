import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "EMPLOYEE"]);

export const payoutMethodEnum = pgEnum("payout_method", [
  "BANK_TRANSFER",
  "PHONEPE",
  "PAYPAL",
  "ESEWA",
]);

export const slotPurposeEnum = pgEnum("slot_purpose", [
  "INTERVIEW",
  "CLIENT_MEETING",
]);

export const serviceCategoryEnum = pgEnum("service_category", [
  "WEB_DEVELOPMENT",
  "VIDEO_EDITING",
  "PHOTOGRAPHY_VIDEOGRAPHY",
  "GRAPHIC_DESIGN",
  "CONTENT_WRITING",
  "SEO_DIGITAL_MARKETING",
]);

export const applicantStatusEnum = pgEnum("applicant_status", [
  "applied",
  "interview_scheduled",
  "interviewed",
  "selected",
  "rejected",
]);

export const interviewBookingStatusEnum = pgEnum("interview_booking_status", [
  "scheduled",
  "completed",
  "no_show",
  "cancelled",
]);

export const meetingBookingStatusEnum = pgEnum("meeting_booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "contacted",
  "converted",
  "closed",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "new",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
]);

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "assigned",
  "in_progress",
  "submitted",
  "approved",
]);

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid"]);

export const portfolioMediaTypeEnum = pgEnum("portfolio_media_type", [
  "image",
  "video",
  "link",
]);
