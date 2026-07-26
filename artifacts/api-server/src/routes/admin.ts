import { Router, type IRouter } from "express";
import { and, desc, eq, gte, ilike, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  applicantsTable,
  interviewBookingsTable,
  meetingBookingsTable,
  slotsTable,
  clientInquiriesTable,
  projectsTable,
  servicesTable,
  servicePlansTable,
  portfolioItemsTable,
  testimonialsTable,
  faqsTable,
  auditLogsTable,
  siteSettingsTable,
  weeklyScheduleRulesTable,
} from "@workspace/db";
import {
  GetAdminDashboardResponse,
  ListAdminApplicantsQueryParams,
  ListAdminApplicantsResponse,
  GetAdminApplicantParams,
  GetAdminApplicantResponse,
  UpdateAdminApplicantParams,
  UpdateAdminApplicantBody,
  UpdateAdminApplicantResponse,
  RejectApplicantParams,
  RejectApplicantResponse,
  ListAdminInterviewSlotsResponse,
  CreateAdminInterviewSlotBody,
  CreateAdminInterviewSlotResponse,
  UpdateAdminInterviewSlotParams,
  UpdateAdminInterviewSlotBody,
  UpdateAdminInterviewSlotResponse,
  ListAdminMeetingSlotsResponse,
  CreateAdminMeetingSlotBody,
  CreateAdminMeetingSlotResponse,
  UpdateAdminMeetingSlotParams,
  UpdateAdminMeetingSlotBody,
  UpdateAdminMeetingSlotResponse,
  ListAdminMeetingBookingsResponse,
  UpdateAdminMeetingBookingParams,
  UpdateAdminMeetingBookingBody,
  UpdateAdminMeetingBookingResponse,
  ListAdminInquiriesResponse,
  UpdateAdminInquiryParams,
  UpdateAdminInquiryBody,
  UpdateAdminInquiryResponse,
  ConvertInquiryToProjectParams,
  ConvertInquiryToProjectBody,
  ConvertInquiryToProjectResponse,
  ListAdminProjectsResponse,
  CreateAdminProjectBody,
  CreateAdminProjectResponse,
  UpdateAdminProjectParams,
  UpdateAdminProjectBody,
  UpdateAdminProjectResponse,
  ListAdminServicesResponse,
  CreateAdminServiceBody,
  CreateAdminServiceResponse,
  UpdateAdminServiceParams,
  UpdateAdminServiceBody,
  UpdateAdminServiceResponse,
  DeleteAdminServiceParams,
  ListAdminPortfolioItemsResponse,
  CreateAdminPortfolioItemBody,
  CreateAdminPortfolioItemResponse,
  UpdateAdminPortfolioItemParams,
  UpdateAdminPortfolioItemBody,
  UpdateAdminPortfolioItemResponse,
  DeleteAdminPortfolioItemParams,
  ListAdminTestimonialsResponse,
  CreateAdminTestimonialBody,
  CreateAdminTestimonialResponse,
  UpdateAdminTestimonialParams,
  UpdateAdminTestimonialBody,
  UpdateAdminTestimonialResponse,
  DeleteAdminTestimonialParams,
  ListAdminAuditLogsQueryParams,
  ListAdminAuditLogsResponse,
  ListAdminServicePlansResponse,
  CreateAdminServicePlanBody,
  CreateAdminServicePlanResponse,
  UpdateAdminServicePlanParams,
  UpdateAdminServicePlanBody,
  UpdateAdminServicePlanResponse,
  DeleteAdminServicePlanParams,
} from "@workspace/api-zod";
import { requireRole } from "../lib/auth";
import { recordAuditLog } from "../lib/auditLog";

const router: IRouter = Router();

router.use("/admin", requireRole("ADMIN"));

// ---------- Dashboard ----------

