import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Globe, DollarSign, Users, ShieldCheck,
  Code2, Film, PenLine, Camera, TrendingUp, Palette,
  Building2, Briefcase, UserCircle, Heart,
  CreditCard, Landmark, Wallet,
} from "lucide-react";
import { SEOHead, SITE_URL } from "@/components/SEOHead";

// ─── Animation helpers ───────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any },
};
const fadeUpDelay = (d: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: d },
});

// ─── Data ────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Corporate websites, e-commerce stores, landing pages, and custom web apps — built to convert, built to last.",
    color: "from-blue-500 to-blue-700",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: Film,
    title: "Video Editing",
    desc: "Marketing videos, social media reels, YouTube content, and full wedding packages — every frame, perfectly crafted.",
    color: "from-violet-500 to-violet-700",
    light: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    icon: PenLine,
    title: "Content Writing",
    desc: "SEO blogs, website copy, product descriptions, and social media content that ranks, resonates, and converts.",
    color: "from-emerald-500 to-emerald-700",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    desc: "Professional photo and video production for brands, products, events, and life's most important moments.",
    color: "from-pink-500 to-pink-700",
    light: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    icon: Palette,
    title: "Graphic Designing",
    desc: "Logos, brand identities, social media creatives, marketing materials, and UI/UX — visuals that make your brand impossible to ignore.",
    color: "from-orange-500 to-orange-700",
    light: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    icon: TrendingUp,
    title: "SEO & Digital Marketing",
    desc: "Organic growth strategies that put you in front of the right audience — reliably, sustainably, measurably.",
    color: "from-amber-500 to-amber-700",
    light: "bg-amber-50",
    text: "text-amber-600",
  },
];

const WHO_WE_SERVE = [
  {
    icon: Building2,
    title: "Small Businesses",
    desc: "You need a digital presence that punches above your weight. We deliver enterprise-quality work at prices that fit a real budget.",
  },
  {
    icon: Briefcase,
    title: "Mid-sized Companies",
    desc: "You need consistent, scalable digital output without the overhead of an in-house team. We become that team.",
  },
  {
    icon: UserCircle,
    title: "Content Creators",
    desc: "You need professional editing and strategy to grow your audience. We handle the production so you can focus on creating.",
  },
  {
    icon: Heart,
    title: "Wedding Clients",
    desc: "You need your special day captured and edited with the care it deserves. Our videographers and editors treat every frame like it matters.",
  },
];

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "All Services in One Place",
    desc: "No more managing five different freelancers for five different jobs. We handle your entire digital presence end-to-end — one point of contact, one invoice.",
  },
  {
    icon: DollarSign,
    title: "Affordable, Honest Pricing",
    desc: "Quality work without the agency price tag. We're transparent about what things cost and why. No surprise invoices, no scope creep you didn't approve.",
  },
  {
    icon: Globe,
    title: "A Truly Global Team",
    desc: "Distance, time zones, and borders don't limit who we serve or who we hire. Our team spans continents — and so does our client base.",
  },
  {
    icon: Users,
    title: "Vetted, Dependable Talent",
    desc: "Every person on our team has earned their place through a rigorous application, review, and interview process. You get professionals, not guesswork.",
  },
];

const PAYMENT_METHODS = [
  { icon: CreditCard, label: "PayPal" },
  { icon: Landmark,   label: "Bank Transfer" },
  { icon: Wallet,     label: "eSewa" },
];

