import { useState } from "react";
import { useListPublicPortfolioItems } from "@workspace/api-client-react";
import type { ServiceCategory } from "@workspace/api-client-react/api.schemas";
import { Loader2, Play, ExternalLink, ArrowRight, Star, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const categories: { label: string; value: ServiceCategory | "" }[] = [
  { label: "All Works", value: "" },
  { label: "Web Development", value: "WEB_DEVELOPMENT" },
  { label: "Video Editing", value: "VIDEO_EDITING" },
  { label: "Photography & Video", value: "PHOTOGRAPHY_VIDEOGRAPHY" },
  { label: "Graphic Design", value: "GRAPHIC_DESIGN" },
  { label: "Content Writing", value: "CONTENT_WRITING" },
  { label: "SEO & Marketing", value: "SEO_DIGITAL_MARKETING" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as any },
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform duration-100 hover:scale-110 focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              n <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-[#E8E8ED] text-[#E8E8ED]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "">("");

  const { data: items, isLoading } = useListPublicPortfolioItems(
    activeCategory ? { category: activeCategory } : undefined
  );

  // Feedback form state
  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (quote.trim().length < 10) {
      setFormError("Your review must be at least 10 characters.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: name.trim(), quote: quote.trim(), rating }),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-center bg-[#06060A] overflow-hidden">
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

        <div className="container mx-auto px-4 md:px-8 relative z-10 pt-28 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-white/60 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Selected Works
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6"
          >
            Our{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 60%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              finest work.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#8E8E9A] text-lg max-w-xl mx-auto leading-relaxed"
          >
            A curated collection of projects we're proud of — spanning web, video, design, photography, and beyond.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F7] to-transparent pointer-events-none" />
      </section>

      {/* FILTER + GRID */}
      <section className="py-20 bg-[#F5F5F7]">
        <div className="container mx-auto px-4">
          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-14">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`inline-flex h-9 items-center rounded-full px-5 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === c.value
                    ? "bg-[#1D1D1F] text-white shadow-md scale-[1.04]"
                    : "bg-white border border-[#D2D2D7] text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F] hover:scale-[1.02]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {items?.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="group overflow-hidden rounded-3xl bg-white border border-[#E8E8ED] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
                  >
                    {/* Media */}
                    <div className="aspect-video relative overflow-hidden bg-[#F5F5F7]">
                      {item.mediaType === "image" && (
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      {item.mediaType === "video" && (
                        <div className="w-full h-full relative">
                          <img
                            src={item.thumbnailUrl || item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-[#06060A] backdrop-blur-sm shadow-xl scale-95 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-6 h-6 ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                      {item.mediaType === "link" && (
                        <div className="w-full h-full relative">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50">
                              <ExternalLink className="w-10 h-10 text-blue-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => window.open(item.mediaUrl, "_blank")}
                              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#06060A] shadow-xl"
                            >
                              Visit <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="text-xs font-bold tracking-wider text-blue-600 mb-2 uppercase">
                        {item.serviceCategory.replace(/_/g, " ")}
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] mb-1.5">{item.title}</h3>
                      {item.description && (
                        <p className="text-[#6E6E73] text-sm line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {items?.length === 0 && (
                <div className="col-span-full text-center py-20 text-[#6E6E73] text-lg">
                  No portfolio items found for this category.
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* LEAVE A REVIEW */}
      <section className="py-24 bg-white border-t border-[#E8E8ED]">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 border border-yellow-200 px-4 py-1.5 text-xs font-semibold text-yellow-700 mb-5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              Client Reviews
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-[#1D1D1F] mb-3">
              Worked with us?
            </h2>
            <p className="text-[#6E6E73] text-base leading-relaxed">
              We'd love to hear about your experience. Leave a review and help others discover great work.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="bg-[#F5F5F7] rounded-3xl border border-[#E8E8ED] p-8"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1D1D1F]">Thank you!</h3>
                  <p className="text-[#6E6E73] text-sm max-w-xs">
                    Your review has been submitted and will appear after approval. We appreciate your feedback!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFeedbackSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-bold text-[#1D1D1F] mb-2">Your Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full h-11 rounded-xl border border-[#D2D2D7] bg-white px-4 text-sm text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1D1D1F] mb-2">Your Rating</label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1D1D1F] mb-2">Your Review</label>
                    <textarea
                      value={quote}
                      onChange={e => setQuote(e.target.value)}
                      placeholder="Tell us about your experience working with us..."
                      rows={4}
                      className="w-full rounded-xl border border-[#D2D2D7] bg-white px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="text-sm text-red-500 font-medium">{formError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1D1D1F] text-white text-sm font-bold hover:bg-[#3A3A3C] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-[#AEAEB2]">
                    Reviews are moderated and typically approved within 24 hours.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#06060A] py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full bg-blue-500/15 blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            {...fadeUp}
            className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-5 leading-[1.1]"
          >
            Your project could be next.
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Let's create something you'll be proud to show off.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/quote"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start a Project
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 text-white px-8 text-sm font-semibold hover:bg-white/[0.06] transition-colors duration-200"
            >
              Explore Services <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
