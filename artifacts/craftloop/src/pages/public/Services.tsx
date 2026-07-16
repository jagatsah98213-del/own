import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListPublicServices } from "@workspace/api-client-react";
import { Code, Video, Camera, Palette, PenTool, TrendingUp, ArrowRight, Loader2, Star, Users, Award, Zap } from "lucide-react";

const SERVICE_META: Record<string, { icon: React.ElementType; gradient: string }> = {
  WEB_DEVELOPMENT:          { icon: Code,        gradient: "from-blue-500 to-blue-600" },
  VIDEO_EDITING:            { icon: Video,       gradient: "from-purple-500 to-purple-600" },
  PHOTOGRAPHY_VIDEOGRAPHY:  { icon: Camera,      gradient: "from-pink-500 to-rose-600" },
  GRAPHIC_DESIGN:           { icon: Palette,     gradient: "from-orange-500 to-amber-600" },
  CONTENT_WRITING:          { icon: PenTool,     gradient: "from-green-500 to-emerald-600" },
  SEO_DIGITAL_MARKETING:    { icon: TrendingUp,  gradient: "from-cyan-500 to-teal-600" },
};

import React from "react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any },
};

export default function Services() {
  const { data: services, isLoading } = useListPublicServices();

  return (
    <div className="flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════════
           HERO — Dark, premium
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[65vh] flex items-center bg-[#06060A] overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-28 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-white/60 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            6 Premium Services
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6"
          >
            Everything your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              brand needs.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#8E8E9A] text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            Six core disciplines, each executed by vetted experts. Tap any service to
            explore tailored plans built for your goals and budget.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Get a Custom Quote
            </Link>
            <Link
              href="/consultation"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 text-white px-8 text-sm font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              Book a Free Call <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center flex-wrap gap-6 pt-10 mt-10 border-t border-white/[0.08]"
          >
            {[
              { icon: Star, label: "4.9/5 Rating", color: "text-yellow-400" },
              { icon: Users, label: "200+ Clients", color: "text-blue-400" },
              { icon: Award, label: "Top 1% Talent", color: "text-purple-400" },
              { icon: Zap, label: "On-Time Delivery", color: "text-green-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs font-semibold text-white/60">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade to grid section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F7] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
           SERVICES GRID — clickable cards
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              Our Expertise
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              Click to explore plans
            </motion.h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services?.map((service, i) => {
                const meta = SERVICE_META[service.category] ?? {
                  icon: Code,
                  gradient: "from-blue-500 to-blue-600",
                };
                const Icon = meta.icon;
                const activePlans = service.plans?.filter((p: any) => p.isActive) ?? [];
                const lowestPrice = activePlans.map((p: any) => p.startingPrice).find(Boolean);

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as any }}
                  >
                    <Link href={`/services/${service.slug}`}>
                      <div className="group relative bg-white border border-[#E8E8ED] rounded-3xl p-8 cursor-pointer overflow-hidden h-full hover:shadow-2xl hover:border-blue-100 transition-all duration-500 hover:-translate-y-1">
                        {/* Hover glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/30 rounded-3xl" />

                        <div className="relative z-10">
                          {/* Icon */}
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </div>

                          <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 tracking-tight">
                            {service.title}
                          </h3>
                          <p className="text-[#6E6E73] leading-relaxed text-sm mb-7">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              {lowestPrice && (
                                <span className="text-xs font-semibold text-[#6E6E73] bg-[#F5F5F7] border border-[#E8E8ED] rounded-full px-3 py-1">
                                  {lowestPrice}
                                </span>
                              )}
                              {activePlans.length > 0 && (
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                                  {activePlans.length} plan{activePlans.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm group-hover:gap-2.5 transition-all duration-200 shrink-0">
                              Explore <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           CTA — Dark
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#06060A] py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full bg-blue-500/15 blur-[100px]" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            {...fadeUp}
            className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5 leading-[1.1]"
          >
            Not sure where to start?
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Book a free 30-minute call and we'll match you with the right service and plan for your project.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consultation"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Book a Free Call
            </Link>
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 text-white px-8 text-sm font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              Get a Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
