import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, employeesTable } from "@workspace/db";
import { LoginBody, LoginResponse, GetCurrentUserResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res) => {
  const body = LoginBody.parse(req.body);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email.toLowerCase()));

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  let employeeId: number | undefined;
  if (user.role === "EMPLOYEE") {
    const [employee] = await db.select().from(employeesTable).where(eq(employeesTable.userId, user.id));
    employeeId = employee?.id;
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.employeeId = employeeId;

  res.json(LoginResponse.parse({ id: user.id, email: user.email, role: user.role, employeeId }));
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!));
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  res.json(
    GetCurrentUserResponse.parse({
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: req.session.employeeId,
    }),
  );
});

export default router;
