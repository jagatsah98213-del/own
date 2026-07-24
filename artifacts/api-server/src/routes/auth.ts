import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";
import { eq } from "drizzle-orm";
import { db, usersTable, employeesTable } from "@workspace/db";
import { LoginBody, LoginResponse, GetCurrentUserResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

// Strict rate limit for auth endpoints: 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts — please try again later." },
  skipSuccessfulRequests: true,
});

router.post("/auth/login", authLimiter, async (req, res) => {
  const body = LoginBody.parse(req.body);

  // Admin login requires a valid access key passed as a query param
  const adminKey = process.env["ADMIN_ACCESS_KEY"];
  if (adminKey) {
    const providedKey = req.query["key"] as string | undefined;
    // We'll check the key after we know the role
    const [candidate] = await db.select({ role: usersTable.role }).from(usersTable).where(eq(usersTable.email, body.email.toLowerCase()));
    if (candidate?.role === "ADMIN" && providedKey !== adminKey) {
      // Artificial delay to slow down probing
      await new Promise((r) => setTimeout(r, 500));
      res.status(403).json({ message: "Access denied." });
      return;
    }
  }

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
