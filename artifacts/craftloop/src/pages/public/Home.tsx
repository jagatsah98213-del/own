import { useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { ArrowRight, Code, Video, Camera, Palette, PenTool, TrendingUp, Star, Users, Award, Zap } from "lucide-react";

// Mouse-tracking 3D tilt hook for service cards
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 400, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 400, damping: 40 });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);
  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

const services = [
  { icon: Code, title: "Web Development", desc: "Custom, scalable web applications engineered for performance and delight.", color: "from-blue-500 to-blue-600" },
  { icon: Video, title: "Video Editing", desc: "Professional post-production, color grading, and dynamic motion graphics.", color: "from-purple-500 to-purple-600" },
  { icon: Camera, title: "Photography", desc: "High-end commercial, portrait, and product photography with precision lighting.", color: "from-pink-500 to-rose-600" },
  { icon: Palette, title: "Graphic Design", desc: "Brand identity systems, intuitive UI/UX, and striking marketing collateral.", color: "from-orange-500 to-amber-600" },
  { icon: PenTool, title: "Content Writing", desc: "Engaging copy, technical docs, and compelling brand storytelling.", color: "from-green-500 to-emerald-600" },
  { icon: TrendingUp, title: "SEO & Marketing", desc: "Data-driven organic strategies and measurable digital growth campaigns.", color: "from-cyan-500 to-teal-600" },
];

