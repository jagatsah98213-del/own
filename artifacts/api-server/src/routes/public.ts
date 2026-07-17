import { Router, type IRouter } from "express";
import { and, eq, inArray } from "drizzle-orm";
import {
  db,
  servicesTable,
  servicePlansTable,
  portfolioItemsTable,
  testimonialsTable,
  faqsTable,
  slotsTable,
  clientInquiriesTable,
  meetingBookingsTable,
  applicantsTable,
  interviewBookingsTable,
  siteSettingsTable,
} from "@workspace/db";
import {
  sendEmail,
  clientInquiryConfirmationEmail,
  freelancerApplicationConfirmationEmail,
} from "../lib/email";
import {
  ListPublicServicesResponse,
  ListPublicServicePlansResponse,
  ListPublicPortfolioItemsQueryParams,
  ListPublicPortfolioItemsResponse,
  ListPublicTestimonialsResponse,
  ListPublicMeetingSlotsResponse,
  ListPublicInterviewSlotsQueryParams,
  ListPublicInterviewSlotsResponse,
  CreateInquiryBody,
  CreateInquiryResponse,
  CreateMeetingBookingBody,
  CreateMeetingBookingResponse,
  CreateApplicantBody,
  CreateApplicantResponse,
  CreateInterviewBookingBody,
  CreateInterviewBookingResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/public/services", async (_req, res) => {
  const serviceRows = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.isActive, true))
    .orderBy(servicesTable.sortOrder);
  const planRows = serviceRows.length > 0
    ? await db
        .select()
        .from(servicePlansTable)
        .where(and(
          inArray(servicePlansTable.serviceId, serviceRows.map(s => s.id)),
          eq(servicePlansTable.isActive, true),
        ))
        .orderBy(servicePlansTable.sortOrder)
    : [];
  const rows = serviceRows.map(s => ({ ...s, plans: planRows.filter(p => p.serviceId === s.id) }));
  res.json(ListPublicServicesResponse.parse(rows));
});

router.get("/public/services/:slug/plans", async (req, res) => {
  const [service] = await db
    .select()
    .from(servicesTable)
    .where(and(eq(servicesTable.slug, req.params.slug), eq(servicesTable.isActive, true)));
  if (!service) { res.status(404).json({ message: "Service not found" }); return; }
  const plans = await db
    .select()
    .from(servicePlansTable)
    .where(and(eq(servicePlansTable.serviceId, service.id), eq(servicePlansTable.isActive, true)))
    .orderBy(servicePlansTable.sortOrder);
  res.json(ListPublicServicePlansResponse.parse(plans));
});

router.get(["/public/portfolio-items", "/public/portfolio"], async (req, res) => {
  const query = ListPublicPortfolioItemsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(portfolioItemsTable)
    .where(query.category ? eq(portfolioItemsTable.serviceCategory, query.category) : undefined)
    .orderBy(portfolioItemsTable.sortOrder);
  res.json(ListPublicPortfolioItemsResponse.parse(rows));
});

router.get("/public/testimonials", async (_req, res) => {
  const rows = await db.select().from(testimonialsTable).where(eq(testimonialsTable.isPublished, true));
  res.json(ListPublicTestimonialsResponse.parse(rows));
});

router.get("/public/meeting-slots", async (_req, res) => {
  const rows = await db
    .select()
    .from(slotsTable)
    .where(eq(slotsTable.purpose, "CLIENT_MEETING"))
    .orderBy(slotsTable.date, slotsTable.startTime);
  res.json(ListPublicMeetingSlotsResponse.parse(rows.filter((r) => r.booked < r.capacity)));
});

router.get("/public/interview-slots", async (req, res) => {
  ListPublicInterviewSlotsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(slotsTable)
    .where(eq(slotsTable.purpose, "INTERVIEW"))
    .orderBy(slotsTable.date, slotsTable.startTime);
  res.json(ListPublicInterviewSlotsResponse.parse(rows.filter((r) => r.booked < r.capacity)));
});

