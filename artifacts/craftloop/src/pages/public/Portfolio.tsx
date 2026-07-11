import { useState } from "react";
import { useListPublicPortfolioItems } from "@workspace/api-client-react";
import type { ServiceCategory } from "@workspace/api-client-react/api.schemas";
import { Loader2, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories: { label: string; value: ServiceCategory | "" }[] = [
  { label: "All Works", value: "" },
  { label: "Web Development", value: "WEB_DEVELOPMENT" },
  { label: "Video Editing", value: "VIDEO_EDITING" },
  { label: "Photography & Video", value: "PHOTOGRAPHY_VIDEOGRAPHY" },
  { label: "Graphic Design", value: "GRAPHIC_DESIGN" },
  { label: "Content Writing", value: "CONTENT_WRITING" },
  { label: "SEO & Marketing", value: "SEO_DIGITAL_MARKETING" },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "">("");
  
  const { data: items, isLoading } = useListPublicPortfolioItems(
    activeCategory ? { category: activeCategory } : undefined
  );

  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-24 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">Our Work</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Explore our curated portfolio of successful projects and creative solutions.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map(c => (
              <Button
                key={c.value}
                variant={activeCategory === c.value ? "default" : "outline"}
                className={`rounded-full ${activeCategory === c.value ? "shadow-md" : "border-border/60 hover:bg-muted"}`}
                onClick={() => setActiveCategory(c.value)}
              >
                {c.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items?.map((item) => (
                <div key={item.id} className="group overflow-hidden rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {item.mediaType === "image" && (
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    {item.mediaType === "video" && (
                      <div className="w-full h-full relative">
                         <img src={item.thumbnailUrl || item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                           <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-black backdrop-blur-sm shadow-xl scale-95 group-hover:scale-100 transition-transform">
                             <Play className="w-6 h-6 ml-1" />
                           </div>
                         </div>
                      </div>
                    )}
                    {item.mediaType === "link" && (
                       <div className="w-full h-full relative">
                         {item.thumbnailUrl ? (
                           <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-primary/5">
                              <ExternalLink className="w-10 h-10 text-primary/40" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button variant="secondary" className="rounded-full shadow-xl" onClick={() => window.open(item.mediaUrl, "_blank")}>
                              Visit Link <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                         </div>
                       </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-bold tracking-wider text-primary mb-2 uppercase">{item.serviceCategory.replace(/_/g, " ")}</div>
                    <h3 className="text-xl font-bold tracking-tight mb-2">{item.title}</h3>
                    {item.description && <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              ))}
              {items?.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground font-medium text-lg">No portfolio items found for this category.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}