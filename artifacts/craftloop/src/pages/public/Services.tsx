import { useListPublicServices } from "@workspace/api-client-react";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Services() {
  const { data: services, isLoading } = useListPublicServices();

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
              {services?.map((service) => (
                <div key={service.id} className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-bold mb-4 tracking-tight">{service.title}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed min-h-[80px]">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    {service.startingPrice && (
                      <span className="font-semibold text-sm bg-muted px-3 py-1 rounded-full text-foreground/80">
                        From {service.startingPrice}
                      </span>
                    )}
                    <Link href={`/quote?service=${service.category}`}>
                      <Button variant="ghost" className="font-semibold group-hover:text-primary transition-colors">
                        Request Quote <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
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