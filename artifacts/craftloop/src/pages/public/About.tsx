import { Link } from "wouter";

export default function About() {
  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-24 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">About Trivinex Partners</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            We are a digital services agency built differently. Real experts, real employees, unmatched quality.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl space-y-16">
          <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight max-w-none">
            <h2>Our Story</h2>
            <p>
              Trivinex Partners started with a simple observation: the gig economy is broken. Freelancers spend more time hunting for work than creating, and businesses waste resources filtering through unvetted candidates hoping to strike gold.
            </p>
            <p>
              We built an agency that solves both sides of the equation. We find the top 1% of independent creative and technical talent, bring them onto our team, and provide them with a steady stream of high-quality projects. For our clients, this means getting agency-level reliability and quality without the massive overhead.
            </p>

            <h2>The Trivinex Standard</h2>
            <p>
              Every project at Trivinex Partners goes through a rigorous quality assurance process. We don't just act as a middleman; we manage the workflow, guarantee the deadlines, and stand behind every deliverable. Our six core services represent our deep expertise — we only offer what we know we can execute perfectly.
            </p>

            <div className="not-prose my-12 grid sm:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center">
                <div className="text-4xl font-black text-primary mb-2">99%</div>
                <div className="font-semibold text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center">
                <div className="text-4xl font-black text-primary mb-2">6</div>
                <div className="font-semibold text-muted-foreground">Specialized Services</div>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center">
                <div className="text-4xl font-black text-primary mb-2">100+</div>
                <div className="font-semibold text-muted-foreground">Vetted Experts</div>
              </div>
            </div>

            <h2>Join the Mission</h2>
            <p>
              Whether you're a business looking to scale your digital presence or an elite freelancer looking for a stable home to do your best work, Trivinex Partners is your partner.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
            <Link href="/quote" className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">Work with Us</Link>
            <Link href="/freelancers" className="inline-flex h-11 items-center justify-center rounded-full border border-input bg-background px-8 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">Join as a Freelancer</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
