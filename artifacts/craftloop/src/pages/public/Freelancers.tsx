import { Link } from "wouter";
import {
  ArrowRight,
  Code,
  Video,
  Camera,
  Palette,
  PenTool,
  TrendingUp,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const specialties = [
  { icon: Code, label: "Web Development", desc: "React, Node, TypeScript, full-stack" },
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

const faqs = [
  {
    q: "Is this full-time employment or freelance?",
    a: "We operate as a talent partner — you remain an independent contractor with full flexibility over your schedule and workload. You're not locked into any minimum hours.",
  },
  {
    q: "How do payouts work?",
    a: "Payouts are processed on a bi-weekly basis directly to your preferred account (bank transfer, PayPal, or Payoneer). We're transparent about rates upfront — no surprises.",
  },
  {
    q: "What countries can apply?",
    a: "We accept talented freelancers from anywhere in the world. All work is remote and asynchronous, so location is never a barrier.",
  },
  {
    q: "Do I need a portfolio?",
    a: "Yes — a portfolio or work samples are required. If you're early-career, a strong set of personal or practice projects is fine. We care about quality of thinking, not years of experience.",
  },
  {
    q: "Can I work with other clients at the same time?",
    a: "Absolutely. We don't require exclusivity. You're free to work with other clients as long as you meet the commitments you've agreed to with us.",
  },
  {
    q: "How long does the application process take?",
    a: "Most applicants hear back within 5 business days. If selected for the skill assessment, the full process takes around 2 weeks from application to onboarding.",
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left group"
    >
      <div className="flex items-center justify-between py-5 border-b border-white/10 gap-4">
        <span className="font-semibold text-white/90 group-hover:text-white transition-colors text-lg leading-snug">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 shrink-0 text-blue-400" />
        ) : (
          <ChevronDown className="w-5 h-5 shrink-0 text-white/40 group-hover:text-white/70 transition-colors" />
        )}
      </div>
      {open && (
        <p className="pt-4 pb-2 text-white/60 leading-relaxed text-base">{a}</p>
      )}
    </button>
  );
}

export default function Freelancers() {
  return (
    <div
      className="flex flex-col animate-in fade-in duration-700"
      style={{
        background: "linear-gradient(135deg, #060c1a 0%, #0a1128 40%, #080e20 100%)",
        color: "#fff",
      }}
    >
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background glow orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b5bff 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #a855f7 0%, transparent 70%)" }}
        />

        {/* Status pill */}
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-400 mb-10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Now Accepting Freelancers
        </div>

        {/* Headline */}
        <h1
          className="relative z-10 text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.0] mb-8 max-w-5xl"
          style={{ lineHeight: 1.05 }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #4f7cff 0%, #a855f7 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Stop Chasing
            <br />
            Clients.
          </span>{" "}
          <span className="text-white">Start</span>
          <br />
          <span className="text-white">Getting Paid.</span>
        </h1>

        <p className="relative z-10 text-xl text-white/60 max-w-2xl mb-12 leading-relaxed font-medium">
          In a world full of freelancers, finding clients is the hardest part.
          <br />
          <span className="text-white/90 font-semibold">We solve that for you.</span>
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/careers"
            className="inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #4f7cff, #a855f7)" }}
          >
            Join as Freelancer <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-14 items-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
          >
            See How It Works
          </a>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex flex-wrap justify-center gap-12 sm:gap-20">
          {[
            { value: "100%", label: "REMOTE WORK" },
            { value: "0", label: "COLD PITCHING" },
            { value: "∞", label: "OPPORTUNITIES" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-5xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #4f7cff, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {value}
              </div>
              <div className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p
              className="text-sm font-bold uppercase tracking-[0.25em] mb-4"
              style={{ color: "#4f7cff" }}
            >
              The Process
            </p>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white">
              From application to
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4f7cff, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                first paycheck
              </span>{" "}
              in days.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-blue-600/40" />

            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-8 relative z-10 transition-transform duration-300 group-hover:-translate-y-2"
                  style={{
                    background: "linear-gradient(135deg, rgba(79,124,255,0.15), rgba(168,85,247,0.15))",
                    border: "1px solid rgba(79,124,255,0.3)",
                    color: "#4f7cff",
                    boxShadow: "0 0 40px rgba(79,124,255,0.1)",
                  }}
                >
                  {s.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-32 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-bold uppercase tracking-[0.25em] mb-4" style={{ color: "#4f7cff" }}>
              Why Us
            </p>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white">
              Built for freelancers
              <br />
              who want{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4f7cff, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                more
              </span>
              .
            </h2>
            <p className="text-white/50 text-xl mt-6 max-w-xl mx-auto">
              We remove every friction point between you and doing your best work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(79,124,255,0.3)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(79,124,255,0.05)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, rgba(79,124,255,0.2), rgba(168,85,247,0.2))" }}
                >
                  <b.icon className="w-6 h-6" style={{ color: "#4f7cff" }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{b.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-bold uppercase tracking-[0.25em] mb-4" style={{ color: "#4f7cff" }}>
              Open Roles
            </p>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white">
              We're looking for
              <br />
              specialists in:
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specialties.map((s, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(79,124,255,0.4)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(79,124,255,0.06)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, rgba(79,124,255,0.2), rgba(168,85,247,0.2))" }}
                >
                  <s.icon className="w-5 h-5" style={{ color: "#4f7cff" }} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{s.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-sm mt-8">
            Don't see your specialty?{" "}
            <Link href="/careers" className="underline text-white/60 hover:text-white transition-colors">
              Apply anyway — we're always expanding.
            </Link>
          </p>
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ── */}
      <section className="py-20 px-4" style={{ background: "rgba(79,124,255,0.05)", borderTop: "1px solid rgba(79,124,255,0.15)", borderBottom: "1px solid rgba(79,124,255,0.15)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-4xl font-black text-white leading-snug">
            "Trivinex gave me the stability I never had as a freelancer — consistent work, on-time pay,
            and clients I'd never have found on my own."
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: "linear-gradient(135deg, #4f7cff, #a855f7)" }}>
              JR
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">James R.</p>
              <p className="text-white/40 text-xs">Full-Stack Developer, Partner since 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.25em] mb-4" style={{ color: "#4f7cff" }}>
              FAQ
            </p>
            <h2 className="text-5xl font-black tracking-tighter text-white">Common questions</h2>
          </div>
          <div>
            {faqs.map((f, i) => (
              <FAQ key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(79,124,255,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-[0.25em] mb-6" style={{ color: "#4f7cff" }}>
            Ready?
          </p>
          <h2 className="text-6xl lg:text-7xl font-black tracking-tighter text-white mb-8 leading-tight">
            Your next client is{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4f7cff, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              already waiting.
            </span>
          </h2>
          <p className="text-white/50 text-xl mb-12 max-w-lg mx-auto">
            Join hundreds of elite freelancers who stopped chasing and started earning.
          </p>
          <Link
            href="/careers"
            className="inline-flex h-16 items-center gap-3 rounded-full px-10 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #4f7cff, #a855f7)",
              boxShadow: "0 8px 40px rgba(79,124,255,0.4)",
            }}
          >
            Apply Now — It's Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/30 text-sm mt-6">No fees. No lock-in. Just great work.</p>
        </div>
      </section>
    </div>
  );
}
