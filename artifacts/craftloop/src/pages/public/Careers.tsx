import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateApplicant } from "@workspace/api-client-react";
import { ServiceCategory, PayoutMethod } from "@workspace/api-client-react/api.schemas";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Phone number is required"),
  serviceCategory: z.nativeEnum(ServiceCategory, { required_error: "Please select a specialty" }),
  portfolioLinks: z.string().min(5, "At least one portfolio link is required"), // We'll split this by comma for the API
  yearsExperience: z.coerce.number().min(0).max(50),
  equipmentOwned: z.string().optional(),
  availability: z.string().min(2, "Please indicate your availability"),
  expectedRate: z.string().min(2, "Please indicate your expected rate"),
  preferredPayout: z.nativeEnum(PayoutMethod, { required_error: "Please select a payout method" }),
  coverNote: z.string().optional(),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export default function Careers() {
  const { toast } = useToast();
  const createApplicant = useCreateApplicant();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      portfolioLinks: "",
      yearsExperience: 0,
      equipmentOwned: "",
      availability: "",
      expectedRate: "",
      coverNote: "",
      resumeUrl: "",
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const portfolioLinksArray = values.portfolioLinks.split(",").map(s => s.trim()).filter(Boolean);
    
    createApplicant.mutate({ 
      data: { 
        ...values, 
        portfolioLinks: portfolioLinksArray,
        resumeUrl: values.resumeUrl || undefined
      } 
    }, {
      onSuccess: () => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message || "Failed to submit application" });
      }
    });
  }

  if (submitted) {
    return (
      <div className="py-32 container mx-auto px-4 max-w-2xl text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Application Submitted</h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Thank you for applying to join the Craftloop team. We review portfolios carefully and will reach out via email if your work aligns with our current needs.
        </p>
        <Button size="lg" className="rounded-full px-8" onClick={() => window.location.href = "/"}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Join Our Roster</h1>
          <p className="text-lg text-muted-foreground font-medium">We hire the top 1% of independent talent as full-time or fractional employees. Stop hunting for clients and start creating.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div>
                  <h3 className="text-lg font-bold border-b border-border pb-2 mb-6">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
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
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b border-border pb-2 mb-6">Professional Details</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormField control={form.control} name="serviceCategory" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Primary Specialty *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select specialty" /></SelectTrigger>
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
                    <FormField control={form.control} name="yearsExperience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Years of Experience *</FormLabel>
                        <FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="portfolioLinks" render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="font-semibold">Portfolio Links * (comma separated)</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" placeholder="https://dribbble.com/..., https://github.com/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="resumeUrl" render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="font-semibold">Resume / CV URL (Optional)</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" placeholder="Link to Google Drive, Dropbox, etc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="equipmentOwned" render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="font-semibold">Equipment & Software Owned</FormLabel>
                      <FormControl><Textarea className="min-h-[80px] rounded-xl resize-y" placeholder="e.g. MacBook Pro M3, Sony A7IV, Adobe CC subscription..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b border-border pb-2 mb-6">Logistics</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <FormField control={form.control} name="availability" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Availability *</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" placeholder="e.g. 20 hrs/week, full-time" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="expectedRate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Price / Service *</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" placeholder="e.g. $150/logo, $45/hr, $500/video" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="preferredPayout" render={({ field }) => (
                    <FormItem className="mb-6 max-w-sm">
                      <FormLabel className="font-semibold">Preferred Payout Method *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select method" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          <SelectItem value="PHONEPE">PhonePe</SelectItem>
                          <SelectItem value="PAYPAL">PayPal</SelectItem>
                          <SelectItem value="ESEWA">eSewa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="coverNote" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Cover Note (Optional)</FormLabel>
                      <FormControl><Textarea className="min-h-[100px] rounded-xl resize-y" placeholder="Anything else we should know?" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" disabled={createApplicant.isPending}>
                  {createApplicant.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Application"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}