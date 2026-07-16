import { useListPublicServices } from "@workspace/api-client-react";
import { Loader2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const badgeConfig: Record<string, { label: string; className: string }> = {
  HOT: { label: "Hot", className: "bg-red-500 hover:bg-red-600 text-white border-0" },
  NEW: { label: "New", className: "bg-blue-500 hover:bg-blue-600 text-white border-0" },
  POPULAR: { label: "Popular", className: "bg-amber-500 hover:bg-amber-600 text-white border-0" },
  BEST_VALUE: { label: "Best Value", className: "bg-purple-500 hover:bg-purple-600 text-white border-0" },
};

export default function Services() {
  const { data: services, isLoading } = useListPublicServices();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-24 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            We provide specialized digital solutions tailored to elevate your brand and drive results.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {services?.map((service) => {
                const isOpen = expandedId === service.id;
                const activePlans = service.plans?.filter(p => p.isActive) ?? [];
                return (
                  <div key={service.id} className="group rounded-3xl bg-card border border-border hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-4 tracking-tight">{service.title}</h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed min-h-[60px]">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {service.startingPrice && (
                          <span className="font-semibold text-sm bg-muted px-3 py-1 rounded-full text-foreground/80">
                            From {service.startingPrice}
                          </span>
                        )}
                        {activePlans.length > 0 ? (
                          <Button
                            variant="ghost"
                            className="font-semibold group-hover:text-primary transition-colors ml-auto"
                            onClick={() => setExpandedId(isOpen ? null : service.id)}
                          >
                            {isOpen ? "Hide Plans" : `View ${activePlans.length} Plans`}
                            {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                          </Button>
                        ) : (
                          <Link href={`/quote?service=${service.category}`} className="ml-auto">
                            <Button variant="ghost" className="font-semibold group-hover:text-primary transition-colors">
                              Request Quote <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {isOpen && activePlans.length > 0 && (
                      <div className="border-t border-border bg-muted/20">
                        <div className="divide-y divide-border/50">
                          {activePlans.map((plan) => {
                            const badge = plan.badge !== "NONE" ? badgeConfig[plan.badge] : null;
                            return (
                              <div key={plan.id} className="px-8 py-5 flex items-start justify-between gap-4 hover:bg-muted/40 transition-colors">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="font-semibold text-sm">{plan.name}</span>
                                    {badge && (
                                      <Badge className={`text-xs px-2 py-0 h-5 ${badge.className}`}>{badge.label}</Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs px-2 py-0 h-5 font-medium">
                                      {plan.pricingType === "MONTHLY" ? "Monthly" : "One-time"}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                  {plan.startingPrice && (
                                    <div className="text-sm font-bold text-primary whitespace-nowrap">{plan.startingPrice}</div>
                                  )}
                                  <Link href={`/quote?service=${service.category}&plan=${plan.id}`}>
                                    <Button variant="ghost" size="sm" className="text-xs mt-1 h-7 px-2 text-muted-foreground hover:text-primary">
                                      Quote <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="px-8 py-4 border-t border-border/50">
                          <Link href={`/quote?service=${service.category}`}>
                            <Button size="sm" className="w-full rounded-xl font-semibold">
                              Get a Custom Quote <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {services?.length === 0 && (
                <div className="col-span-2 text-center py-20 text-muted-foreground">No services available right now.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
