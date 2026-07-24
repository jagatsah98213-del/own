import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";

const PgSession = connectPgSimple(session);

if (!process.env["SESSION_SECRET"]) {
  throw new Error("SESSION_SECRET environment variable is required but was not provided.");
}

const isProd = process.env["NODE_ENV"] === "production";

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "session",
    createTableIfMissing: false,
  }),
  secret: process.env["SESSION_SECRET"],
  resave: false,
  saveUninitialized: false,
  name: "craftloop.sid",
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: number;
    role?: "ADMIN" | "EMPLOYEE";
    employeeId?: number;
  }
}
