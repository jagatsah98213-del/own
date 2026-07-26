import { useListPublicTestimonials } from "@workspace/api-client-react";
import type { Testimonial } from "@workspace/api-client-react";
import { Loader2, Star, Quote, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useEffect } from "react";
import { SEOHead, SITE_URL } from "@/components/SEOHead";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as any },
};

// ─── Build Google-compatible Review JSON-LD ───────────────────────────────────
function buildReviewSchema(testimonials: Testimonial[]) {
  if (!testimonials.length) return null;

  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const avgRating = (totalRating / testimonials.length).toFixed(1);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    "name": "Trivinex Partners",
    "url": SITE_URL,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": testimonials.slice(0, 10).map((t) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.clientName,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": String(t.rating),
        "bestRating": "5",
        "worstRating": "1",
      },
      "reviewBody": t.quote,
      "publisher": {
        "@type": "Organization",
        "name": "Trivinex Partners",
      },
    })),
  };
}

export default function Testimonials() {
  const { data: testimonials, isLoading } = useListPublicTestimonials();
  const published = testimonials?.filter((t) => t.isPublished !== false) ?? [];

  // Inject / remove review JSON-LD dynamically once data loads
  useEffect(() => {
    if (!published.length) return;
    const schema = buildReviewSchema(published);
    if (!schema) return;

    const id = "reviews-jsonld";
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [JSON.stringify(published)]);

  const totalRating = published.reduce((s, t) => s + t.rating, 0);
  const avgRating = published.length ? (totalRating / published.length).toFixed(1) : "4.9";

  return (
    <div className="flex flex-col overflow-hidden">
      <SEOHead
        title="Client Reviews — Real Results, Real People"
        description={`Read what our clients say about Trivinex Partners. ${published.length > 0 ? `Rated ${avgRating}/5 from ${published.length} verified client reviews.` : "Rated 4.9/5 by businesses worldwide."} Web development, video editing, SEO, and more.`}
        canonical="/testimonials"
      />

      {/* ══════════════════════════════════════════════
           HERO — Dark
      ══════════════════════════════════════════════ */}
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
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            {avgRating} / 5.0 Average Rating
            {published.length > 0 && (
              <span className="text-white/40">· {published.length} reviews</span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] as any }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6"
          >
            Real results.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 60%, #F472B6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Real people.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#8E8E9A] text-lg max-w-xl mx-auto leading-relaxed"
          >
            Don't take our word for it. Hear directly from the businesses and creators who trust Trivinex Partners to deliver world-class digital work.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F7] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
           REVIEWS GRID — with microdata itemScope
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F5F5F7]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : (
            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              itemScope
              itemType="https://schema.org/ItemList"
            >
              {published.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as any }}
                  className="relative bg-white border border-[#E8E8ED] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  itemScope
                  itemType="https://schema.org/Review"
                  itemProp="itemListElement"
                >
                  {/* Quote icon */}
                  <Quote className="absolute top-7 right-7 w-8 h-8 text-blue-100" />

                  {/* Stars — microdata rating */}
                  <div
                    className="flex gap-1 mb-6"
                    itemScope
                    itemType="https://schema.org/Rating"
                    itemProp="reviewRating"
                  >
                    <meta itemProp="ratingValue" content={String(t.rating)} />
                    <meta itemProp="bestRating"  content="5" />
                    <meta itemProp="worstRating" content="1" />
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < t.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-[#E8E8ED] text-[#E8E8ED]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p
                    className="text-[#1D1D1F] text-base leading-relaxed mb-7 font-medium"
                    itemProp="reviewBody"
                  >
                    "{t.quote}"
                  </p>

                  {/* Author */}
                  <div
                    className="flex items-center gap-3 pt-5 border-t border-[#E8E8ED]"
                    itemScope
                    itemType="https://schema.org/Person"
                    itemProp="author"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {t.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-bold text-[#1D1D1F] text-sm" itemProp="name">
                      {t.clientName}
                    </div>
                  </div>
                </motion.div>
              ))}

              {published.length === 0 && (
                <div className="col-span-full text-center py-20 text-[#6E6E73] text-lg">
                  More client testimonials coming soon.
                </div>
              )}
            </div>
          )}
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
            Ready to be next?
          </motion.h2>
          <motion.p {...fadeUp} className="text-white/50 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Join 200+ businesses that trust Trivinex Partners to deliver world-class digital work.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-4">
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
      </section>
    </div>
  );
}
