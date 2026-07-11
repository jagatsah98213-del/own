import { useListAdminPayments, useCreateAdminPayment, useUpdateAdminPayment, useListAdminProjects, useListAdminEmployees, getListAdminPaymentsQueryKey } from "@workspace/api-client-react";
import { Loader2, DollarSign, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PayoutMethod } from "@workspace/api-client-react/api.schemas";

const paymentSchema = z.object({
  projectId: z.coerce.number().min(1, "Select a project"),
  employeeId: z.coerce.number().min(1, "Select an employee"),
  amount: z.coerce.number().min(1, "Amount must be positive"),
  method: z.nativeEnum(PayoutMethod, { required_error: "Select a method" }),
});

export default function Payments() {
  const { data: payments, isLoading } = useListAdminPayments();
  const { data: projects } = useListAdminProjects();
  const { data: employees } = useListAdminEmployees();
  
  const createPayment = useCreateAdminPayment();
  const updatePayment = useUpdateAdminPayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { projectId: 0, employeeId: 0, amount: 0, method: undefined }
  });

  const handleCreate = (values: z.infer<typeof paymentSchema>) => {
    createPayment.mutate({ data: values }, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListAdminPaymentsQueryKey() });
        toast({ title: "Payment created", description: "Payment has been recorded." });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  const handleMarkPaid = (id: number) => {
    updatePayment.mutate({ id, data: { status: "paid" } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminPaymentsQueryKey() });
        toast({ title: "Marked as paid" });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Freelancer Payouts</h1>
          <p className="text-muted-foreground font-medium">Manage and record payments to employees.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}><DollarSign className="w-4 h-4 mr-2" /> Record Payout</Button>
      </div>

      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Project</TableHead>
                  <TableHead className="font-bold">Employee</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Method</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((pay) => {
                  const emp = employees?.find(e => e.id === pay.employeeId);
                  return (
                  <TableRow key={pay.id}>
                    <TableCell className="font-medium text-muted-foreground">{format(new Date(pay.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-semibold">{pay.project?.title || `Project #${pay.projectId}`}</TableCell>
                    <TableCell>{emp ? emp.fullName : `Employee #${pay.employeeId}`}</TableCell>
                    <TableCell className="font-bold text-lg">${pay.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{pay.method.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell>
                      <Badge className={pay.status === 'paid' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}>
                        {pay.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pay.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkPaid(pay.id)} disabled={updatePayment.isPending}>
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )})}
                {payments?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No payments recorded.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Record Payout</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 mt-4">
              <FormField control={form.control} name="projectId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value ? field.value.toString() : ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {projects?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="employeeId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value ? field.value.toString() : ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {employees?.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="method" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="PHONEPE">PhonePe</SelectItem>
                        <SelectItem value="PAYPAL">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createPayment.isPending}>
                  {createPayment.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Create Record
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}