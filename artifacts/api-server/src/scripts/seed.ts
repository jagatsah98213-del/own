import bcrypt from "bcryptjs";
import { db, servicesTable, portfolioItemsTable, testimonialsTable, usersTable, servicePlansTable } from "@workspace/db";
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

const portfolioItems = [
  {
    title: "Luxe Realty – Brand Website",
    serviceCategory: "WEB_DEVELOPMENT" as const,
    mediaType: "image" as const,
    mediaUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    description: "A high-converting property listing site with animated hero and integrated CMS.",
    sortOrder: 1, isFeatured: true,
  },
  {
    title: "Pulse Festival – Event Highlight Reel",
    serviceCategory: "VIDEO_EDITING" as const,
    mediaType: "image" as const,
    mediaUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    description: "3-minute cinematic recap of a 3-day music festival, delivered in 48 hours.",
    sortOrder: 2, isFeatured: true,
  },
  {
    title: "Bloom Organics – Product Shoot",
    serviceCategory: "PHOTOGRAPHY_VIDEOGRAPHY" as const,
    mediaType: "image" as const,
    mediaUrl: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80",
    description: "Full e-commerce product photography catalog for a natural skincare brand.",
    sortOrder: 3, isFeatured: true,
  },
  {
    title: "Nova Fitness – Brand Identity",
    serviceCategory: "GRAPHIC_DESIGN" as const,
    mediaType: "image" as const,
    mediaUrl: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&q=80",
    description: "Complete visual identity: logo, typography system, and brand guidelines.",
    sortOrder: 4, isFeatured: false,
  },
  {
    title: "TechVault – SEO Content Strategy",
    serviceCategory: "CONTENT_WRITING" as const,
    mediaType: "image" as const,
    mediaUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    description: "60-article content plan driving 340% organic traffic growth in 6 months.",
    sortOrder: 5, isFeatured: false,
  },
  {
    title: "CoreMetrics – Paid Search Campaign",
    serviceCategory: "SEO_DIGITAL_MARKETING" as const,
    mediaType: "image" as const,
    mediaUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
    description: "Google Ads + Meta campaign achieving 4.2× ROAS for a B2B SaaS product.",
    sortOrder: 6, isFeatured: false,
  },
];

const testimonials = [
  { clientName: "Priya Nair", quote: "Trivinex Partners rebuilt our site in three weeks and conversions doubled.", rating: 5, isPublished: true },
  { clientName: "Marcus Webb", quote: "The video team understood our brand voice instantly.", rating: 5, isPublished: true },
  { clientName: "Sofia Álvarez", quote: "Consistently reliable freelancers, managed like an in-house team.", rating: 4, isPublished: true },
];

