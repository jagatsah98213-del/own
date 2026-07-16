import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListPublicMeetingSlots, useCreateMeetingBooking } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const formSchema = z.object({
  slotId:      z.number({ required_error: "Please select a time slot" }),
  clientName:  z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(5, "Phone number is required"),
  notes:       z.string().optional(),
});

export default function Consultation() {
  const { data: slots, isLoading: loadingSlots } = useListPublicMeetingSlots();
  const createBooking = useCreateMeetingBooking();
  const { toast }     = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { clientName: "", clientEmail: "", clientPhone: "", notes: "" },
  });

  const selectedSlotId = form.watch("slotId");
  const selectedSlot   = slots?.find((s) => s.id === selectedSlotId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createBooking.mutate({ data: values }, {
      onSuccess: () => { setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); },
      onError: (err) => {
        toast({ variant: "destructive", title: "Booking failed", description: (err.data as any)?.message || err.message || "Could not complete booking" });
      },
    });
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#06060A] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-blue-500/15 blur-[100px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-10 text-center px-4 max-w-lg mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-4">Consultation Booked</h1>
          <p className="text-[#8E8E9A] text-lg mb-8 leading-relaxed">
            Your free consultation has been scheduled. A calendar invite and meeting link have been sent to your email.
          </p>
          {selectedSlot && (
            <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 mb-8 text-left inline-block">
              <div className="text-white font-bold mb-3">Meeting Details</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#8E8E9A] text-sm">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  {format(new Date(selectedSlot.date), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2 text-[#8E8E9A] text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {selectedSlot.startTime}
                </div>
              </div>
            </div>
          )}
          <br />
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white text-[#06060A] px-8 text-sm font-bold shadow-2xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════════
           HERO — Dark
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[44vh] flex items-center bg-[#06060A] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-28 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-white/60 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            100% Free · No commitment
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white leading-[1.05] mb-5"
          >
            Book a Free Consultation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#8E8E9A] text-lg max-w-md mx-auto leading-relaxed"
          >
            Schedule a 30-minute discovery call to discuss your needs and see how we can help.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F5F7] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
           FORM
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F5F7]">
        <div className="container mx-auto px-4 max-w-5xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_380px] gap-8">

              {/* Left column */}
              <div className="space-y-6">
                {/* Time picker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-[#E8E8ED] shadow-sm rounded-3xl p-8"
                >
                  <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-6">
                    1. Select a Time
                  </h2>
                  {loadingSlots ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                  ) : slots?.length === 0 ? (
                    <div className="p-6 text-center bg-[#F5F5F7] rounded-2xl text-[#6E6E73]">
                      No available slots this week. Please check back later.
                    </div>
                  ) : (
                    <FormField control={form.control} name="slotId" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {slots?.map((slot) => {
                              const isSelected = field.value === slot.id;
                              return (
                                <div
                                  key={slot.id}
                                  onClick={() => field.onChange(slot.id)}
                                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 shadow-md"
                                      : "border-[#E8E8ED] bg-white hover:border-blue-200"
                                  }`}
                                >
                                  <div className="font-bold text-[#1D1D1F] mb-1 flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-[#6E6E73]" />
                                    {format(new Date(slot.date), "MMM d, yyyy")}
                                  </div>
                                  <div className="text-[#6E6E73] font-medium flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4" />
                                    {slot.startTime}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </motion.div>

                {/* Your details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white border border-[#E8E8ED] shadow-sm rounded-3xl p-8"
                >
                  <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-6">
                    2. Your Details
                  </h2>
                  <div className="space-y-5">
                    <FormField control={form.control} name="clientName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[#1D1D1F]">Full Name *</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl border-[#E8E8ED]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="clientEmail" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[#1D1D1F]">Email Address *</FormLabel>
                          <FormControl><Input type="email" className="h-12 rounded-xl border-[#E8E8ED]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="clientPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-[#1D1D1F]">Phone Number *</FormLabel>
                          <FormControl><Input className="h-12 rounded-xl border-[#E8E8ED]" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-[#1D1D1F]">What would you like to discuss? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[100px] rounded-xl border-[#E8E8ED] resize-y"
                            placeholder="Briefly describe what you're looking for..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </motion.div>
              </div>

              {/* Right: summary sticky */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-white border border-[#E8E8ED] rounded-3xl p-8 sticky top-28 shadow-xl"
                >
                  <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-6">Summary</h3>
                  <div className="space-y-3 mb-8">
                    {[
                      { label: "Service", val: "Strategy Call" },
                      { label: "Duration", val: "30 Minutes" },
                      { label: "Cost", val: "Free" },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between items-center py-3 border-b border-[#F5F5F7]">
                        <span className="text-[#6E6E73] text-sm font-medium">{label}</span>
                        <span className={`font-bold text-sm ${val === "Free" ? "text-green-600" : "text-[#1D1D1F]"}`}>{val}</span>
                      </div>
                    ))}
                    {selectedSlot && (
                      <div className="py-3">
                        <span className="block text-[#6E6E73] text-sm font-medium mb-1.5">Selected Time</span>
                        <span className="block font-bold text-[#1D1D1F] text-sm">{format(new Date(selectedSlot.date), "EEEE, MMMM d, yyyy")}</span>
                        <span className="block font-bold text-[#1D1D1F] text-sm">{selectedSlot.startTime}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={createBooking.isPending}
                    className="w-full h-14 rounded-xl text-base font-bold bg-[#1D1D1F] text-white flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                  >
                    {createBooking.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Confirm Booking <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