router.get("/public/site-settings", async (_req, res) => {
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;
  res.json(settings);
});

router.post("/public/inquiries", async (req, res) => {
  const body = CreateInquiryBody.parse(req.body);
  const [inquiry] = await db
    .insert(clientInquiriesTable)
    .values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      serviceNeeded: body.serviceNeeded,
      projectDetails: body.projectDetails,
      budgetRange: body.budgetRange,
      timeline: body.timeline,
      servicePlanId: body.servicePlanId,
    })
    .returning();
  // Send confirmation email (non-blocking)
  sendEmail(
    inquiry.email,
    "We've Received Your Quote Request — Trivinex Partners",
    clientInquiryConfirmationEmail(inquiry.name, inquiry.serviceNeeded),
  ).catch(() => {});
  res.status(201).json(CreateInquiryResponse.parse(inquiry));
});

router.post("/public/meeting-bookings", async (req, res) => {
  const body = CreateMeetingBookingBody.parse(req.body);
  const [slot] = await db.select().from(slotsTable).where(eq(slotsTable.id, body.slotId));
  if (!slot || slot.purpose !== "CLIENT_MEETING" || slot.booked >= slot.capacity) {
    res.status(400).json({ message: "This slot is no longer available" });
    return;
  }

  const [booking] = await db
    .insert(meetingBookingsTable)
    .values({
      slotId: body.slotId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      notes: body.notes,
    })
    .returning();
  await db
    .update(slotsTable)
    .set({ booked: slot.booked + 1 })
    .where(eq(slotsTable.id, slot.id));

  res.status(201).json(CreateMeetingBookingResponse.parse({ ...booking, slot: { ...slot, booked: slot.booked + 1 } }));
});

router.post("/public/applicants", async (req, res) => {
  const body = CreateApplicantBody.parse(req.body);
  const [applicant] = await db
    .insert(applicantsTable)
    .values({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      serviceCategory: body.serviceCategory,
      portfolioLinks: body.portfolioLinks ?? [],
      yearsExperience: body.yearsExperience,
      equipmentOwned: body.equipmentOwned,
      availability: body.availability,
      expectedRate: body.expectedRate,
      preferredPayout: body.preferredPayout,
      coverNote: body.coverNote,
      resumeUrl: body.resumeUrl,
    })
    .returning();
  // Send confirmation email (non-blocking)
  sendEmail(
    applicant.email,
    "Your Application Has Been Received — Trivinex Partners",
    freelancerApplicationConfirmationEmail(applicant.fullName, applicant.serviceCategory),
  ).catch(() => {});
  res.status(201).json(CreateApplicantResponse.parse(applicant));
});

router.get("/public/faqs", async (_req, res) => {
  const rows = await db
    .select()
    .from(faqsTable)
    .where(eq(faqsTable.isPublished, true))
    .orderBy(faqsTable.sortOrder, faqsTable.id);
  res.json(rows);
});

router.post("/public/interview-bookings", async (req, res) => {
  const body = CreateInterviewBookingBody.parse(req.body);
  const [slot] = await db.select().from(slotsTable).where(eq(slotsTable.id, body.slotId));
  if (!slot || slot.purpose !== "INTERVIEW" || slot.booked >= slot.capacity) {
    res.status(400).json({ message: "This slot is no longer available" });
    return;
  }

  const [booking] = await db
    .insert(interviewBookingsTable)
    .values({ applicantId: body.applicantId, slotId: body.slotId })
    .returning();
  await db
    .update(slotsTable)
    .set({ booked: slot.booked + 1 })
    .where(eq(slotsTable.id, slot.id));
  await db
    .update(applicantsTable)
    .set({ status: "interview_scheduled" })
    .where(eq(applicantsTable.id, body.applicantId));

  res.status(201).json(CreateInterviewBookingResponse.parse(booking));
});

export default router;
