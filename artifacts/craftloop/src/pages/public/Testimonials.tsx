import { useListPublicTestimonials } from "@workspace/api-client-react";
import { Loader2, Star, QuoteIcon } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useListPublicTestimonials();

  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-24 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">Client Success</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Don't just take our word for it. Hear what our partners have to say about working with Craftloop.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials?.map((t) => (
                <div key={t.id} className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative">
                  <QuoteIcon className="absolute top-8 right-8 w-10 h-10 text-primary/10" />
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < t.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="text-lg mb-8 leading-relaxed font-medium">"{t.quote}"</p>
                  <div className="font-bold text-foreground">{t.clientName}</div>
                </div>
              ))}
              {testimonials?.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground font-medium text-lg">More testimonials coming soon.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}