import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { and, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import {
  db,
  applicantsTable,
  interviewBookingsTable,
  meetingBookingsTable,
  slotsTable,
  employeesTable,
  usersTable,
  clientInquiriesTable,
  projectsTable,
  projectAssignmentsTable,
  paymentsTable,
  servicesTable,
  portfolioItemsTable,
  testimonialsTable,
  faqsTable,
  auditLogsTable,
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
  SelectApplicantParams,
  SelectApplicantResponse,
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
  ListAdminEmployeesResponse,
  CreateAdminEmployeeBody,
  CreateAdminEmployeeResponse,
  UpdateAdminEmployeeParams,
  UpdateAdminEmployeeBody,
  UpdateAdminEmployeeResponse,
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
  CreateAdminProjectAssignmentParams,
  CreateAdminProjectAssignmentBody,
  CreateAdminProjectAssignmentResponse,
  ListAdminPaymentsResponse,
  CreateAdminPaymentBody,
  CreateAdminPaymentResponse,
  UpdateAdminPaymentParams,
  UpdateAdminPaymentBody,
  UpdateAdminPaymentResponse,
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
} from "@workspace/api-zod";
import { requireRole } from "../lib/auth";
import { recordAuditLog } from "../lib/auditLog";

const router: IRouter = Router();

router.use("/admin", requireRole("ADMIN"));

function generateTempPassword(): string {
  return crypto.randomBytes(9).toString("base64url");
}

// ---------- Dashboard ----------

router.get("/admin/dashboard", async (_req, res) => {
  const now = new Date();

  const [
    [newApplicants],
    [interviewsThisWeek],
    [activeProjects],
    [pendingPayouts],
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
      .from(paymentsTable)
      .where(eq(paymentsTable.status, "pending")),

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
      pendingPayouts: pendingPayouts?.count ?? 0,
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

router.post("/admin/applicants/:id/select", async (req, res) => {
  const params = SelectApplicantParams.parse(req.params);
  const [applicant] = await db.select().from(applicantsTable).where(eq(applicantsTable.id, params.id));
  if (!applicant) {
    res.status(404).json({ message: "Applicant not found" });
    return;
  }

  const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, applicant.email.toLowerCase()));
  if (existingUser) {
    res.status(409).json({ message: "A user with this email already exists" });
    return;
  }

  const temporaryPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  const [user] = await db
    .insert(usersTable)
    .values({ email: applicant.email.toLowerCase(), passwordHash, role: "EMPLOYEE", mustChangePassword: "true" })
    .returning();

  const [employee] = await db
    .insert(employeesTable)
    .values({
      applicantId: applicant.id,
      userId: user.id,
      fullName: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      serviceCategory: applicant.serviceCategory,
      payoutMethod: applicant.preferredPayout ?? undefined,
    })
    .returning();

  await db.update(applicantsTable).set({ status: "selected" }).where(eq(applicantsTable.id, applicant.id));
  await recordAuditLog(String(req.session.userId), "applicant.select", { applicantId: applicant.id, employeeId: employee.id });

  res.json(SelectApplicantResponse.parse({ employee, temporaryPassword }));
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

// ---------- Employees ----------

router.get("/admin/employees", async (_req, res) => {
  const rows = await db.select().from(employeesTable).orderBy(desc(employeesTable.createdAt));
  res.json(ListAdminEmployeesResponse.parse(rows));
});

router.post("/admin/employees", async (req, res) => {
  const body = CreateAdminEmployeeBody.parse(req.body);
  const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, body.email.toLowerCase()));
  if (existingUser) {
    res.status(409).json({ message: "A user with this email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ email: body.email.toLowerCase(), passwordHash, role: "EMPLOYEE" })
    .returning();

  const [employee] = await db
    .insert(employeesTable)
    .values({
      userId: user.id,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      serviceCategory: body.serviceCategory,
    })
    .returning();

  await recordAuditLog(String(req.session.userId), "employee.create", { employeeId: employee.id });
  res.status(201).json(CreateAdminEmployeeResponse.parse({ employee, temporaryPassword: body.password }));
});

router.patch("/admin/employees/:id", async (req, res) => {
  const params = UpdateAdminEmployeeParams.parse(req.params);
  const body = UpdateAdminEmployeeBody.parse(req.body);
  const [updated] = await db
    .update(employeesTable)
    .set(body)
    .where(eq(employeesTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  await recordAuditLog(String(req.session.userId), "employee.update", { employeeId: params.id, ...body });
  res.json(UpdateAdminEmployeeResponse.parse(updated));
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

router.post("/admin/projects/:id/assignments", async (req, res) => {
  const params = CreateAdminProjectAssignmentParams.parse(req.params);
  const body = CreateAdminProjectAssignmentBody.parse(req.body);
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, params.id));
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  const [assignment] = await db
    .insert(projectAssignmentsTable)
    .values({ projectId: params.id, employeeId: body.employeeId })
    .returning();
  await recordAuditLog(String(req.session.userId), "project.assign", { projectId: params.id, employeeId: body.employeeId });
  res.status(201).json(CreateAdminProjectAssignmentResponse.parse({ ...assignment, project }));
});

// ---------- Payments ----------

router.get("/admin/payments", async (_req, res) => {
  const rows = await db
    .select({ payment: paymentsTable, project: projectsTable })
    .from(paymentsTable)
    .innerJoin(projectsTable, eq(paymentsTable.projectId, projectsTable.id))
    .orderBy(desc(paymentsTable.createdAt));
  res.json(ListAdminPaymentsResponse.parse(rows.map((r) => ({ ...r.payment, project: r.project }))));
});

router.post("/admin/payments", async (req, res) => {
  const body = CreateAdminPaymentBody.parse(req.body);
  const [payment] = await db.insert(paymentsTable).values(body).returning();
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, payment.projectId));
  await recordAuditLog(String(req.session.userId), "payment.create", { paymentId: payment.id });
  res.status(201).json(CreateAdminPaymentResponse.parse({ ...payment, project }));
});

router.patch("/admin/payments/:id", async (req, res) => {
  const params = UpdateAdminPaymentParams.parse(req.params);
  const body = UpdateAdminPaymentBody.parse(req.body);
  const [updated] = await db
    .update(paymentsTable)
    .set({ ...body, paidAt: body.status === "paid" ? new Date() : undefined })
    .where(eq(paymentsTable.id, params.id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, updated.projectId));
  await recordAuditLog(String(req.session.userId), "payment.update", { paymentId: params.id, ...body });
  res.json(UpdateAdminPaymentResponse.parse({ ...updated, project }));
});

// ---------- Services ----------

router.get("/admin/services", async (_req, res) => {
  const rows = await db.select().from(servicesTable).orderBy(servicesTable.sortOrder);
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
