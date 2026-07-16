import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import {
  ArrowRight, Code, Video, Camera, Palette, PenTool, TrendingUp,
  CheckCircle2, Zap, Shield, Clock, DollarSign, Globe,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const specialties = [
  { icon: Code, label: "Web Development", desc: "React, Node.js, TypeScript, full-stack" },
  { icon: Video, label: "Video Editing", desc: "Post-production, motion graphics, color" },
  { icon: Camera, label: "Photography", desc: "Commercial, product, portrait" },
  { icon: Palette, label: "Graphic Design", desc: "Brand, UI/UX, marketing collateral" },
  { icon: PenTool, label: "Content Writing", desc: "Copywriting, technical docs, storytelling" },
  { icon: TrendingUp, label: "SEO & Marketing", desc: "Organic growth, paid ads, strategy" },
];

const benefits = [
  { icon: DollarSign, title: "Consistent, On-Time Pay", desc: "We handle billing and collections. You get paid on a fixed schedule — no more chasing invoices." },
  { icon: Globe, title: "100% Remote", desc: "Work from anywhere in the world. No commute, no office politics — just your craft." },
  { icon: Zap, title: "No Cold Pitching", desc: "Clients come to us. We route qualified projects directly to specialists. Zero prospecting." },
  { icon: Shield, title: "We Handle the Business", desc: "Contracts, NDAs, revisions, and client communication — our team manages all of it." },
  { icon: Clock, title: "Flexible Engagements", desc: "Take on as much or as little as you want. Part-time, full-time, or project-based." },
  { icon: CheckCircle2, title: "Elite Community", desc: "Work alongside the top 1% of creative and technical talent. Raise your game." },
];

const steps = [
  { num: "01", title: "Apply Online", desc: "Fill out a short application with your specialty, portfolio links, and expected availability. Takes under 5 minutes." },
  { num: "02", title: "Skill Assessment", desc: "We review your work samples and may assign a small paid trial task to verify quality. No unpaid tests." },
  { num: "03", title: "Onboarding", desc: "Once accepted, you're briefed on our standards, tools, and communication norms. Setup takes one day." },
  { num: "04", title: "Start Earning", desc: "Projects start flowing within your first week. You choose what fits your schedule and skillset." },
];

const staticFaqs = [
  { question: "Is this full-time employment or freelance?", answer: "We operate as a talent partner — you remain an independent contractor with full flexibility over your schedule and workload. You're not locked into any minimum hours." },
  { question: "How do payouts work?", answer: "Payouts are processed on a bi-weekly basis directly to your preferred account (bank transfer, PayPal, or Payoneer). We're transparent about rates upfront — no surprises." },
  { question: "What countries can apply?", answer: "We accept talented freelancers from anywhere in the world. All work is remote and asynchronous, so location is never a barrier." },
  { question: "Do I need a portfolio?", answer: "Yes — a portfolio or work samples are required. If you're early-career, a strong set of personal or practice projects is fine. We care about quality of thinking, not years of experience." },
  { question: "Can I work with other clients at the same time?", answer: "Absolutely. We don't require exclusivity. You're free to work with other clients as long as you meet the commitments you've agreed to with us." },
  { question: "How long does the application process take?", answer: "Most applicants hear back within 5 business days. If selected for the skill assessment, the full process takes around 2 weeks from application to onboarding." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left group">
      <div className="flex items-center justify-between py-5 border-b border-[#E8E8ED] gap-4">
        <span className="font-semibold text-[#1D1D1F] group-hover:text-blue-600 transition-colors leading-snug text-base">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 shrink-0 text-[#6E6E73]" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pt-4 pb-2 text-[#6E6E73] leading-relaxed text-sm">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("none");
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`);
  }, []);
  const handleMouseLeave = useCallback(() => setTransform("none"), []);
  return { ref, transform, handleMouseMove, handleMouseLeave };
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
};

export default function Freelancers() {
  const { data: apiFaqs } = useQuery<Array<{ id: number; question: string; answer: string }>>({
    queryKey: ["public-faqs"],
    queryFn: () => fetch("/api/public/faqs", { credentials: "include" }).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const faqs = apiFaqs && apiFaqs.length > 0 ? apiFaqs : staticFaqs.map((f, i) => ({ id: i, question: f.question, answer: f.answer }));

  return (
    <div className="flex flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
           HERO — Dark, matching main site
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 bg-[#06060A] overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-15 pointer-events-none blur-[120px] bg-blue-500" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none blur-[100px] bg-purple-600" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 inline-flex items-center gap-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-xs font-semibold text-blue-400 mb-10 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Now Accepting Freelancers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-7 max-w-4xl"
        >
          <span
            style={{
              background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Stop chasing clients.
          </span>
          <br />
          <span className="text-white">Start getting paid.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative z-10 text-lg text-white/50 max-w-xl mb-12 leading-relaxed"
        >
          In a world full of freelancers, finding clients is the hardest part.{" "}
          <span className="text-white/80 font-semibold">We solve that for you.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/careers"
            className="inline-flex h-13 items-center gap-2.5 rounded-full bg-white text-[#06060A] px-7 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-13 items-center rounded-full border border-white/20 bg-white/[0.05] px-7 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 backdrop-blur-sm"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex flex-wrap justify-center gap-12 sm:gap-20"
        >
          {[
            { value: "100%", label: "Remote Work" },
            { value: "0", label: "Cold Pitching" },
            { value: "∞", label: "Opportunities" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-1"
                style={{
                  background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
           SPECIALTIES — Light section, match main site cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Specialties</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              We're hiring across all crafts
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {specialties.map((s, i) => {
              const { ref, transform, handleMouseMove, handleMouseLeave } = useTilt();
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  ref={ref}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ transform, transition: transform === "none" ? "transform 0.4s ease" : "none" }}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] hover:border-blue-200 hover:shadow-lg hover:bg-white transition-all duration-300 cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1D1D1F] mb-1">{s.label}</h3>
                    <p className="text-sm text-[#6E6E73]">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           BENEFITS — Dark section, glass cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#1D1D1F] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-blue-600/[0.06] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Why Join Us</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white"
            >
              Built for serious freelancers
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center mb-5">
                  <b.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           HOW IT WORKS — Light, Apple-style steps
      ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 bg-[#F5F5F7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">The Process</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              From application to earnings
            </motion.h2>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#D2D2D7] to-transparent" />
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="text-center relative"
              >
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-white border-2 border-[#E8E8ED] shadow-md text-blue-600 flex items-center justify-center text-xl font-black mx-auto mb-6 relative z-10">
                  {s.num}
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           FAQ — Light, premium accordion
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">Got Questions?</motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              Frequently Asked
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="divide-y divide-[#E8E8ED]"
          >
            {faqs.map((f) => (
              <FAQItem key={f.id} q={f.question} a={f.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           CTA — Dark gradient matching main site
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#06060A] py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-blue-500/15 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5"
          >
            Ready to join the{" "}
            <span style={{
              background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              top 1%?
            </span>
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/50 text-lg max-w-md mx-auto mb-10">
            Applications are reviewed within 5 business days. No commitment required.
          </motion.p>
          <motion.div {...fadeUp}>
            <Link
              href="/careers"
              className="inline-flex h-14 items-center gap-2.5 rounded-full bg-white text-[#06060A] px-8 text-base font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
