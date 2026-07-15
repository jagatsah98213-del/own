import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/consultation", label: "Consultation" },
    { href: "/freelancers", label: "Join as Freelancer" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tighter flex items-center gap-1">
            <span className="text-foreground">TRIVINEX</span>
            <span className="text-primary"> PARTNERS</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            {navLinks.slice(0, 5).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={location === href ? "text-foreground" : "hover:text-foreground transition-colors"}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/freelancers"
              className="hidden md:inline-flex h-10 items-center justify-center rounded-full border border-primary/60 px-5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Join as Freelancer
            </Link>
            <Link
              href="/quote"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get a Quote
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-semibold py-2 border-b border-border/30 last:border-0 ${location === href ? "text-foreground" : "text-muted-foreground hover:text-foreground"} transition-colors`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/50 py-16 mt-20 bg-muted/20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-3">
            <span className="font-extrabold text-xl tracking-tighter">
              <span className="text-foreground">TRIVINEX</span>
              <span className="text-primary"> PARTNERS</span>
            </span>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              An established creative studio delivering enterprise-grade web development, design, and multimedia services.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Services</p>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Web Development</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Video Editing</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Graphic Design</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Photography</Link>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SEO & Marketing</Link>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 md:self-end">Company</p>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
            <Link href="/freelancers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join as Freelancer</Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
            <Link href="/employee/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Employee Portal</Link>
            <span className="text-xs text-muted-foreground/50 mt-2">
              &copy; {new Date().getFullYear()} Trivinex Partners. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
