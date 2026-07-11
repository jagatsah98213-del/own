import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Video, Camera, Palette, PenTool, TrendingUp } from "lucide-react";
import heroImg from "@assets/generated_images/hero.jpg";

export default function Home() {
  return (
    <div className="flex flex-col animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground mb-6 leading-[1.1]">
              We design, build, and scale <span className="text-primary">digital experiences.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
              Craftloop is a premium creative studio delivering elite web development, video editing, photography, graphic design, content writing, and SEO. 
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/quote" className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/40">
                Get a Quote
              </Link>
              <Link href="/consultation" className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-background px-8 text-lg font-semibold hover:bg-muted/50 transition-colors">
                Book a Consultation
              </Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 aspect-square lg:aspect-auto lg:h-[600px] border border-border/50">
            <img src={heroImg} alt="Abstract 3D shapes representing digital creativity" className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">Our Expertise</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">Comprehensive digital services delivered by our vetted, in-house experts.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Code, title: "Web Development", desc: "Custom, scalable web applications and digital platforms engineered for performance." },
              { icon: Video, title: "Video Editing", desc: "Professional post-production, color grading, and dynamic motion graphics." },
              { icon: Camera, title: "Photography", desc: "High-end commercial, portrait, and product photography with precision lighting." },
              { icon: Palette, title: "Graphic Design", desc: "Brand identity systems, intuitive UI/UX design, and striking marketing collateral." },
              { icon: PenTool, title: "Content Writing", desc: "Engaging copy, technical documentation, and compelling brand storytelling." },
              { icon: TrendingUp, title: "SEO & Marketing", desc: "Data-driven organic search strategies and measurable digital growth campaigns." }
            ].map((s, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <s.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{s.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">{s.desc}</p>
                <Link href="/services" className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-center mb-20">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
            {[
              { step: "01", title: "Discovery", desc: "We map out your goals, technical requirements, and aesthetic vision." },
              { step: "02", title: "Execution", desc: "Our dedicated specialists craft your project with meticulous attention to detail." },
              { step: "03", title: "Delivery", desc: "You receive polished, production-ready assets on time, every time." }
            ].map((s, i) => (
              <div key={i} className="text-center relative bg-background">
                <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-xl text-primary flex items-center justify-center text-3xl font-black mx-auto mb-8 relative z-10">
                  {s.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}