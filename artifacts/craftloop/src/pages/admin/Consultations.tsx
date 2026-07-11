import { useListAdminMeetingBookings, useListAdminMeetingSlots, useCreateAdminMeetingSlot, useUpdateAdminMeetingBooking, getListAdminMeetingSlotsQueryKey, getListAdminMeetingBookingsQueryKey } from "@workspace/api-client-react";
import { Loader2, CalendarPlus, Check, X, Clock, CalendarRange, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, addWeeks, startOfWeek, addDays } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";

// ── Single slot schema ────────────────────────────────────────────────────────
const slotSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Time is required"),
  meetLink: z.string().optional(),
});

// ── Weekly schedule schema ────────────────────────────────────────────────────
const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
] as const;

const weeklySchema = z.object({
  days: z.array(z.number()).min(1, "Select at least one day"),
  times: z.array(z.string().min(1)).min(1, "Add at least one time"),
  meetLink: z.string().optional(),
  weeks: z.coerce.number().min(1).max(12),
});

// ── Generate date strings for a weekly schedule ───────────────────────────────
function generateWeeklyDates(days: number[], weeks: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  // Start from the Monday of the current week
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  for (let w = 0; w < weeks; w++) {
    for (const day of days) {
      // day: 1=Mon…6=Sat, 0=Sun. addDays from Monday-start
      const offset = day === 0 ? 6 : day - 1; // Mon=0 offset, Sun=6 offset
      const d = addDays(addWeeks(weekStart, w), offset);
      // Only include future dates (skip past days in the first week)
      if (d >= today || d.toDateString() === today.toDateString()) {
        dates.push(d.toISOString().slice(0, 10));
      }
    }
  }
  return dates;
}

