import { useState } from "react";
import { useListAdminEmployees, useUpdateAdminEmployee, useCreateAdminEmployee, getListAdminEmployeesQueryKey } from "@workspace/api-client-react";
import { Loader2, UserCheck, UserX, Plus, Copy, Check, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";

const createEmployeeSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  serviceCategory: z.enum([
    "WEB_DEVELOPMENT", "VIDEO_EDITING", "PHOTOGRAPHY_VIDEOGRAPHY",
    "GRAPHIC_DESIGN", "CONTENT_WRITING", "SEO_DIGITAL_MARKETING"
  ]),
});

type CreateEmployeeForm = z.infer<typeof createEmployeeSchema>;

export default function Employees() {
  const { data: employees, isLoading } = useListAdminEmployees();
  const updateEmp = useUpdateAdminEmployee();
  const createEmp = useCreateAdminEmployee();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  const form = useForm<CreateEmployeeForm>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", serviceCategory: "WEB_DEVELOPMENT" },
  });

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    updateEmp.mutate({ id, data: { isActive: !currentStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminEmployeesQueryKey() });
        toast({ title: "Status updated" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  const handleCreate = (values: CreateEmployeeForm) => {
    createEmp.mutate({ data: values }, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: getListAdminEmployeesQueryKey() });
        setCreatedCredentials({ email: values.email, password: res.temporaryPassword || values.password });
        setCreateDialogOpen(false);
        setCredentialsDialogOpen(true);
        form.reset();
        toast({ title: "Employee account created successfully" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  const handleCopy = (field: "email" | "password", value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const specialtyLabel: Record<string, string> = {
    WEB_DEVELOPMENT: "Web Development",
    VIDEO_EDITING: "Video Editing",
    PHOTOGRAPHY_VIDEOGRAPHY: "Photography & Videography",
    GRAPHIC_DESIGN: "Graphic Design",
    CONTENT_WRITING: "Content Writing",
    SEO_DIGITAL_MARKETING: "SEO & Digital Marketing",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Employees</h1>
          <p className="text-muted-foreground font-medium">Manage your roster of vetted freelancers.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Employee</TableHead>
                  <TableHead className="font-bold">Specialty</TableHead>
                  <TableHead className="font-bold">Payout Method</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Joined</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees?.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="font-semibold">{emp.fullName}</div>
                      <div className="text-sm text-muted-foreground">{emp.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">{specialtyLabel[emp.serviceCategory] ?? emp.serviceCategory.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {emp.payoutMethod ? emp.payoutMethod.replace(/_/g, " ") : <span className="text-muted-foreground italic">Not set</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={emp.isActive ? "default" : "secondary"} className={emp.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                        {emp.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(emp.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(emp.id, emp.isActive)} disabled={updateEmp.isPending}>
                        {emp.isActive ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                        {emp.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {employees?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No employees found. Add one above or hire an applicant from the Applicants page.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create Employee Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Employee</DialogTitle>
            <DialogDescription>Create a portal account. Share the credentials securely with the employee so they can log in.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 mt-2">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Full Name</FormLabel>
                  <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email (Login ID)</FormLabel>
                  <FormControl><Input type="email" placeholder="jane@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Phone <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="+1 555 000 0000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="serviceCategory" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Specialty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {Object.entries(specialtyLabel).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Min 8 characters" className="pr-10" {...field} />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(s => !s)}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createEmp.isPending} className="font-bold">
                  {createEmp.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Account
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Credentials Reveal Dialog */}
      <Dialog open={credentialsDialogOpen} onOpenChange={setCredentialsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <UserCheck className="w-6 h-6" /> Account Created!
            </DialogTitle>
            <DialogDescription className="text-base pt-1">
              Share these credentials with the employee. They use them to log in at <strong>/employee/login</strong>.
              <br /><span className="text-red-500 font-semibold">Save this password — it won't be shown again.</span>
            </DialogDescription>
          </DialogHeader>
          {createdCredentials && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg border border-border px-4 py-3">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Email (Login ID)</div>
                  <div className="font-mono font-semibold">{createdCredentials.email}</div>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleCopy("email", createdCredentials.email)}>
                  {copiedField === "email" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-lg border border-border px-4 py-3">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Password</div>
                  <div className="font-mono font-bold text-lg tracking-widest">{createdCredentials.password}</div>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleCopy("password", createdCredentials.password)}>
                  {copiedField === "password" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">The employee can change their password from their account settings after logging in.</p>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setCredentialsDialogOpen(false)} className="font-bold">Done — I've saved the credentials</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
