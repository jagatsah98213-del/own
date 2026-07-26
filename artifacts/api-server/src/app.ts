import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { sessionMiddleware } from "./lib/session";

const app: Express = express();

// ─── Trust proxy (Replit / Railway reverse proxy) ───────────────────────────
app.set("trust proxy", 1);

// ─── Security headers ────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // CSP managed by Vite / frontend
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProd
      ? { maxAge: 63_072_000, includeSubDomains: true, preload: true }
      : false,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    dnsPrefetchControl: { allow: false },
  }),
);

// ─── Additional security headers ─────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  next();
});

// ─── CORS ────────────────────────────────────────────────────────────────────
const isProd = process.env["NODE_ENV"] === "production";
const rawOrigins = process.env["ALLOWED_ORIGINS"] ?? "";
const allowedOrigins = rawOrigins
  ? rawOrigins.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: isProd && allowedOrigins.length > 0
      ? (origin, cb) => {
          if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
          cb(new Error(`CORS: origin ${origin} not allowed`));
        }
      : true,
    credentials: true,
  }),
);

// ─── Rate limiter (global – tighter limits applied per-route in auth) ────────
const globalLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests — please slow down." },
});
app.use(globalLimiter);

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ─── Session ─────────────────────────────────────────────────────────────────
app.use(sessionMiddleware);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", router);

// ─── 404 catch-all (for API routes) ──────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  logger.error({ err }, message);
  res.status(500).json({ message });
});

export default app;