const stats = [
  { val: "200+", label: "Clients Served" },
  { val: "98%", label: "Satisfaction Rate" },
  { val: "5+", label: "Years of Excellence" },
  { val: "Top 1%", label: "Talent Pool" },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ perspective: 1000 }}
    >
      <Link href="/services">
        <motion.div
          ref={ref}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative bg-white border border-[#E8E8ED] rounded-3xl p-8 cursor-pointer overflow-hidden h-full"
        >
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/40 rounded-3xl" />

          <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <service.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 tracking-tight">{service.title}</h3>
            <p className="text-[#6E6E73] leading-relaxed text-sm">{service.desc}</p>
            <div className="flex items-center gap-2 mt-6 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
              Learn more <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Floating dashboard card for hero
function HeroDashboardCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-200, 200], [12, -12]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-12, 12]), { stiffness: 200, damping: 30 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    x.set(e.clientX - window.innerWidth / 2);
    y.set(e.clientY - window.innerHeight / 2);
  }, [x, y]);

  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={sectionRef}
      className="relative flex items-center justify-center"
      onMouseMove={(e) => { x.set(e.clientX - (sectionRef.current?.getBoundingClientRect().left ?? 0) - (sectionRef.current?.offsetWidth ?? 0) / 2); y.set(e.clientY - (sectionRef.current?.getBoundingClientRect().top ?? 0) - (sectionRef.current?.offsetHeight ?? 0) / 2); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent blur-3xl scale-150" />

      {/* Main floating card */}
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-[420px] max-w-full"
      >
        {/* Card shadow layer */}
        <div className="absolute inset-0 translate-y-8 scale-95 bg-blue-500/20 rounded-3xl blur-2xl" />

        <div className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          {/* Window chrome */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-4 h-5 bg-white/[0.06] rounded-full" />
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Projects", val: "24", change: "+3", up: true },
              { label: "Clients", val: "200+", change: "+12", up: true },
              { label: "Revenue", val: "$128k", change: "+8%", up: true },
            ].map((m) => (
              <div key={m.label} className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-3">
                <div className="text-[10px] text-white/40 mb-1 font-medium">{m.label}</div>
                <div className="text-base font-bold text-white">{m.val}</div>
                <div className="text-[10px] text-green-400 font-semibold mt-0.5">{m.change}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/50 font-semibold">Deliverables</span>
              <span className="text-xs text-blue-400 font-bold">This month</span>
            </div>
            <div className="flex items-end gap-1.5 h-14">
              {[45, 65, 40, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm overflow-hidden" style={{ height: `${h}%` }}>
                  <div
                    className="w-full h-full rounded-sm"
                    style={{
                      background: i === 10 || i === 11
                        ? 'linear-gradient(to top, #3B82F6, #60A5FA)'
                        : 'rgba(255,255,255,0.12)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Team row */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500"].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#0A0A0F] flex items-center justify-center text-[9px] font-bold text-white`}>
                  {["JK","AS","MR","TL"][i]}
                </div>
              ))}
            </div>
            <span className="text-xs text-white/40">12 active freelancers</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-semibold">Live</span>
            </div>
          </div>
        </div>

        {/* Floating badge 1 */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(60px)" }}
          className="absolute -top-5 -right-6 bg-white rounded-2xl px-4 py-2 shadow-xl border border-gray-100 flex items-center gap-2"
        >
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-800">4.9 / 5.0</span>
        </motion.div>

        {/* Floating badge 2 */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ transform: "translateZ(60px)" }}
          className="absolute -bottom-4 -left-6 bg-white rounded-2xl px-4 py-2 shadow-xl border border-gray-100 flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-gray-800">Project Delivered</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
};

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
           HERO — Dark, full-viewport, 3D
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex items-center bg-[#06060A] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[120px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10 pt-24 pb-20">
          {/* Left: Text */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-white/70 mb-8 self-start"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Premium Creative Agency
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-7"
            >
              We build{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                digital legacies.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[#8E8E9A] text-lg leading-relaxed mb-10 max-w-lg"
            >Trivinex Partners is a premium creative studio delivering elite web development, design, video, photography, and SEO  executed by the world's top 1% talent.</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/quote"
                className="inline-flex h-13 items-center justify-center rounded-full bg-white text-[#06060A] px-7 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                Start a Project
              </Link>
              <Link
                href="/consultation"
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/20 text-white px-7 text-sm font-semibold hover:bg-white/[0.06] transition-all duration-200"
              >
                Book a Free Call <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center flex-wrap gap-6 pt-8 border-t border-white/[0.08]"
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

          {/* Right: 3D Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:flex justify-center"
          >
            <HeroDashboardCard />
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>
      {/* ═══════════════════════════════════════════════════════════
           MARQUEE — Skills/tags scrolling strip
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-white border-b border-[#E8E8ED] overflow-hidden">
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[
              "Web Development", "UI/UX Design", "Video Editing", "Brand Identity",
              "Photography", "Content Writing", "SEO Strategy", "Motion Graphics",
              "React & Next.js", "3D Design", "Social Media", "Digital Marketing",
              "Web Development", "UI/UX Design", "Video Editing", "Brand Identity",
              "Photography", "Content Writing", "SEO Strategy", "Motion Graphics",
              "React & Next.js", "3D Design", "Social Media", "Digital Marketing",
            ].map((tag, i) => (
              <span key={i} className="text-sm font-semibold text-[#1D1D1F] flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════════
           HEADLINE STATEMENT — Apple-style big statement
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.p
            {...fadeUp}
            className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6"
          >
            Our Purpose
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-[#1D1D1F] leading-[1.1] mb-8"
          >
            Every pixel, every frame,{" "}
            <span className="text-[#6E6E73]">every word — crafted to last.</span>
          </motion.h2>
          <motion.p {...fadeUp} className="text-xl text-[#6E6E73] leading-relaxed">
            We don't take shortcuts. We partner with our clients as their dedicated creative team, delivering work that builds brands, drives revenue, and stands the test of time.
          </motion.p>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════════
           SERVICES — 3D tilt cards on white background
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#F5F5F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              What We Do
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              Our Expertise
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
          </div>
          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#D2D2D7] bg-white px-7 text-sm font-semibold text-[#1D1D1F] hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════════
           STATS — Dark section, big numbers
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#1D1D1F] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-blue-600/[0.06] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white mb-3">{s.val}</div>
                <div className="text-sm font-semibold text-white/40 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════════
           PROCESS — Light, minimal, Apple-like steps
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              The Process
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              How We Work
            </motion.h2>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#D2D2D7] to-transparent" />

            {[
              { step: "01", title: "Discovery", desc: "We map out your goals, requirements, and vision in a focused kick-off session." },
              { step: "02", title: "Execution", desc: "Dedicated specialists craft your project with meticulous detail and weekly progress updates." },
              { step: "03", title: "Delivery", desc: "Polished, production-ready assets delivered on time — with 30 days post-launch support." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white border-2 border-[#E8E8ED] shadow-lg text-blue-600 flex items-center justify-center text-2xl font-black mx-auto mb-8 relative z-10">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">{s.title}</h3>
                <p className="text-[#6E6E73] leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════════
           CTA — Premium dark gradient
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#06060A] py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full bg-blue-500/15 blur-[100px]" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]"
          >
            Ready to build something{" "}
            <span style={{
              background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              extraordinary?
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-white/50 text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Join 200+ businesses that trust Trivinex Partners to deliver world-class digital work.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-base font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start a Project
            </Link>
            <Link
              href="/consultation"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 text-white px-8 text-base font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              Book a Free Call
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
