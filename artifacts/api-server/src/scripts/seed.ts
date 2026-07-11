import bcrypt from "bcryptjs";
import { db, servicesTable, portfolioItemsTable, testimonialsTable, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";

const services = [
  {
    category: "WEB_DEVELOPMENT" as const,
    title: "Web Development",
    slug: "web-development",
    description: "Custom websites and web apps built for speed, conversion, and scale.",
    startingPrice: "$1,200",
    sortOrder: 1,
  },
  {
    category: "VIDEO_EDITING" as const,
    title: "Video Editing",
    slug: "video-editing",
    description: "Cinematic edits for ads, social content, and long-form storytelling.",
    startingPrice: "$300",
    sortOrder: 2,
  },
  {
    category: "PHOTOGRAPHY_VIDEOGRAPHY" as const,
    title: "Photography & Videography",
    slug: "photography-videography",
    description: "On-location shoots for product, brand, and event coverage.",
    startingPrice: "$500",
    sortOrder: 3,
  },
  {
    category: "GRAPHIC_DESIGN" as const,
    title: "Graphic Design",
    slug: "graphic-design",
    description: "Brand identities, marketing collateral, and packaging design.",
    startingPrice: "$250",
    sortOrder: 4,
  },
  {
    category: "CONTENT_WRITING" as const,
    title: "Content Writing",
    slug: "content-writing",
    description: "Website copy, blogs, and long-form content that ranks and converts.",
    startingPrice: "$150",
    sortOrder: 5,
  },
  {
    category: "SEO_DIGITAL_MARKETING" as const,
    title: "SEO & Digital Marketing",
    slug: "seo-digital-marketing",
    description: "Search strategy, paid campaigns, and growth marketing that compounds.",
    startingPrice: "$600",
    sortOrder: 6,
  },
];

const testimonials = [
  { clientName: "Priya Nair", quote: "Craftloop rebuilt our site in three weeks and conversions doubled.", rating: 5, isPublished: true },
  { clientName: "Marcus Webb", quote: "The video team understood our brand voice instantly.", rating: 5, isPublished: true },
  { clientName: "Sofia Álvarez", quote: "Consistently reliable freelancers, managed like an in-house team.", rating: 4, isPublished: true },
];

async function seed() {
  const existing = await db.select().from(servicesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(servicesTable).values(services);
    logger.info("Seeded services");
  }

  const existingTestimonials = await db.select().from(testimonialsTable).limit(1);
  if (existingTestimonials.length === 0) {
    await db.insert(testimonialsTable).values(testimonials);
    logger.info("Seeded testimonials");
  }

  const adminEmail = "admin@craftloop.app";
  const [existingAdmin] = await db.select().from(usersTable).where((await import("drizzle-orm")).eq(usersTable.email, adminEmail));
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Craftloop!Admin1", 10);
    await db.insert(usersTable).values({ email: adminEmail, passwordHash, role: "ADMIN" });
    logger.info({ adminEmail }, "Seeded admin user with default password Craftloop!Admin1 (change it after first login)");
  }

  process.exit(0);
}

seed().catch((err) => {
  logger.error({ err }, "Seed failed");
  process.exit(1);
});
