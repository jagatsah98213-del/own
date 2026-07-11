import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter">
            Craftloop<span className="text-primary">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <Link href="/services" className={location === "/services" ? "text-foreground" : "hover:text-foreground transition-colors"}>Services</Link>
            <Link href="/portfolio" className={location === "/portfolio" ? "text-foreground" : "hover:text-foreground transition-colors"}>Portfolio</Link>
            <Link href="/about" className={location === "/about" ? "text-foreground" : "hover:text-foreground transition-colors"}>About</Link>
            <Link href="/testimonials" className={location === "/testimonials" ? "text-foreground" : "hover:text-foreground transition-colors"}>Testimonials</Link>
            <Link href="/consultation" className={location === "/consultation" ? "text-foreground" : "hover:text-foreground transition-colors"}>Book Consultation</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/quote" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get a Quote
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border/50 py-16 mt-20 bg-muted/20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-2xl tracking-tighter">Craftloop.</span>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              An established creative studio delivering enterprise-grade web development, design, and multimedia services.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-sm font-medium text-muted-foreground">
            <div className="flex gap-6">
              <Link href="/careers" className="hover:text-foreground transition-colors">Join our Team (Careers)</Link>
              <Link href="/employee/login" className="hover:text-foreground transition-colors">Employee Portal</Link>
            </div>
            <span className="mt-2">&copy; {new Date().getFullYear()} Craftloop. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}