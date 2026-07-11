import { useListAdminProjects, useListAdminEmployees, useCreateAdminProjectAssignment, useUpdateAdminProject, getListAdminProjectsQueryKey } from "@workspace/api-client-react";
import { ProjectStatus } from "@workspace/api-client-react/api.schemas";
import { Loader2, Users, FileEdit, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function Projects() {
  const { data: projects, isLoading } = useListAdminProjects();
  const { data: employees } = useListAdminEmployees();
  const assignEmp = useCreateAdminProjectAssignment();
  const updateProject = useUpdateAdminProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const project = projects?.find(p => p.id === selectedProjectId);
  const eligibleEmployees = employees?.filter(e => e.isActive && e.serviceCategory === project?.serviceCategory);

  const handleAssign = () => {
    if (!selectedProjectId || !selectedEmployeeId) return;
    assignEmp.mutate({ id: selectedProjectId, data: { employeeId: parseInt(selectedEmployeeId) } }, {
      onSuccess: () => {
        setAssignDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() });
        toast({ title: "Employee assigned" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  const handleUpdateStatus = (id: number, status: ProjectStatus) => {
    updateProject.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() })
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Projects</h1>
        <p className="text-muted-foreground font-medium">Manage active work and assign freelancers.</p>
      </div>

      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Project / Client</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Client Payment</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-bold text-base mb-1">{p.title}</div>
                      <div className="text-sm text-muted-foreground font-medium">{p.clientName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">{p.serviceCategory.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={p.status} onValueChange={(v) => handleUpdateStatus(p.id, v as ProjectStatus)}>
                        <SelectTrigger className={`w-[140px] h-8 text-xs font-bold ${
                          p.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/30' :
                          p.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/30' :
                          'bg-muted border-border'
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {p.clientPaymentReceived ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Paid (${p.clientPaymentAmount})</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {p.deliverableUrl && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(p.deliverableUrl!, "_blank")}>
                          <ExternalLink className="w-4 h-4 mr-2" /> Asset
                        </Button>
                      )}
                      <Button variant="secondary" size="sm" onClick={() => { setSelectedProjectId(p.id); setAssignDialogOpen(true); }}>
                        <Users className="w-4 h-4 mr-2" /> Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {projects?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No projects found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Assign Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-muted p-4 rounded-xl border border-border">
              <div className="text-sm font-bold text-muted-foreground mb-1">Project</div>
              <div className="font-semibold">{project?.title}</div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Select eligible employee</label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an employee..." />
                </SelectTrigger>
                <SelectContent>
                  {eligibleEmployees?.map(e => (
                    <SelectItem key={e.id} value={e.id.toString()}>{e.fullName} ({e.email})</SelectItem>
                  ))}
                  {eligibleEmployees?.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">No active employees found for this category.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleAssign} disabled={!selectedEmployeeId || assignEmp.isPending}>
                {assignEmp.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Confirm Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}