import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import {
  db,
  servicesTable,
  portfolioItemsTable,
  testimonialsTable,
  slotsTable,
  clientInquiriesTable,
  meetingBookingsTable,
  applicantsTable,
  interviewBookingsTable,
} from "@workspace/db";
import {
  ListPublicServicesResponse,
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
  const rows = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.isActive, true))
    .orderBy(servicesTable.sortOrder);
  res.json(ListPublicServicesResponse.parse(rows));
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
    })
    .returning();
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
  res.status(201).json(CreateApplicantResponse.parse(applicant));
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