export default function Consultations() {
  const { data: bookings, isLoading: loadingBookings } = useListAdminMeetingBookings();
  const { data: slots, isLoading: loadingSlots } = useListAdminMeetingSlots();
  
  const createSlot = useCreateAdminMeetingSlot();
  const updateBooking = useUpdateAdminMeetingBooking();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [singleDialogOpen, setSingleDialogOpen] = useState(false);
  const [weeklyDialogOpen, setWeeklyDialogOpen] = useState(false);
  const [weeklyTimes, setWeeklyTimes] = useState<string[]>(["10:00"]);
  const [isCreatingWeekly, setIsCreatingWeekly] = useState(false);

  // ── Single slot form ──────────────────────────────────────────────────────
  const singleForm = useForm<z.infer<typeof slotSchema>>({
    resolver: zodResolver(slotSchema),
    defaultValues: { date: "", startTime: "", meetLink: "" }
  });

  // ── Weekly schedule form ──────────────────────────────────────────────────
  const weeklyForm = useForm<z.infer<typeof weeklySchema>>({
    resolver: zodResolver(weeklySchema),
    defaultValues: { days: [1, 2, 3, 4, 5], times: ["10:00"], meetLink: "", weeks: 4 }
  });

  const handleCreateSingleSlot = (values: z.infer<typeof slotSchema>) => {
    createSlot.mutate({ data: { ...values, purpose: "CLIENT_MEETING", capacity: 1 } }, {
      onSuccess: () => {
        setSingleDialogOpen(false);
        singleForm.reset();
        queryClient.invalidateQueries({ queryKey: getListAdminMeetingSlotsQueryKey() });
        toast({ title: "Slot created" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  const handleCreateWeeklySchedule = async (values: z.infer<typeof weeklySchema>) => {
    const dates = generateWeeklyDates(values.days, values.weeks);
    const allSlots: { date: string; startTime: string; meetLink?: string }[] = [];
    for (const date of dates) {
      for (const time of values.times) {
        allSlots.push({ date, startTime: time, meetLink: values.meetLink || undefined });
      }
    }

    if (allSlots.length === 0) {
      toast({ variant: "destructive", title: "No future slots generated", description: "All selected days are in the past for this week." });
      return;
    }

    setIsCreatingWeekly(true);
    try {
      for (const slot of allSlots) {
        await createSlot.mutateAsync({ data: { ...slot, purpose: "CLIENT_MEETING", capacity: 1 } });
      }
      setWeeklyDialogOpen(false);
      weeklyForm.reset({ days: [1, 2, 3, 4, 5], times: ["10:00"], meetLink: "", weeks: 4 });
      setWeeklyTimes(["10:00"]);
      queryClient.invalidateQueries({ queryKey: getListAdminMeetingSlotsQueryKey() });
      toast({ title: `${allSlots.length} slots created`, description: `Weekly schedule set for ${values.weeks} week(s).` });
    } catch {
      toast({ variant: "destructive", title: "Some slots failed to create" });
    } finally {
      setIsCreatingWeekly(false);
    }
  };

  const handleUpdateBookingStatus = (id: number, status: "confirmed" | "cancelled") => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminMeetingBookingsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListAdminMeetingSlotsQueryKey() });
        toast({ title: `Booking ${status}` });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Consultations</h1>
          <p className="text-muted-foreground font-medium">Manage open slots and client meeting bookings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setWeeklyDialogOpen(true)}>
            <CalendarRange className="w-4 h-4 mr-2" /> Weekly Schedule
          </Button>
          <Button onClick={() => setSingleDialogOpen(true)}>
            <CalendarPlus className="w-4 h-4 mr-2" /> Add Slot
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Client Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBookings ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Client</TableHead>
                      <TableHead className="font-bold">Date & Time</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>
                          <div className="font-semibold">{b.clientName}</div>
                          <div className="text-sm text-muted-foreground">{b.clientEmail}</div>
                        </TableCell>
                        <TableCell>
                          {b.slot && (
                            <>
                              <div className="font-medium">{format(new Date(b.slot.date), "MMM d, yyyy")}</div>
                              <div className="text-sm text-muted-foreground">{b.slot.startTime}</div>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={b.status === "confirmed" ? "default" : b.status === "cancelled" ? "secondary" : "outline"}
                                 className={b.status === "confirmed" ? "bg-green-500 hover:bg-green-600" : ""}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {b.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateBookingStatus(b.id, "confirmed")}>
                                <Check className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleUpdateBookingStatus(b.id, "cancelled")}>
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {bookings?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No bookings found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSlots ? (
              <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {slots?.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center p-3 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{format(new Date(slot.date), "EEE, MMM d")}</div>
                        <div className="text-xs text-muted-foreground font-medium">{slot.startTime}</div>
                      </div>
                    </div>
                    {slot.booked > 0 ? (
                      <Badge variant="secondary" className="text-xs">Booked</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-600 bg-green-500/10">Open</Badge>
                    )}
                  </div>
                ))}
                {slots?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">No slots created.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* ── Single slot dialog ──────────────────────────────────────────────── */}
      <Dialog open={singleDialogOpen} onOpenChange={setSingleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Meeting Slot</DialogTitle>
            <DialogDescription>Create a one-off availability slot.</DialogDescription>
          </DialogHeader>
          <Form {...singleForm}>
            <form onSubmit={singleForm.handleSubmit(handleCreateSingleSlot)} className="space-y-4 mt-2">
              <FormField control={singleForm.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={singleForm.control} name="startTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={singleForm.control} name="meetLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link (Optional)</FormLabel>
                  <FormControl><Input placeholder="Google Meet / Zoom URL" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={createSlot.isPending}>
                  {createSlot.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Slot
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── Weekly schedule dialog ──────────────────────────────────────────── */}
      <Dialog open={weeklyDialogOpen} onOpenChange={setWeeklyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Set Weekly Schedule</DialogTitle>
            <DialogDescription>
              Choose which days and times to be available each week. Slots will be auto-generated and repeat for the number of weeks you specify.
            </DialogDescription>
          </DialogHeader>
          <Form {...weeklyForm}>
            <form onSubmit={weeklyForm.handleSubmit(handleCreateWeeklySchedule)} className="space-y-5 mt-2">
              
              {/* Days of week */}
              <FormField control={weeklyForm.control} name="days" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Days of the Week</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DAYS.map((day) => {
                      const checked = field.value.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => {
                            const next = checked
                              ? field.value.filter((d) => d !== day.value)
                              : [...field.value, day.value];
                            field.onChange(next);
                          }}
                          className={`w-12 h-12 rounded-xl text-sm font-bold border transition-all ${
                            checked
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Time slots */}
              <FormField control={weeklyForm.control} name="times" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Time Slots</FormLabel>
                  <div className="space-y-2 mt-2">
                    {field.value.map((time, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const next = [...field.value];
                            next[idx] = e.target.value;
                            field.onChange(next);
                          }}
                          className="flex-1"
                        />
                        {field.value.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => field.onChange(field.value.filter((_, i) => i !== idx))}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange([...field.value, "14:00"])}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Time
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Meet link */}
              <FormField control={weeklyForm.control} name="meetLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link (Optional)</FormLabel>
                  <FormControl><Input placeholder="Google Meet / Zoom URL applied to all slots" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Number of weeks */}
              <FormField control={weeklyForm.control} name="weeks" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Repeat for how many weeks?</FormLabel>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {[1, 2, 4, 8, 12].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => field.onChange(w)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                          Number(field.value) === w
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {w}w
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isCreatingWeekly}>
                  {isCreatingWeekly ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating slots…</> : "Generate Schedule"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
