import { useListAdminEmployees, useUpdateAdminEmployee, getListAdminEmployeesQueryKey } from "@workspace/api-client-react";
import { Loader2, UserCheck, UserX, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { data: employees, isLoading } = useListAdminEmployees();
  const updateEmp = useUpdateAdminEmployee();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    updateEmp.mutate({ id, data: { isActive: !currentStatus } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAdminEmployeesQueryKey() });
        toast({ title: "Status updated" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Employees</h1>
        <p className="text-muted-foreground font-medium">Manage your roster of vetted freelancers.</p>
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
                      <Badge variant="outline" className="font-semibold">{emp.serviceCategory.replace(/_/g, " ")}</Badge>
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
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No employees found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}