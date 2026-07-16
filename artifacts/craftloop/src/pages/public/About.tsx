import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Users, Award, Zap, Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any },
};

const stats = [
  { val: "99%", label: "Client Satisfaction" },
  { val: "6", label: "Specialized Services" },
  { val: "100+", label: "Vetted Experts" },
  { val: "5+", label: "Years of Excellence" },
];

export default function About() {
  return (
    <div className="flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════════
           HERO — Dark
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex items-center bg-[#06060A] overflow-hidden">
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

        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-28 pb-24 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-white/60 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Our Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6"
          >
            Built for the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 60%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              top 1%.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#8E8E9A] text-lg max-w-xl mx-auto leading-relaxed"
          >
            We are a digital services agency built differently — real experts, real employees, unmatched quality.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
           STORY — White
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">
            The Beginning
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any }}
            className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F] leading-[1.1] mb-8"
          >
            We fixed what was broken.
          </motion.h2>
          <motion.div {...fadeUp} className="space-y-6 text-[#6E6E73] text-lg leading-relaxed">
            <p>
              Trivinex Partners started with a simple observation: the gig economy is broken. Freelancers spend more time hunting for work than creating, and businesses waste resources filtering through unvetted candidates hoping to strike gold.
            </p>
            <p>
              We built an agency that solves both sides of the equation. We find the top 1% of independent creative and technical talent, bring them onto our team, and provide them with a steady stream of high-quality projects. For our clients, this means getting agency-level reliability and quality without the massive overhead.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           STATS — Dark
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#1D1D1F] relative overflow-hidden">
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
                <div className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white mb-3">
                  {s.val}
                </div>
                <div className="text-sm font-semibold text-white/40 uppercase tracking-widest">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           STANDARD — Light gray
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-[#F5F5F7]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              Our Commitment
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any }}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              The Trivinex Standard
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "Rigorous QA", desc: "Every project goes through a strict quality assurance process. We manage the workflow, guarantee deadlines, and stand behind every deliverable." },
              { icon: Users, title: "Top 1% Only", desc: "We only hire experts who have demonstrated real-world excellence. No junior work. No learning on your dime." },
              { icon: Zap, title: "Six Core Services", desc: "We only offer what we can execute perfectly. Deep expertise beats shallow breadth every time." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-[#E8E8ED] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 tracking-tight">{title}</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
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
            className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5 leading-[1.1]"
          >
            Join the mission.
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Whether you're a business scaling your digital presence or an elite freelancer looking for a home — we're your partner.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Work with Us
            </Link>
            <Link
              href="/freelancers"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 text-white px-8 text-sm font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              Join as Freelancer <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
