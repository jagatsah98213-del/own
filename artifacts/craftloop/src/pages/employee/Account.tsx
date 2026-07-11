import { useUpdateEmployeePassword } from "@workspace/api-client-react";
import { Loader2, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const pwdSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Account() {
  const updatePwd = useUpdateEmployeePassword();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof pwdSchema>>({
    resolver: zodResolver(pwdSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
  });

  const onSubmit = (values: z.infer<typeof pwdSchema>) => {
    updatePwd.mutate({ data: { currentPassword: values.currentPassword, newPassword: values.newPassword } }, {
      onSuccess: () => {
        form.reset();
        toast({ title: "Success", description: "Password updated successfully." });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your security credentials.</p>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-xl">
            <KeyRound className="w-5 h-5" /> Change Password
          </CardTitle>
          <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Current Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="pt-4 border-t border-border space-y-6">
                <FormField control={form.control} name="newPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">New Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Confirm New Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold mt-4" disabled={updatePwd.isPending}>
                {updatePwd.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}