import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/consultation", label: "Consultation" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-[#1D1D1F] font-sans selection:bg-blue-100">
      {/* ─── Nav ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-[#D2D2D7]/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-extrabold text-lg tracking-tighter flex items-center gap-0.5 shrink-0">
            <span className="text-[#1D1D1F]">TRIVINEX</span>
            <span className="text-blue-600"> PARTNERS</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  location === href
                    ? "text-[#1D1D1F]"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/freelancers"
              className="hidden md:inline-flex h-9 items-center justify-center rounded-full border border-[#D2D2D7] px-5 text-xs font-semibold text-[#1D1D1F] hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              Join as Freelancer
            </Link>
            <Link
              href="/quote"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#1D1D1F] px-5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors duration-200"
            >
              Get a Quote
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[#E8E8ED] bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {[...navLinks, { href: "/freelancers", label: "Join as Freelancer" }].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium py-3 px-3 rounded-xl transition-colors ${
                      location === href
                        ? "text-[#1D1D1F] bg-[#F5F5F7]"
                        : "text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* ─── Footer ─── */}
      <footer className="bg-[#F5F5F7] border-t border-[#E8E8ED] py-16 mt-0">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <span className="font-extrabold text-xl tracking-tighter block mb-3">
                <span className="text-[#1D1D1F]">TRIVINEX</span>
                <span className="text-blue-600"> PARTNERS</span>
              </span>
              <p className="text-sm text-[#6E6E73] max-w-xs leading-relaxed">
                A premium creative studio delivering enterprise-grade web development, design, and multimedia services to businesses worldwide.
              </p>
            </div>

            {/* Services */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#6E6E73] mb-4">Services</p>
              <div className="flex flex-col gap-2.5">
                {["Web Development", "Video Editing", "Graphic Design", "Photography", "SEO & Marketing"].map(s => (
                  <Link key={s} href="/services" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">{s}</Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#6E6E73] mb-4">Company</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/about" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">About Us</Link>
                <Link href="/portfolio" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Portfolio</Link>
                <Link href="/testimonials" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Testimonials</Link>
                <Link href="/freelancers" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Join as Freelancer</Link>
                <Link href="/employee/login" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors">Employee Portal</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E8E8ED] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6E6E73]">
              &copy; {new Date().getFullYear()} Trivinex Partners. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[#6E6E73]">Privacy Policy</span>
              <span className="text-xs text-[#6E6E73]">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
