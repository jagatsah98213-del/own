import { useListEmployeeAssignments, useGetEmployeePayoutSettings, useListEmployeePayments } from "@workspace/api-client-react";
import { Loader2, FolderKanban, Banknote, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: assignments, isLoading: loadingAssignments } = useListEmployeeAssignments();
  const { data: payout } = useGetEmployeePayoutSettings();
  const { data: payments } = useListEmployeePayments();

  const activeProjects = assignments?.filter(a => ['assigned', 'in_progress'].includes(a.status)) || [];
  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];

  if (loadingAssignments) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted-foreground font-medium">Here's your current workload and payment status.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-primary">Active Projects</CardTitle>
            <FolderKanban className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{activeProjects.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">Pending Payments</CardTitle>
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingPayments.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-muted-foreground">Payout Method</CardTitle>
            <History className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mt-1">
              {payout?.payoutMethod ? payout.payoutMethod.replace(/_/g, " ") : "Not Configured"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments?.slice(0, 5).map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="font-bold">{a.project.title}</div>
                    <div className="text-sm text-muted-foreground">Assigned: {format(new Date(a.assignedAt), "MMM d, yyyy")}</div>
                  </div>
                  <Badge className={
                    a.status === 'approved' ? 'bg-green-500' :
                    a.status === 'submitted' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }>{a.status.replace(/_/g, " ")}</Badge>
                </div>
              ))}
              {assignments?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No projects assigned yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments?.slice(0, 5).map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="font-bold text-lg">${p.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{p.project?.title || `Project #${p.projectId}`}</div>
                  </div>
                  <Badge variant={p.status === 'paid' ? "default" : "secondary"} className={p.status === 'paid' ? 'bg-green-500' : ''}>
                    {p.status}
                  </Badge>
                </div>
              ))}
              {payments?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No payments recorded.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}