router.get("/admin/dashboard", async (_req, res) => {
  const now = new Date();

  const [
    [newApplicants],
    [interviewsThisWeek],
    [activeProjects],
    [newInquiries],
    [upcomingConsultations],
    applicantsByStatusRows,
    projectsByStatusRows,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` })
      .from(applicantsTable)
      .where(eq(applicantsTable.status, "applied")),

    db.select({ count: sql<number>`count(*)::int` })
      .from(interviewBookingsTable)
      .innerJoin(slotsTable, eq(interviewBookingsTable.slotId, slotsTable.id))
      .where(and(gte(slotsTable.date, now.toISOString().slice(0, 10)), eq(interviewBookingsTable.status, "scheduled"))),

    db.select({ count: sql<number>`count(*)::int` })
      .from(projectsTable)
      .where(eq(projectsTable.status, "in_progress")),

    db.select({ count: sql<number>`count(*)::int` })
      .from(clientInquiriesTable)
      .where(eq(clientInquiriesTable.status, "new")),

    db.select({ count: sql<number>`count(*)::int` })
      .from(meetingBookingsTable)
      .where(eq(meetingBookingsTable.status, "confirmed")),

    db.select({ status: applicantsTable.status, count: sql<number>`count(*)::int` })
      .from(applicantsTable)
      .groupBy(applicantsTable.status),

    db.select({ status: projectsTable.status, count: sql<number>`count(*)::int` })
      .from(projectsTable)
      .groupBy(projectsTable.status),
  ]);

  res.json(
    GetAdminDashboardResponse.parse({
      newApplicants: newApplicants?.count ?? 0,
      interviewsThisWeek: interviewsThisWeek?.count ?? 0,
      activeProjects: activeProjects?.count ?? 0,
      newInquiries: newInquiries?.count ?? 0,
      upcomingConsultations: upcomingConsultations?.count ?? 0,
      applicantsByStatus: Object.fromEntries(applicantsByStatusRows.map((r) => [r.status, r.count])),
      projectsByStatus: Object.fromEntries(projectsByStatusRows.map((r) => [r.status, r.count])),
    }),
  );
});

// ---------- Applicants ----------

router.get("/admin/applicants", async (req, res) => {
  const query = ListAdminApplicantsQueryParams.parse(req.query);
  const conditions = [];
  if (query.status) conditions.push(eq(applicantsTable.status, query.status as (typeof applicantsTable.status.enumValues)[number]));
  if (query.serviceCategory) conditions.push(eq(applicantsTable.serviceCategory, query.serviceCategory));

  const rows = await db
    .select()
    .from(applicantsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(applicantsTable.createdAt));
  res.json(ListAdminApplicantsResponse.parse(rows));
});

router.get("/admin/applicants/:id", async (req, res) => {
  const params = GetAdminApplicantParams.parse(req.params);
  const [applicant] = await db.select().from(applicantsTable).where(eq(applicantsTable.id, params.id));
  if (!applicant) {
    res.status(404).json({ message: "Applicant not found" });
    return;
  }
  res.json(GetAdminApplicantResponse.parse(applicant));
});

router.patch("/admin/applicants/:id", async (req, res) => {
  const params = UpdateAdminApplicantParams.parse(req.params);
  const body = UpdateAdminApplicantBody.parse(req.body);
  const [updated] = await db
    .update(applicantsTable)
    .set(body)
    .where(eq(applicantsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Applicant not found" });
    return;
  }
  await recordAuditLog(String(req.session.userId), "applicant.update", { applicantId: params.id, ...body });
  res.json(UpdateAdminApplicantResponse.parse(updated));
});

router.post("/admin/applicants/:id/reject", async (req, res) => {
  const params = RejectApplicantParams.parse(req.params);
  const [updated] = await db
    .update(applicantsTable)
    .set({ status: "rejected" })
    .where(eq(applicantsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Applicant not found" });
    return;
  }
  await recordAuditLog(String(req.session.userId), "applicant.reject", { applicantId: params.id });
  res.json(RejectApplicantResponse.parse(updated));
});

router.delete("/admin/applicants/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(applicantsTable).where(eq(applicantsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ message: "Applicant not found" }); return; }
  await recordAuditLog(String(req.session.userId), "applicant.delete", { applicantId: id });
  res.status(204).send();
});

// ---------- Interview slots ----------

router.get("/admin/interview-slots", async (_req, res) => {
  const rows = await db
    .select()
    .from(slotsTable)
    .where(eq(slotsTable.purpose, "INTERVIEW"))
    .orderBy(slotsTable.date, slotsTable.startTime);
  res.json(ListAdminInterviewSlotsResponse.parse(rows));
});

router.post("/admin/interview-slots", async (req, res) => {
  const body = CreateAdminInterviewSlotBody.parse(req.body);
  const [slot] = await db
    .insert(slotsTable)
    .values({ ...body, date: body.date.toISOString().slice(0, 10) })
    .returning();
  res.status(201).json(CreateAdminInterviewSlotResponse.parse(slot));
});

router.patch("/admin/interview-slots/:id", async (req, res) => {
  const params = UpdateAdminInterviewSlotParams.parse(req.params);
  const body = UpdateAdminInterviewSlotBody.parse(req.body);
  const [updated] = await db
    .update(slotsTable)
    .set({ ...body, date: body.date ? body.date.toISOString().slice(0, 10) : undefined })
    .where(eq(slotsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Slot not found" });
    return;
  }
  res.json(UpdateAdminInterviewSlotResponse.parse(updated));
});

// ---------- Meeting (consultation) slots ----------

router.get("/admin/meeting-slots", async (_req, res) => {
  const rows = await db
    .select()
    .from(slotsTable)
    .where(eq(slotsTable.purpose, "CLIENT_MEETING"))
    .orderBy(slotsTable.date, slotsTable.startTime);
  res.json(ListAdminMeetingSlotsResponse.parse(rows));
});

router.post("/admin/meeting-slots", async (req, res) => {
  const body = CreateAdminMeetingSlotBody.parse(req.body);
  const [slot] = await db
    .insert(slotsTable)
    .values({ ...body, date: body.date.toISOString().slice(0, 10) })
    .returning();
  res.status(201).json(CreateAdminMeetingSlotResponse.parse(slot));
});

router.delete("/admin/meeting-slots/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ message: "Invalid slot id" }); return; }
  // Prevent deleting a slot that already has a booking
  const [booked] = await db.select().from(meetingBookingsTable).where(eq(meetingBookingsTable.slotId, id));
  if (booked) { res.status(409).json({ message: "Cannot delete a slot that has an active booking" }); return; }
  await db.delete(slotsTable).where(eq(slotsTable.id, id));
  res.status(204).end();
});

router.patch("/admin/meeting-slots/:id", async (req, res) => {
  const params = UpdateAdminMeetingSlotParams.parse(req.params);
  const body = UpdateAdminMeetingSlotBody.parse(req.body);
  const [updated] = await db
    .update(slotsTable)
    .set({ ...body, date: body.date ? body.date.toISOString().slice(0, 10) : undefined })
    .where(eq(slotsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Slot not found" });
    return;
  }
  res.json(UpdateAdminMeetingSlotResponse.parse(updated));
});

// ---------- Meeting bookings ----------

router.get("/admin/meeting-bookings", async (_req, res) => {
  const rows = await db
    .select({ booking: meetingBookingsTable, slot: slotsTable })
    .from(meetingBookingsTable)
    .innerJoin(slotsTable, eq(meetingBookingsTable.slotId, slotsTable.id))
    .orderBy(desc(meetingBookingsTable.createdAt));
  res.json(ListAdminMeetingBookingsResponse.parse(rows.map((r) => ({ ...r.booking, slot: r.slot }))));
});

router.patch("/admin/meeting-bookings/:id", async (req, res) => {
  const params = UpdateAdminMeetingBookingParams.parse(req.params);
  const body = UpdateAdminMeetingBookingBody.parse(req.body);
  const [updated] = await db
    .update(meetingBookingsTable)
    .set(body)
    .where(eq(meetingBookingsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  const [slot] = await db.select().from(slotsTable).where(eq(slotsTable.id, updated.slotId));
  res.json(UpdateAdminMeetingBookingResponse.parse({ ...updated, slot }));
});

// ---------- Client inquiries ----------

router.get("/admin/inquiries", async (_req, res) => {
  const rows = await db.select().from(clientInquiriesTable).orderBy(desc(clientInquiriesTable.createdAt));
  res.json(ListAdminInquiriesResponse.parse(rows));
});

router.patch("/admin/inquiries/:id", async (req, res) => {
  const params = UpdateAdminInquiryParams.parse(req.params);
  const body = UpdateAdminInquiryBody.parse(req.body);
  const [updated] = await db
    .update(clientInquiriesTable)
    .set(body)
    .where(eq(clientInquiriesTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Inquiry not found" });
    return;
  }
  res.json(UpdateAdminInquiryResponse.parse(updated));
});

router.post("/admin/inquiries/:id/convert-to-project", async (req, res) => {
  const params = ConvertInquiryToProjectParams.parse(req.params);
  const body = ConvertInquiryToProjectBody.parse(req.body);
  const [inquiry] = await db.select().from(clientInquiriesTable).where(eq(clientInquiriesTable.id, params.id));
  if (!inquiry) {
    res.status(404).json({ message: "Inquiry not found" });
    return;
  }

  const [project] = await db
    .insert(projectsTable)
    .values({
      inquiryId: inquiry.id,
      clientName: inquiry.name,
      clientEmail: inquiry.email,
      clientPhone: inquiry.phone,
      serviceCategory: inquiry.serviceNeeded,
      title: body.title,
      description: body.description,
      deadline: body.deadline,
    })
    .returning();

  await db.update(clientInquiriesTable).set({ status: "converted" }).where(eq(clientInquiriesTable.id, inquiry.id));
  await recordAuditLog(String(req.session.userId), "inquiry.convert", { inquiryId: inquiry.id, projectId: project.id });

  res.status(201).json(ConvertInquiryToProjectResponse.parse(project));
});

router.delete("/admin/inquiries/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(clientInquiriesTable).where(eq(clientInquiriesTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ message: "Inquiry not found" }); return; }
  await recordAuditLog(String(req.session.userId), "inquiry.delete", { inquiryId: id });
  res.status(204).send();
});

// ---------- Projects ----------

router.get("/admin/projects", async (_req, res) => {
  const rows = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
  res.json(ListAdminProjectsResponse.parse(rows));
});

router.post("/admin/projects", async (req, res) => {
  const body = CreateAdminProjectBody.parse(req.body);
  const [project] = await db.insert(projectsTable).values(body).returning();
  await recordAuditLog(String(req.session.userId), "project.create", { projectId: project.id });
  res.status(201).json(CreateAdminProjectResponse.parse(project));
});

router.patch("/admin/projects/:id", async (req, res) => {
  const params = UpdateAdminProjectParams.parse(req.params);
  const body = UpdateAdminProjectBody.parse(req.body);
  const [updated] = await db
    .update(projectsTable)
    .set(body)
    .where(eq(projectsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.json(UpdateAdminProjectResponse.parse(updated));
});

router.delete("/admin/projects/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(projectsTable).where(eq(projectsTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ message: "Project not found" }); return; }
  await recordAuditLog(String(req.session.userId), "project.delete", { projectId: id });
  res.status(204).send();
});

// ---------- Services ----------

router.get("/admin/services", async (_req, res) => {
  const serviceRows = await db.select().from(servicesTable).orderBy(servicesTable.sortOrder);
  const planRows = serviceRows.length > 0
    ? await db.select().from(servicePlansTable)
        .where(inArray(servicePlansTable.serviceId, serviceRows.map(s => s.id)))
        .orderBy(servicePlansTable.sortOrder)
    : [];
  const rows = serviceRows.map(s => ({ ...s, plans: planRows.filter(p => p.serviceId === s.id) }));
  res.json(ListAdminServicesResponse.parse(rows));
});

router.post("/admin/services", async (req, res) => {
  const body = CreateAdminServiceBody.parse(req.body);
  const [service] = await db.insert(servicesTable).values(body).returning();
  res.status(201).json(CreateAdminServiceResponse.parse(service));
});

router.patch("/admin/services/:id", async (req, res) => {
  const params = UpdateAdminServiceParams.parse(req.params);
  const body = UpdateAdminServiceBody.parse(req.body);
  const [updated] = await db
    .update(servicesTable)
    .set(body)
    .where(eq(servicesTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Service not found" });
    return;
  }
  res.json(UpdateAdminServiceResponse.parse(updated));
});

router.delete("/admin/services/:id", async (req, res) => {
  const params = DeleteAdminServiceParams.parse(req.params);
  await db.delete(servicesTable).where(eq(servicesTable.id, params.id));
  res.status(204).end();
});

// ---------- Service Plans ----------

router.get("/admin/service-plans", async (req, res) => {
  const serviceId = Number(req.query.serviceId);
  if (!serviceId || isNaN(serviceId)) {
    res.status(400).json({ message: "serviceId query param required" });
    return;
  }
  const rows = await db
    .select()
    .from(servicePlansTable)
    .where(eq(servicePlansTable.serviceId, serviceId))
    .orderBy(servicePlansTable.sortOrder, servicePlansTable.id);
  res.json(ListAdminServicePlansResponse.parse(rows));
});

router.post("/admin/service-plans", async (req, res) => {
  const body = CreateAdminServicePlanBody.parse(req.body);
  const [plan] = await db.insert(servicePlansTable).values(body).returning();
  res.status(201).json(CreateAdminServicePlanResponse.parse(plan));
});

router.patch("/admin/service-plans/:id", async (req, res) => {
  const params = UpdateAdminServicePlanParams.parse(req.params);
  const body = UpdateAdminServicePlanBody.parse(req.body);
  const [updated] = await db
    .update(servicePlansTable)
    .set(body)
    .where(eq(servicePlansTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Service plan not found" });
    return;
  }
  res.json(UpdateAdminServicePlanResponse.parse(updated));
});

router.delete("/admin/service-plans/:id", async (req, res) => {
  const params = DeleteAdminServicePlanParams.parse(req.params);
  await db.delete(servicePlansTable).where(eq(servicePlansTable.id, params.id));
  res.status(204).end();
});

// ---------- Portfolio items ----------

router.get("/admin/portfolio-items", async (_req, res) => {
  const rows = await db.select().from(portfolioItemsTable).orderBy(portfolioItemsTable.sortOrder);
  res.json(ListAdminPortfolioItemsResponse.parse(rows));
});

router.post("/admin/portfolio-items", async (req, res) => {
  const body = CreateAdminPortfolioItemBody.parse(req.body);
  const [item] = await db.insert(portfolioItemsTable).values(body).returning();
  res.status(201).json(CreateAdminPortfolioItemResponse.parse(item));
});

router.patch("/admin/portfolio-items/:id", async (req, res) => {
  const params = UpdateAdminPortfolioItemParams.parse(req.params);
  const body = UpdateAdminPortfolioItemBody.parse(req.body);
  const [updated] = await db
    .update(portfolioItemsTable)
    .set(body)
    .where(eq(portfolioItemsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Portfolio item not found" });
    return;
  }
  res.json(UpdateAdminPortfolioItemResponse.parse(updated));
});

router.delete("/admin/portfolio-items/:id", async (req, res) => {
  const params = DeleteAdminPortfolioItemParams.parse(req.params);
  await db.delete(portfolioItemsTable).where(eq(portfolioItemsTable.id, params.id));
  res.status(204).end();
});

// ---------- Testimonials ----------

router.get("/admin/testimonials", async (_req, res) => {
  const rows = await db.select().from(testimonialsTable);
  res.json(ListAdminTestimonialsResponse.parse(rows));
});

router.post("/admin/testimonials", async (req, res) => {
  const body = CreateAdminTestimonialBody.parse(req.body);
  const [item] = await db.insert(testimonialsTable).values(body).returning();
  res.status(201).json(CreateAdminTestimonialResponse.parse(item));
});

router.patch("/admin/testimonials/:id", async (req, res) => {
  const params = UpdateAdminTestimonialParams.parse(req.params);
  const body = UpdateAdminTestimonialBody.parse(req.body);
  const [updated] = await db
    .update(testimonialsTable)
    .set(body)
    .where(eq(testimonialsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Testimonial not found" });
    return;
  }
  res.json(UpdateAdminTestimonialResponse.parse(updated));
});

router.delete("/admin/testimonials/:id", async (req, res) => {
  const params = DeleteAdminTestimonialParams.parse(req.params);
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, params.id));
  res.status(204).end();
});

// ---------- FAQs ----------

router.get("/admin/faqs", async (_req, res) => {
  const rows = await db.select().from(faqsTable).orderBy(faqsTable.sortOrder, faqsTable.id);
  res.json(rows);
});

router.post("/admin/faqs", async (req, res) => {
  const { question, answer, sortOrder, isPublished } = req.body;
  if (!question?.trim() || !answer?.trim()) {
    res.status(400).json({ message: "Question and answer are required" });
    return;
  }
  const [row] = await db.insert(faqsTable).values({
    question: question.trim(),
    answer: answer.trim(),
    sortOrder: sortOrder ?? 0,
    isPublished: isPublished ?? true,
  }).returning();
  res.status(201).json(row);
});

router.patch("/admin/faqs/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { question, answer, sortOrder, isPublished } = req.body;
  const updates: Record<string, unknown> = {};
  if (question !== undefined) updates.question = question.trim();
  if (answer !== undefined) updates.answer = answer.trim();
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;
  if (isPublished !== undefined) updates.isPublished = isPublished;
  const [row] = await db.update(faqsTable).set(updates).where(eq(faqsTable.id, id)).returning();
  if (!row) { res.status(404).json({ message: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/faqs/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(faqsTable).where(eq(faqsTable.id, id));
  res.status(204).end();
});

// ---------- Site Settings ----------

router.get("/admin/site-settings", async (_req, res) => {
  const rows = await db.select().from(siteSettingsTable).orderBy(siteSettingsTable.key);
  res.json(rows);
});

router.patch("/admin/site-settings/:key", async (req, res) => {
  const key = req.params.key;
  const { value } = req.body;
  if (typeof value !== "string") {
    res.status(400).json({ message: "value must be a string" });
    return;
  }
  const [updated] = await db
    .update(siteSettingsTable)
    .set({ value, updatedAt: new Date() })
    .where(eq(siteSettingsTable.key, key))
    .returning();
  if (!updated) {
    // upsert if key doesn't exist yet
    const [inserted] = await db
      .insert(siteSettingsTable)
      .values({ key, value, label: key })
      .returning();
    res.json(inserted);
    return;
  }
  await recordAuditLog(String(req.session.userId), "site_settings.update", { key, value });
  res.json(updated);
});

// ---------- Weekly schedule rules ----------

router.get("/admin/schedule-rules", async (_req, res) => {
  const rules = await db.select().from(weeklyScheduleRulesTable).orderBy(weeklyScheduleRulesTable.dayOfWeek, weeklyScheduleRulesTable.startTime);
  res.json(rules);
});

router.post("/admin/schedule-rules", async (req, res) => {
  const body = z.object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().min(1),
    meetLink: z.string().optional(),
  }).parse(req.body);
  const [rule] = await db.insert(weeklyScheduleRulesTable).values(body).returning();
  res.status(201).json(rule);
});

router.delete("/admin/schedule-rules/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(weeklyScheduleRulesTable).where(eq(weeklyScheduleRulesTable.id, id));
  res.status(204).end();
});

// Apply schedule rules: generate slots for next 8 weeks from current rules
router.post("/admin/schedule-rules/apply", async (req, res) => {
  const rules = await db.select().from(weeklyScheduleRulesTable);
  if (rules.length === 0) { res.json({ created: 0 }); return; }

  // Build set of existing (date, startTime) for CLIENT_MEETING to avoid duplicates
  const today = new Date();
  const eightWeeksOut = new Date(today.getTime() + 56 * 24 * 60 * 60 * 1000);
  const existing = await db.select({ date: slotsTable.date, startTime: slotsTable.startTime })
    .from(slotsTable)
    .where(and(
      eq(slotsTable.purpose, "CLIENT_MEETING"),
      gte(slotsTable.date, today.toISOString().slice(0, 10)),
    ));
  const existingSet = new Set(existing.map(s => `${s.date}|${s.startTime}`));

  const toInsert: { purpose: "CLIENT_MEETING"; date: string; startTime: string; capacity: number; meetLink?: string }[] = [];

  for (const rule of rules) {
    // Walk every day from today to 8 weeks out
    const cursor = new Date(today);
    while (cursor <= eightWeeksOut) {
      if (cursor.getDay() === rule.dayOfWeek) {
        const dateStr = cursor.toISOString().slice(0, 10);
        const key = `${dateStr}|${rule.startTime}`;
        if (!existingSet.has(key)) {
          toInsert.push({ purpose: "CLIENT_MEETING", date: dateStr, startTime: rule.startTime, capacity: 1, ...(rule.meetLink ? { meetLink: rule.meetLink } : {}) });
          existingSet.add(key);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  if (toInsert.length > 0) {
    await db.insert(slotsTable).values(toInsert);
  }
  res.json({ created: toInsert.length });
});

// ---------- Audit logs ----------

router.get("/admin/audit-logs", async (req, res) => {
  const query = ListAdminAuditLogsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(auditLogsTable)
    .where(query.q ? or(ilike(auditLogsTable.action, `%${query.q}%`), ilike(auditLogsTable.actorId, `%${query.q}%`)) : undefined)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(200);
  res.json(ListAdminAuditLogsResponse.parse(rows));
});

export default router;
