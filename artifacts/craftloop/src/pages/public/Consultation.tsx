import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListPublicMeetingSlots, useCreateMeetingBooking } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  slotId: z.number({ required_error: "Please select a time slot" }),
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(5, "Phone number is required"),
  notes: z.string().optional(),
});

export default function Consultation() {
  const { data: slots, isLoading: loadingSlots } = useListPublicMeetingSlots();
  const createBooking = useCreateMeetingBooking();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    }
  });

  const selectedSlotId = form.watch("slotId");
  const selectedSlot = slots?.find(s => s.id === selectedSlotId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createBooking.mutate({ data: values }, {
      onSuccess: () => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Booking failed", description: (err.data as any)?.message || err.message || "Could not complete booking" });
      }
    });
  }

  if (submitted) {
    return (
      <div className="py-32 container mx-auto px-4 max-w-2xl text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4">Consultation Booked</h1>
        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
          Your free consultation has been scheduled successfully. We've sent a calendar invitation and meeting link to your email.
        </p>
        <div className="bg-card border border-border rounded-2xl p-6 inline-block mx-auto mb-8 text-left shadow-sm">
           <div className="font-bold text-lg mb-2">Meeting Details</div>
           {selectedSlot && (
             <div className="space-y-2 text-muted-foreground font-medium">
               <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {format(new Date(selectedSlot.date), "EEEE, MMMM d, yyyy")}</div>
               <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {selectedSlot.startTime}</div>
             </div>
           )}
        </div>
        <br/>
        <Button size="lg" className="rounded-full px-8" onClick={() => window.location.href = "/"}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Book a Free Consultation</h1>
          <p className="text-lg text-muted-foreground font-medium">Schedule a 30-minute discovery call to discuss your needs and see how Craftloop can help.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_400px] gap-12">
              
              <div className="space-y-8">
                <div className="bg-card border border-border shadow-sm rounded-3xl p-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">1. Select a Time</h2>
                  {loadingSlots ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : slots?.length === 0 ? (
                    <div className="p-8 text-center bg-muted/50 rounded-xl text-muted-foreground">No available slots this week. Please check back later.</div>
                  ) : (
                    <FormField control={form.control} name="slotId" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {slots?.map(slot => {
                              const isSelected = field.value === slot.id;
                              return (
                                <div 
                                  key={slot.id} 
                                  onClick={() => field.onChange(slot.id)}
                                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border/50 bg-background hover:border-primary/30'}`}
                                >
                                  <div className="font-bold mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />{format(new Date(slot.date), "MMM d, yyyy")}</div>
                                  <div className="text-muted-foreground font-medium flex items-center gap-2"><Clock className="w-4 h-4" />{slot.startTime}</div>
                                </div>
                              )
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>

                <div className="bg-card border border-border shadow-sm rounded-3xl p-8">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">2. Your Details</h2>
                  <div className="space-y-6">
                    <FormField control={form.control} name="clientName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Full Name *</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="clientEmail" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Email Address *</FormLabel>
                          <FormControl><Input type="email" className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="clientPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Phone Number *</FormLabel>
                          <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">What would you like to discuss? (Optional)</FormLabel>
                        <FormControl><Textarea className="min-h-[100px] rounded-xl resize-y" placeholder="Briefly describe what you're looking for..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 sticky top-28">
                  <h3 className="text-xl font-bold tracking-tight mb-4">Summary</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-primary/10">
                      <span className="text-muted-foreground font-medium">Service</span>
                      <span className="font-bold">Consultation</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-primary/10">
                      <span className="text-muted-foreground font-medium">Duration</span>
                      <span className="font-bold">30 Minutes</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-primary/10">
                      <span className="text-muted-foreground font-medium">Cost</span>
                      <span className="font-bold text-primary">Free</span>
                    </div>
                    {selectedSlot && (
                      <div className="py-3">
                        <span className="block text-muted-foreground font-medium mb-1">Selected Time</span>
                        <span className="block font-bold">{format(new Date(selectedSlot.date), "EEEE, MMMM d, yyyy")}</span>
                        <span className="block font-bold">{selectedSlot.startTime}</span>
                      </div>
                    )}
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" disabled={createBooking.isPending}>
                    {createBooking.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm Booking"}
                  </Button>
                </div>
              </div>
              
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}