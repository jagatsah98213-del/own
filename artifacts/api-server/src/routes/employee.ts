import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { db, projectAssignmentsTable, projectsTable, employeesTable, paymentsTable, usersTable } from "@workspace/db";
import {
  ListEmployeeAssignmentsResponse,
  UpdateEmployeeAssignmentParams,
  UpdateEmployeeAssignmentBody,
  UpdateEmployeeAssignmentResponse,
  GetEmployeePayoutSettingsResponse,
  UpdateEmployeePayoutSettingsBody,
  UpdateEmployeePayoutSettingsResponse,
  ListEmployeePaymentsResponse,
  UpdateEmployeePasswordBody,
} from "@workspace/api-zod";
import { requireRole, requireEmployeeId } from "../lib/auth";

const router: IRouter = Router();

router.use(requireRole("EMPLOYEE"));

router.get("/employee/assignments", async (req, res) => {
  const employeeId = requireEmployeeId(req);
  const rows = await db
    .select({ assignment: projectAssignmentsTable, project: projectsTable })
    .from(projectAssignmentsTable)
    .innerJoin(projectsTable, eq(projectAssignmentsTable.projectId, projectsTable.id))
    .where(eq(projectAssignmentsTable.employeeId, employeeId));

  res.json(
    ListEmployeeAssignmentsResponse.parse(rows.map((r) => ({ ...r.assignment, project: r.project }))),
  );
});

router.patch("/employee/assignments/:id", async (req, res) => {
  const employeeId = requireEmployeeId(req);
  const params = UpdateEmployeeAssignmentParams.parse(req.params);
  const body = UpdateEmployeeAssignmentBody.parse(req.body);

  const [existing] = await db
    .select()
    .from(projectAssignmentsTable)
    .where(and(eq(projectAssignmentsTable.id, params.id), eq(projectAssignmentsTable.employeeId, employeeId)));

  if (!existing) {
    res.status(404).json({ message: "Assignment not found" });
    return;
  }

  const [updated] = await db
    .update(projectAssignmentsTable)
    .set(body)
    .where(eq(projectAssignmentsTable.id, params.id))
    .returning();

  if (body.deliverableUrl) {
    await db.update(projectsTable).set({ deliverableUrl: body.deliverableUrl }).where(eq(projectsTable.id, existing.projectId));
  }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, existing.projectId));

  res.json(UpdateEmployeeAssignmentResponse.parse({ ...updated, project }));
});

router.get("/employee/payout-settings", async (req, res) => {
  const employeeId = requireEmployeeId(req);
  const [employee] = await db.select().from(employeesTable).where(eq(employeesTable.id, employeeId));
  if (!employee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }
  res.json(
    GetEmployeePayoutSettingsResponse.parse({
      employeeId: employee.id,
      payoutMethod: employee.payoutMethod,
      payoutDetails: employee.payoutDetails,
    }),
  );
});

router.put("/employee/payout-settings", async (req, res) => {
  const employeeId = requireEmployeeId(req);
  const body = UpdateEmployeePayoutSettingsBody.parse(req.body);
  const [updated] = await db
    .update(employeesTable)
    .set({ payoutMethod: body.payoutMethod, payoutDetails: body.payoutDetails })
    .where(eq(employeesTable.id, employeeId))
    .returning();
  res.json(
    UpdateEmployeePayoutSettingsResponse.parse({
      employeeId: updated.id,
      payoutMethod: updated.payoutMethod,
      payoutDetails: updated.payoutDetails,
    }),
  );
});

router.get("/employee/payments", async (req, res) => {
  const employeeId = requireEmployeeId(req);
  const rows = await db
    .select({ payment: paymentsTable, project: projectsTable })
    .from(paymentsTable)
    .innerJoin(projectsTable, eq(paymentsTable.projectId, projectsTable.id))
    .where(eq(paymentsTable.employeeId, employeeId));

  res.json(ListEmployeePaymentsResponse.parse(rows.map((r) => ({ ...r.payment, project: r.project }))));
});

router.put("/employee/password", async (req, res) => {
  const body = UpdateEmployeePasswordBody.parse(req.body);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ message: "Current password is incorrect" });
    return;
  }

  const passwordHash = await bcrypt.hash(body.newPassword, 10);
  await db
    .update(usersTable)
    .set({ passwordHash, mustChangePassword: "false" })
    .where(eq(usersTable.id, user.id));

  res.status(204).end();
});

export default router;