const servicePlansData: Record<string, Array<{ name: string; description: string; pricingType: "ONE_TIME" | "MONTHLY"; startingPrice: string; badge: "NONE" | "HOT" | "NEW" | "POPULAR" | "BEST_VALUE"; sortOrder: number }>> = {
  WEB_DEVELOPMENT: [
    { name: "Starter Website", description: "A clean, professional 4–6 page site — ideal for small businesses needing an online presence fast.", pricingType: "ONE_TIME", startingPrice: "Starting at $1,200", badge: "NONE", sortOrder: 1 },
    { name: "Custom Web Development", description: "Fully bespoke design and functionality — booking systems, dashboards, integrations, anything off-the-shelf can't do.", pricingType: "ONE_TIME", startingPrice: "Starting at $3,500", badge: "POPULAR", sortOrder: 2 },
    { name: "E-commerce Website", description: "Full online store build with product catalog, cart, and checkout.", pricingType: "ONE_TIME", startingPrice: "Starting at $2,500", badge: "NONE", sortOrder: 3 },
    { name: "Monthly Website Management", description: "Ongoing updates, content edits, security monitoring, and hosting support so the site never goes stale.", pricingType: "MONTHLY", startingPrice: "$299/mo", badge: "NEW", sortOrder: 4 },
  ],
  VIDEO_EDITING: [
    { name: "Reel & Short-Form Editing", description: "Fast-turnaround edits for Instagram Reels, YouTube Shorts, and TikTok.", pricingType: "ONE_TIME", startingPrice: "Starting at $80", badge: "HOT", sortOrder: 1 },
    { name: "Long-Form Video Editing", description: "Full YouTube videos, vlogs, and podcast episode edits.", pricingType: "ONE_TIME", startingPrice: "Starting at $150", badge: "NONE", sortOrder: 2 },
    { name: "Wedding Video Editing", description: "Cinematic edits of full wedding footage into a highlight film and full-ceremony cut.", pricingType: "ONE_TIME", startingPrice: "Starting at $400", badge: "HOT", sortOrder: 3 },
    { name: "Corporate & Promo Video Editing", description: "Polished edits for ads, product launches, and internal company videos.", pricingType: "ONE_TIME", startingPrice: "Starting at $250", badge: "NONE", sortOrder: 4 },
  ],
  PHOTOGRAPHY_VIDEOGRAPHY: [
    { name: "Event Photography", description: "Weddings, parties, and corporate event coverage.", pricingType: "ONE_TIME", startingPrice: "Starting at $500", badge: "NONE", sortOrder: 1 },
    { name: "Product Photography", description: "Clean, e-commerce-ready product shots.", pricingType: "ONE_TIME", startingPrice: "Starting at $200", badge: "POPULAR", sortOrder: 2 },
    { name: "Portrait & Personal Branding Shoot", description: "Professional headshots and personal brand photo sets.", pricingType: "ONE_TIME", startingPrice: "Starting at $300", badge: "NONE", sortOrder: 3 },
    { name: "Wedding Videography", description: "Full-day wedding filming, paired with the Wedding Video Editing plan above.", pricingType: "ONE_TIME", startingPrice: "Starting at $800", badge: "HOT", sortOrder: 4 },
  ],
  GRAPHIC_DESIGN: [
    { name: "Logo & Brand Identity", description: "Logo design plus a basic brand kit (colors, fonts, usage guide).", pricingType: "ONE_TIME", startingPrice: "Starting at $250", badge: "NONE", sortOrder: 1 },
    { name: "Social Media Creative Pack", description: "A recurring batch of on-brand social post designs each month.", pricingType: "MONTHLY", startingPrice: "$199/mo", badge: "POPULAR", sortOrder: 2 },
    { name: "Print & Packaging Design", description: "Business cards, brochures, posters, and product packaging.", pricingType: "ONE_TIME", startingPrice: "Starting at $150", badge: "NONE", sortOrder: 3 },
    { name: "Custom Design Project", description: "One-off design work that doesn't fit a standard package.", pricingType: "ONE_TIME", startingPrice: "Starting at $100", badge: "NONE", sortOrder: 4 },
  ],
  CONTENT_WRITING: [
    { name: "Blog & Article Writing", description: "Regular blog content to keep the site active and searchable.", pricingType: "MONTHLY", startingPrice: "$299/mo", badge: "NONE", sortOrder: 1 },
    { name: "Website Copywriting", description: "One-time copy for a full website — homepage, about, service pages.", pricingType: "ONE_TIME", startingPrice: "Starting at $500", badge: "NONE", sortOrder: 2 },
    { name: "SEO Content Writing", description: "Keyword-optimized articles built to rank in search.", pricingType: "ONE_TIME", startingPrice: "Starting at $80/article", badge: "POPULAR", sortOrder: 3 },
    { name: "Social Media Captions & Content", description: "Ongoing caption and content writing for social channels.", pricingType: "MONTHLY", startingPrice: "$149/mo", badge: "NONE", sortOrder: 4 },
  ],
  SEO_DIGITAL_MARKETING: [
    { name: "SEO Audit & On-Page Optimization", description: "A one-time technical and on-page SEO fix-up.", pricingType: "ONE_TIME", startingPrice: "Starting at $600", badge: "NONE", sortOrder: 1 },
    { name: "Monthly SEO Management", description: "Ongoing keyword tracking, content optimization, and link building.", pricingType: "MONTHLY", startingPrice: "$499/mo", badge: "POPULAR", sortOrder: 2 },
    { name: "Local SEO / Google Business Profile", description: 'Optimizing for "near me" searches and local map rankings.', pricingType: "ONE_TIME", startingPrice: "Starting at $300", badge: "NONE", sortOrder: 3 },
    { name: "Paid Ads Management", description: "Google and Meta ad campaign setup and ongoing management.", pricingType: "MONTHLY", startingPrice: "$399/mo", badge: "NEW", sortOrder: 4 },
  ],
};

async function seed() {
  const existing = await db.select().from(servicesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(servicesTable).values(services);
    logger.info("Seeded services");
  }

  const existingPlans = await db.select().from(servicePlansTable).limit(1);
  if (existingPlans.length === 0) {
    const allServices = await db.select().from(servicesTable);
    const servicesByCategory: Record<string, number> = Object.fromEntries(allServices.map(s => [s.category, s.id]));
    const planRows = Object.entries(servicePlansData).flatMap(([category, plans]) => {
      const serviceId = servicesByCategory[category];
      if (!serviceId) return [];
      return plans.map(p => ({ ...p, serviceId }));
    });
    await db.insert(servicePlansTable).values(planRows);
    logger.info("Seeded service plans");
  }

  const existingTestimonials = await db.select().from(testimonialsTable).limit(1);
  if (existingTestimonials.length === 0) {
    await db.insert(testimonialsTable).values(testimonials);
    logger.info("Seeded testimonials");
  }

  const existingPortfolio = await db.select().from(portfolioItemsTable).limit(1);
  if (existingPortfolio.length === 0) {
    await db.insert(portfolioItemsTable).values(portfolioItems);
    logger.info("Seeded portfolio items");
  }

  const adminEmail = "admin@trivinexpartners.com";
  const [existingAdmin] = await db.select().from(usersTable).where((await import("drizzle-orm")).eq(usersTable.email, adminEmail));
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Trivinex!Admin1", 10);
    await db.insert(usersTable).values({ email: adminEmail, passwordHash, role: "ADMIN" });
    logger.info({ adminEmail }, "Seeded admin user with default password Trivinex!Admin1 (change it after first login)");
  }

  process.exit(0);
}

seed().catch((err) => {
  logger.error({ err }, "Seed failed");
  process.exit(1);
});