// ─── JSON-LD for About page ───────────────────────────────────────────────────
const ABOUT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about`,
  "url": `${SITE_URL}/about`,
  "name": "About Trivinex Partners",
  "description":
    "Trivinex Partners is a one-stop digital services company offering web development, video editing, graphic designing, content writing, photography, videography, and SEO — delivered worldwide by one trusted team.",
  "isPartOf": { "@id": `${SITE_URL}/#website` },
  "about": { "@id": `${SITE_URL}/#organization` },
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="flex flex-col overflow-hidden">
      <SEOHead
        title="About Us — One Team, Six Services, Zero Compromises"
        description="Learn how Trivinex Partners became the simpler way to handle your entire digital presence — web development, video editing, graphic designing, content writing, photography, and SEO, all from one trusted global team."
        canonical="/about"
        jsonLd={ABOUT_JSONLD}
      />

      {/* ══════════════════════════════════════════════
           HERO — Dark
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[65vh] flex items-center bg-[#06060A] overflow-hidden">
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
            One-Stop Digital Agency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] as any }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6"
          >
            Everything You Need,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 60%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              All in One Place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#8E8E9A] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            One team. Six services. Zero compromises. We built the simpler way to handle your entire digital presence — so you can focus on what you do best.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start a Project
            </Link>
            <Link
              href="/consultation"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 text-white px-8 text-sm font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              Book a Free Call <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
           THE SIMPLER WAY — White
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">
            Why We Exist
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F] leading-[1.1] mb-8"
          >
            The simpler way to handle your digital world.
          </motion.h2>
          <motion.div {...fadeUpDelay(0.15)} className="space-y-6 text-[#6E6E73] text-lg leading-relaxed">
            <p>
              In a world where businesses and creators need to juggle six different freelancers for six different jobs, Trivinex Partners was built to be the answer to all of that. We're a one-stop digital services company — web development, video editing, graphic designing, content writing, photography &amp; videography, and SEO — all delivered by one trusted team.
            </p>
            <p>
              Whether you're a small business, a growing company, a content creator, or someone planning a special day and looking for beautifully edited wedding footage, we have a plan built for you. Our services aren't one-size-fits-all — we tailor our work to what you actually need.
            </p>
            <p>
              And because we believe great work shouldn't cost a fortune, our pricing is honest, transparent, and designed to make sense for real budgets — without cutting corners on quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           FIVE SERVICES — Light gray
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-[#F5F5F7]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              What We Do
            </motion.p>
            <motion.h2
              {...fadeUpDelay(0.1)}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              Six services. One team.
            </motion.h2>
            <motion.p {...fadeUpDelay(0.15)} className="text-[#6E6E73] text-lg mt-4 max-w-xl mx-auto">
              We only offer what we can execute perfectly. Deep expertise beats shallow breadth, every time.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ icon: Icon, title, desc, light, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`bg-white border border-[#E8E8ED] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${light} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${text}`} />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 tracking-tight">{title}</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUpDelay(0.2)} className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all duration-200"
            >
              Explore all services <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           WHO WE SERVE — White
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              Who We Serve
            </motion.p>
            <motion.h2
              {...fadeUpDelay(0.1)}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              Built for people who mean business.
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHO_WE_SERVE.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-[#F5F5F7] rounded-3xl p-7 hover:bg-white hover:shadow-xl border border-transparent hover:border-[#E8E8ED] transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#E8E8ED] shadow-sm flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#1D1D1F]" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F] mb-2 tracking-tight">{title}</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           STATS — Dark
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#06060A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-blue-600/[0.06] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: "200+", label: "Clients Served" },
              { val: "6",    label: "Core Services" },
              { val: "99%",  label: "Client Satisfaction" },
              { val: "5+",   label: "Years of Excellence" },
            ].map((s, i) => (
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

      {/* ══════════════════════════════════════════════
           WHAT MAKES US DIFFERENT — Light gray
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-[#F5F5F7]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">
              The Trivinex Difference
            </motion.p>
            <motion.h2
              {...fadeUpDelay(0.1)}
              className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-[#1D1D1F]"
            >
              Why businesses choose us.
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {DIFFERENTIATORS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white border border-[#E8E8ED] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 tracking-tight">{title}</h3>
                  <p className="text-[#6E6E73] text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           OUR PEOPLE — Dark gradient
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-[#06060A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-600/[0.08] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] rounded-full bg-blue-600/[0.08] blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-6">
            Our People
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            className="text-4xl lg:text-5xl font-extrabold tracking-tighter text-white leading-[1.1] mb-8"
          >
            Real talent. Real jobs.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 60%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Reliably paid.
            </span>
          </motion.h2>
          <motion.div {...fadeUpDelay(0.15)} className="space-y-5 text-white/60 text-lg leading-relaxed">
            <p>
              There are thousands of talented freelancers out there, but very few ever get the steady work they deserve. Trivinex Partners was built to change that.
            </p>
            <p>
              Freelancers apply through us, go through a proper review and interview process, and once they're in — it's not just another gig. It's a real position with us. We assign them consistent work, hold them to a high standard, and pay them reliably and on time, through whichever method works best for them.
            </p>
            <p>
              This means two things for you: our clients get consistent, quality work from people who are genuinely invested — and our team gets the stability and respect they've earned.
            </p>
          </motion.div>

          {/* Payment methods */}
          <motion.div {...fadeUpDelay(0.2)} className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-5">
              We pay our team via
            </p>
            <div className="flex flex-wrap gap-3">
              {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.10] rounded-2xl px-5 py-3"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                  <span className="text-sm font-semibold text-white/80">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           WE WORK WORLDWIDE — White
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center shrink-0"
            >
              <Globe className="w-10 h-10 text-blue-600" />
            </motion.div>
            <div>
              <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">
                Global Reach
              </motion.p>
              <motion.h2 {...fadeUpDelay(0.1)} className="text-3xl lg:text-4xl font-extrabold tracking-tighter text-[#1D1D1F] mb-4">
                We work worldwide.
              </motion.h2>
              <motion.p {...fadeUpDelay(0.15)} className="text-[#6E6E73] text-lg leading-relaxed">
                Distance, time zones, and borders don't limit who we serve or who we hire. Our clients span continents, and so does our team. Wherever you are, we're ready to work.
              </motion.p>
            </div>
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
        <div className="container mx-auto px-4 text-center relative z-10 max-w-2xl">
          <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">
            Ready to Start?
          </motion.p>
          <motion.h2
            {...fadeUpDelay(0.1)}
            className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5 leading-[1.1]"
          >
            Global talent. Honest pricing. Work that gets done right.
          </motion.h2>
          <motion.p {...fadeUpDelay(0.15)} className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Whether you're a business scaling your digital presence or a talented freelancer looking for a home — we're your partner.
          </motion.p>
          <motion.div {...fadeUpDelay(0.2)} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start a Project
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
