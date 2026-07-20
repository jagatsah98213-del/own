import { useState } from "react";
import { useListAdminProjects, useUpdateAdminProject, getListAdminProjectsQueryKey } from "@workspace/api-client-react";
import { ProjectStatus } from "@workspace/api-client-react/api.schemas";
import { Loader2, ExternalLink, Link as LinkIcon, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Projects() {
  const { data: projects, isLoading } = useListAdminProjects();
  const updateProject = useUpdateAdminProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [resourceText, setResourceText] = useState("");

  const project = projects?.find(p => p.id === selectedProjectId);

  const openResourceDialog = (p: typeof project) => {
    if (!p) return;
    setSelectedProjectId(p.id);
    setResourceText(p.description ?? "");
    setResourceDialogOpen(true);
  };

  const handleSaveResources = () => {
    if (!selectedProjectId) return;
    updateProject.mutate({ id: selectedProjectId, data: { description: resourceText } }, {
      onSuccess: () => {
        setResourceDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() });
        toast({ title: "Project brief & resources updated" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  const handleUpdateStatus = (id: number, status: ProjectStatus) => {
    updateProject.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() })
    });
  };

  const specialtyLabel: Record<string, string> = {
    WEB_DEVELOPMENT: "Web Dev",
    VIDEO_EDITING: "Video",
    PHOTOGRAPHY_VIDEOGRAPHY: "Photography",
    GRAPHIC_DESIGN: "Design",
    CONTENT_WRITING: "Content",
    SEO_DIGITAL_MARKETING: "SEO",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Projects</h1>
        <p className="text-muted-foreground font-medium">Manage active client work and project briefs.</p>
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
                      {p.description && (
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-xs">{p.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">{specialtyLabel[p.serviceCategory] ?? p.serviceCategory.replace(/_/g, " ")}</Badge>
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
                    <TableCell className="text-right space-x-1">
                      {p.deliverableUrl && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(p.deliverableUrl!, "_blank")}>
                          <ExternalLink className="w-4 h-4 mr-1" /> Asset
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => openResourceDialog(p)}>
                        <LinkIcon className="w-4 h-4 mr-1" /> Brief
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {projects?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No projects found. Convert a client inquiry to create one.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Brief & Resources Dialog */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Project Brief & Resources</DialogTitle>
            <DialogDescription>
              Write the project brief and paste any file links (Google Drive, Dropbox, Figma, etc.) here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-muted/30 border border-border rounded-lg p-3">
              <div className="text-sm font-bold text-foreground mb-1">{project?.title}</div>
              <div className="text-xs text-muted-foreground">{project?.clientName} · {specialtyLabel[project?.serviceCategory ?? ""] ?? project?.serviceCategory}</div>
            </div>
            <div>
              <Label className="font-semibold mb-2 block">Brief, Instructions & Resource Links</Label>
              <Textarea
                value={resourceText}
                onChange={e => setResourceText(e.target.value)}
                placeholder={"Write project instructions here...\n\nPaste file/resource links below:\nhttps://drive.google.com/...\nhttps://figma.com/..."}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setResourceDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveResources} disabled={updateProject.isPending} className="font-bold">
                {updateProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Save Brief & Resources
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
