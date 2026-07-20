import { useState } from "react";
import { useListAdminProjects, useCreateAdminProject, useUpdateAdminProject, getListAdminProjectsQueryKey } from "@workspace/api-client-react";
import { ProjectStatus, ServiceCategory } from "@workspace/api-client-react/api.schemas";
import { Loader2, ExternalLink, Link as LinkIcon, CheckCircle, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const createProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email required"),
  clientPhone: z.string().optional(),
  serviceCategory: z.nativeEnum(ServiceCategory),
  description: z.string().optional(),
});

const specialtyLabel: Record<string, string> = {
  WEB_DEVELOPMENT: "Web Dev",
  VIDEO_EDITING: "Video",
  PHOTOGRAPHY_VIDEOGRAPHY: "Photography",
  GRAPHIC_DESIGN: "Design",
  CONTENT_WRITING: "Content",
  SEO_DIGITAL_MARKETING: "SEO",
};

export default function Projects() {
  const { data: projects, isLoading } = useListAdminProjects();
  const createProject = useCreateAdminProject();
  const updateProject = useUpdateAdminProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [resourceText, setResourceText] = useState("");

  const project = projects?.find(p => p.id === selectedProjectId);

  const createForm = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { title: "", clientName: "", clientEmail: "", clientPhone: "", serviceCategory: undefined, description: "" },
  });

  const openResourceDialog = (p: typeof project) => {
    if (!p) return;
    setSelectedProjectId(p.id);
    setResourceText(p.description ?? "");
    setResourceDialogOpen(true);
  };

  const handleCreate = (values: z.infer<typeof createProjectSchema>) => {
    createProject.mutate({ data: values }, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        createForm.reset();
        queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() });
        toast({ title: "Project created successfully" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message }),
    });
  };

  const handleSaveResources = () => {
    if (!selectedProjectId) return;
    updateProject.mutate({ id: selectedProjectId, data: { description: resourceText } }, {
      onSuccess: () => {
        setResourceDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() });
        toast({ title: "Project brief & resources updated" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message }),
    });
  };

  const handleUpdateStatus = (id: number, status: ProjectStatus) => {
    updateProject.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminProjectsQueryKey() }),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Projects</h1>
          <p className="text-muted-foreground font-medium">Manage active client work and project briefs.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" /> New Project
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
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No projects yet. Create one with the button above or convert a client inquiry.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Project</DialogTitle>
            <DialogDescription>Create a custom project directly — no inquiry needed.</DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4 mt-2">
              <FormField control={createForm.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Website Redesign – Acme Corp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={createForm.control} name="clientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl><Input placeholder="John Smith" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={createForm.control} name="clientEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Email</FormLabel>
                    <FormControl><Input type="email" placeholder="john@company.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={createForm.control} name="clientPhone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl><Input placeholder="+1 555 000 0000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={createForm.control} name="serviceCategory" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                        <SelectItem value="VIDEO_EDITING">Video Editing</SelectItem>
                        <SelectItem value="PHOTOGRAPHY_VIDEOGRAPHY">Photography & Video</SelectItem>
                        <SelectItem value="GRAPHIC_DESIGN">Graphic Design</SelectItem>
                        <SelectItem value="CONTENT_WRITING">Content Writing</SelectItem>
                        <SelectItem value="SEO_DIGITAL_MARKETING">SEO & Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={createForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Brief <span className="font-normal text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the project scope, deliverables, and any key requirements..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setCreateDialogOpen(false); createForm.reset(); }}>Cancel</Button>
                <Button type="submit" disabled={createProject.isPending} className="font-bold">
                  {createProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Create Project
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Brief & Resources Dialog */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Project Brief & Resources</DialogTitle>
            <DialogDescription>Write the project brief and paste any file links here.</DialogDescription>
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
