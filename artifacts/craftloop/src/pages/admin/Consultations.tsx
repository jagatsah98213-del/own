import { useListAdminMeetingBookings, useListAdminMeetingSlots, useCreateAdminMeetingSlot, useUpdateAdminMeetingBooking, getListAdminMeetingSlotsQueryKey, getListAdminMeetingBookingsQueryKey } from "@workspace/api-client-react";
import { Loader2, CalendarPlus, Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const slotSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Time is required"),
  meetLink: z.string().optional(),
});

export default function Consultations() {
  const { data: bookings, isLoading: loadingBookings } = useListAdminMeetingBookings();
  const { data: slots, isLoading: loadingSlots } = useListAdminMeetingSlots();
  
  const createSlot = useCreateAdminMeetingSlot();
  const updateBooking = useUpdateAdminMeetingBooking();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [slotDialogOpen, setSlotDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof slotSchema>>({
    resolver: zodResolver(slotSchema),
    defaultValues: { date: "", startTime: "", meetLink: "" }
  });

  const handleCreateSlot = (values: z.infer<typeof slotSchema>) => {
    createSlot.mutate({ data: { ...values, purpose: "CLIENT_MEETING", capacity: 1 } }, {
      onSuccess: () => {
        setSlotDialogOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListAdminMeetingSlotsQueryKey() });
        toast({ title: "Slot created" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
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
        <Button onClick={() => setSlotDialogOpen(true)}><CalendarPlus className="w-4 h-4 mr-2" /> Add Time Slot</Button>
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
              <div className="space-y-3">
                {slots?.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center p-3 border border-border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{format(new Date(slot.date), "MMM d, yyyy")}</div>
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

      <Dialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Meeting Slot</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateSlot)} className="space-y-4 mt-4">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time (e.g. 10:00 AM)</FormLabel>
                  <FormControl><Input type="time" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="meetLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Link (Optional)</FormLabel>
                  <FormControl><Input placeholder="Google Meet / Zoom URL" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createSlot.isPending}>
                  {createSlot.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Slot"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}