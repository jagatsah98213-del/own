import { useGetEmployeePayoutSettings, useUpdateEmployeePayoutSettings, getGetEmployeePayoutSettingsQueryKey } from "@workspace/api-client-react";
import { PayoutMethod } from "@workspace/api-client-react/api.schemas";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef } from "react";

const payoutSchema = z.object({
  payoutMethod: z.nativeEnum(PayoutMethod, { required_error: "Please select a method" }),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  paypalEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  phonePeNumber: z.string().optional(),
});

export default function PayoutSettings() {
  const { data: settings, isLoading } = useGetEmployeePayoutSettings();
  const updateSettings = useUpdateEmployeePayoutSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      payoutMethod: undefined,
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      paypalEmail: "",
      phonePeNumber: "",
    }
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (settings && !initialized.current) {
      const details = (settings.payoutDetails as any) || {};
      form.reset({
        payoutMethod: settings.payoutMethod || undefined,
        accountName: details.accountName || "",
        accountNumber: details.accountNumber || "",
        routingNumber: details.routingNumber || "",
        paypalEmail: details.paypalEmail || "",
        phonePeNumber: details.phonePeNumber || "",
      });
      initialized.current = true;
    }
  }, [settings, form]);

  const method = form.watch("payoutMethod");

  const onSubmit = (values: z.infer<typeof payoutSchema>): void => {
    let details = {};
    if (values.payoutMethod === "BANK_TRANSFER") {
      if (!values.accountName || !values.accountNumber) { toast({ variant: "destructive", title: "Validation", description: "Name and account number are required for bank transfer" }); return; }
      details = { accountName: values.accountName, accountNumber: values.accountNumber, routingNumber: values.routingNumber };
    } else if (values.payoutMethod === "PAYPAL") {
      if (!values.paypalEmail) { toast({ variant: "destructive", title: "Validation", description: "PayPal email is required" }); return; }
      details = { paypalEmail: values.paypalEmail };
    } else if (values.payoutMethod === "PHONEPE") {
      if (!values.phonePeNumber) { toast({ variant: "destructive", title: "Validation", description: "PhonePe number is required" }); return; }
      details = { phonePeNumber: values.phonePeNumber };
    }

    updateSettings.mutate({ data: { payoutMethod: values.payoutMethod, payoutDetails: details } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEmployeePayoutSettingsQueryKey() });
        toast({ title: "Settings saved", description: "Your payout details have been securely updated." });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payout Settings</h1>
        <p className="text-muted-foreground font-medium">Configure where you want to receive payments for completed projects.</p>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="w-5 h-5 text-green-600" /> Secure Payment Information
          </CardTitle>
          <CardDescription>This information is encrypted and only visible to authorized administrators for processing payouts.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="payoutMethod" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Select Payout Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl text-base">
                        <SelectValue placeholder="Choose a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BANK_TRANSFER">Direct Bank Transfer</SelectItem>
                      <SelectItem value="PHONEPE">PhonePe</SelectItem>
                      <SelectItem value="PAYPAL">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {method === "BANK_TRANSFER" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <FormField control={form.control} name="accountName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Account Holder Name *</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl bg-muted/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="accountNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Account Number *</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl bg-muted/50" type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="routingNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Routing/Sort Code</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl bg-muted/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              )}

              {method === "PAYPAL" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <FormField control={form.control} name="paypalEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">PayPal Email Address *</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl bg-muted/50" type="email" placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              {method === "PHONEPE" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <FormField control={form.control} name="phonePeNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">PhonePe Mobile Number / UPI ID *</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl bg-muted/50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg" disabled={updateSettings.isPending || !method}>
                {updateSettings.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Save Securely
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}