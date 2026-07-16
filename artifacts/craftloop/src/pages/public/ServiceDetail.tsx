import React from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { useListPublicServices } from "@workspace/api-client-react";
import {
  ArrowLeft, ArrowRight, Loader2,
  Code, Video, Camera, Palette, PenTool, TrendingUp,
} from "lucide-react";

const SERVICE_META: Record<string, { icon: React.ElementType; gradient: string; glow: string }> = {
  WEB_DEVELOPMENT:         { icon: Code,       gradient: "from-blue-500 to-blue-600",    glow: "bg-blue-600/10" },
  VIDEO_EDITING:           { icon: Video,      gradient: "from-purple-500 to-purple-600", glow: "bg-purple-600/10" },
  PHOTOGRAPHY_VIDEOGRAPHY: { icon: Camera,     gradient: "from-pink-500 to-rose-600",    glow: "bg-pink-600/10" },
  GRAPHIC_DESIGN:          { icon: Palette,    gradient: "from-orange-500 to-amber-600", glow: "bg-orange-600/10" },
  CONTENT_WRITING:         { icon: PenTool,    gradient: "from-green-500 to-emerald-600",glow: "bg-green-600/10" },
  SEO_DIGITAL_MARKETING:   { icon: TrendingUp, gradient: "from-cyan-500 to-teal-600",   glow: "bg-cyan-600/10" },
};

const BADGE_CONFIG: Record<string, { label: string; pill: string }> = {
  HOT:        { label: "🔥 Hot",        pill: "bg-red-500 text-white" },
  NEW:        { label: "✨ New",        pill: "bg-blue-600 text-white" },
  POPULAR:    { label: "⭐ Popular",    pill: "bg-amber-500 text-white" },
  BEST_VALUE: { label: "💎 Best Value", pill: "bg-purple-600 text-white" },
};

const FEATURED = new Set(["POPULAR", "BEST_VALUE"]);

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any },
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: services, isLoading } = useListPublicServices();

  const service = services?.find((s: any) => s.slug === slug);
  const activePlans =
    (service?.plans as any[] | undefined)
      ?.filter((p: any) => p.isActive)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder) ?? [];

  const meta = service
    ? (SERVICE_META[service.category as string] ?? {
        icon: Code,
        gradient: "from-blue-500 to-blue-600",
        glow: "bg-blue-600/10",
      })
    : null;
  const Icon = meta?.icon ?? Code;

  return (
    <div className="flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════════
           HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[56vh] flex items-center bg-[#06060A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full ${meta?.glow ?? "bg-blue-600/10"} blur-[120px]`} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-24 pb-24">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-medium mb-12 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Services
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-white/30" />
            </div>
          ) : service && meta ? (
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-2xl shrink-0`}
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>

              {/* Text */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-3"
                >
                  {activePlans.length} Plan{activePlans.length !== 1 ? "s" : ""} Available
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.05] mb-5"
                >
                  {service.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-[#8E8E9A] text-lg leading-relaxed max-w-2xl"
                >
                  {service.description}
                </motion.p>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="text-center text-white/40 py-20 text-lg">Service not found.</div>
          ) : null}
        </div>

        {/* Fade to plans section */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F5F5F7] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
           PLAN CARDS
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : activePlans.length === 0 ? (
            <div className="text-center py-20 text-[#6E6E73] text-lg">
              No plans available for this service yet.
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
                  Choose Your Plan
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any }}
                  className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-[#1D1D1F]"
                >
                  Find the right fit
                </motion.h2>
                <motion.p {...fadeUp} className="text-[#6E6E73] mt-4 max-w-md mx-auto">
                  Each plan is a starting point — we customise scope to match your exact requirements.
                </motion.p>
              </div>

              <div
                className={`grid gap-6 mx-auto ${
                  activePlans.length === 1
                    ? "max-w-sm"
                    : activePlans.length === 2
                    ? "sm:grid-cols-2 max-w-2xl"
                    : activePlans.length === 3
                    ? "sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
                    : "sm:grid-cols-2 lg:grid-cols-4 max-w-7xl"
                }`}
              >
                {activePlans.map((plan: any, i: number) => {
                  const badge = plan.badge !== "NONE" ? BADGE_CONFIG[plan.badge] : null;
                  const featured = FEATURED.has(plan.badge);

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ delay: i * 0.1, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as any }}
                      className="relative"
                    >
                      {/* Featured glow ring */}
                      {featured && (
                        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-30 blur-sm pointer-events-none" />
                      )}

                      <div
                        className={`relative bg-white rounded-3xl p-7 h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                          featured
                            ? "border-2 border-blue-500 shadow-lg shadow-blue-500/10"
                            : "border border-[#E8E8ED] shadow-sm"
                        }`}
                      >
                        {/* Badge chip */}
                        {badge && (
                          <span
                            className={`absolute top-5 right-5 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${badge.pill}`}
                          >
                            {badge.label}
                          </span>
                        )}

                        {/* Pricing type pill */}
                        <div className="mb-5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                              plan.pricingType === "MONTHLY"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {plan.pricingType === "MONTHLY" ? "Monthly" : "One-time"}
                          </span>
                        </div>

                        {/* Plan name */}
                        <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-3 pr-16 leading-snug">
                          {plan.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-[#6E6E73] leading-relaxed flex-1 mb-6">
                          {plan.description}
                        </p>

                        {/* Price */}
                        {plan.startingPrice && (
                          <div className="pb-6 mb-6 border-b border-[#E8E8ED]">
                            <div className="text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                              {plan.startingPrice}
                            </div>
                            <div className="text-xs text-[#6E6E73] mt-0.5">
                              {plan.pricingType === "MONTHLY" ? "per month" : "one-time"}
                            </div>
                          </div>
                        )}

                        {/* CTA */}
                        <Link
                          href={`/quote?service=${service?.category}&plan=${plan.id}`}
                          className={`inline-flex h-11 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                            featured
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                              : "bg-[#1D1D1F] text-white hover:bg-blue-600"
                          }`}
                        >
                          Get Started <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           CTA — Dark
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#06060A] py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full bg-blue-500/15 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-white mb-4 leading-[1.1]"
          >
            Need something custom?
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Our plans are starting points. Book a free call and we'll craft the exact scope you need.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Book a Free Call
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 text-white px-8 text-sm font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> All Services
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
