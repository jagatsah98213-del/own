import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListPublicServices, useCreateInquiry } from "@workspace/api-client-react";
import { ServiceCategory } from "@workspace/api-client-react/api.schemas";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const badgeConfig: Record<string, { label: string; className: string }> = {
  HOT: { label: "🔥 Hot", className: "bg-red-500 text-white border-0" },
  NEW: { label: "✨ New", className: "bg-blue-500 text-white border-0" },
  POPULAR: { label: "⭐ Popular", className: "bg-amber-500 text-white border-0" },
  BEST_VALUE: { label: "💎 Best Value", className: "bg-purple-500 text-white border-0" },
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  serviceNeeded: z.nativeEnum(ServiceCategory, { required_error: "Please select a service" }),
  servicePlanId: z.number().optional(),
  projectDetails: z.string().min(20, "Please provide some details about your project"),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
});

export default function Quote() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialService = searchParams.get("service") as ServiceCategory | null;
  const initialPlanId = searchParams.get("plan") ? Number(searchParams.get("plan")) : undefined;

  const { toast } = useToast();
  const createInquiry = useCreateInquiry();
  const { data: services } = useListPublicServices();
  const [submitted, setSubmitted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<z.infer<typeof formSchema>, any, z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceNeeded: Object.values(ServiceCategory).includes(initialService as any) ? (initialService ?? undefined) : undefined,
      servicePlanId: initialPlanId,
      projectDetails: "",
      budgetRange: "",
      timeline: "",
    }
  });

  const watchedService = form.watch("serviceNeeded");
  const selectedService = services?.find(s => s.category === watchedService);
  const availablePlans = selectedService?.plans?.filter(p => p.isActive) ?? [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    createInquiry.mutate({ data: values }, {
      onSuccess: () => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message || "Failed to submit request" });
      }
    });
  }

  if (submitted) {
    return (
      <div className="py-32 container mx-auto px-4 max-w-2xl text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Request Received</h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Thank you for reaching out to Craftloop. Our team will review your project details and get back to you within 24 hours with a tailored proposal.
        </p>
        <Button size="lg" className="rounded-full px-8" onClick={() => window.location.href = "/"}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Get a Quote</h1>
          <p className="text-lg text-muted-foreground font-medium">Tell us about your vision. We'll bring it to life.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Full Name *</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Email Address *</FormLabel>
                      <FormControl><Input type="email" className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Phone Number *</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="serviceNeeded" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Service Needed *</FormLabel>
                      <Select onValueChange={(v) => { field.onChange(v); form.setValue("servicePlanId", undefined); }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                          <SelectItem value="VIDEO_EDITING">Video Editing</SelectItem>
                          <SelectItem value="PHOTOGRAPHY_VIDEOGRAPHY">Photography & Videography</SelectItem>
                          <SelectItem value="GRAPHIC_DESIGN">Graphic Design</SelectItem>
                          <SelectItem value="CONTENT_WRITING">Content Writing</SelectItem>
                          <SelectItem value="SEO_DIGITAL_MARKETING">SEO & Digital Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {availablePlans.length > 0 && (
                  <FormField control={form.control} name="servicePlanId" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Specific Plan (Optional)</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v === "none" ? undefined : Number(v))}
                        value={field.value !== undefined ? String(field.value) : "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Not sure — general inquiry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Not sure — general inquiry</SelectItem>
                          {availablePlans.map((plan) => {
                            const badge = plan.badge !== "NONE" ? badgeConfig[plan.badge] : null;
                            return (
                              <SelectItem key={plan.id} value={String(plan.id)}>
                                <div className="flex items-center gap-2">
                                  <span>{plan.name}</span>
                                  {badge && <Badge className={`text-xs px-1.5 py-0 h-4 ${badge.className}`}>{badge.label}</Badge>}
                                  {plan.startingPrice && <span className="text-muted-foreground text-xs">— {plan.startingPrice}</span>}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}

                <FormField control={form.control} name="projectDetails" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Project Details *</FormLabel>
                    <FormControl><Textarea className="min-h-[150px] rounded-xl resize-y" placeholder="Describe your project, goals, and requirements..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="budgetRange" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Estimated Budget (Optional)</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" placeholder="e.g. $5,000 - $10,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="timeline" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Expected Timeline (Optional)</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" placeholder="e.g. 2-3 months" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" disabled={createInquiry.isPending}>
                  {createInquiry.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Quote Request"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
