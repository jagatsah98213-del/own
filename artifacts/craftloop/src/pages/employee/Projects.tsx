import { useListEmployeeAssignments, useUpdateEmployeeAssignment, getListEmployeeAssignmentsQueryKey } from "@workspace/api-client-react";
import { EmployeeAssignmentStatus } from "@workspace/api-client-react/api.schemas";
import { Loader2, ExternalLink, CheckCircle, Link as LinkIcon, FileText, FolderOpen } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const submitSchema = z.object({
  deliverableUrl: z.string().url("Must be a valid URL"),
});

/** Extract all URLs from a text string */
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return Array.from(new Set(text.match(urlRegex) ?? []));
}

/** Render text with URLs turned into clickable links */
function TextWithLinks({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 break-all hover:text-primary/80 transition-colors"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function Projects() {
  const { data: assignments, isLoading } = useListEmployeeAssignments();
  const updateAssignment = useUpdateEmployeeAssignment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [briefDialogOpen, setBriefDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof submitSchema>>({
    resolver: zodResolver(submitSchema),
    defaultValues: { deliverableUrl: "" }
  });

  const selectedAssignment = assignments?.find(a => a.id === selectedId);
  const resourceUrls = selectedAssignment?.project.description
    ? extractUrls(selectedAssignment.project.description)
    : [];

  const handleStatusChange = (id: number, status: EmployeeAssignmentStatus) => {
    updateAssignment.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEmployeeAssignmentsQueryKey() });
        toast({ title: "Status updated" });
      }
    });
  };

  const handleOpenSubmit = (id: number) => {
    setSelectedId(id);
    form.reset({ deliverableUrl: "" });
    setSubmitDialogOpen(true);
  };

  const handleOpenBrief = (id: number) => {
    setSelectedId(id);
    setBriefDialogOpen(true);
  };

  const handleSubmitDeliverable = (values: z.infer<typeof submitSchema>) => {
    if (!selectedId) return;
    updateAssignment.mutate({ id: selectedId, data: { status: "submitted", deliverableUrl: values.deliverableUrl } }, {
      onSuccess: () => {
        setSubmitDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListEmployeeAssignmentsQueryKey() });
        toast({ title: "Deliverable submitted successfully!" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Projects</h1>
        <p className="text-muted-foreground font-medium">Manage your assigned work, view project files, and submit deliverables.</p>
      </div>

      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Project</TableHead>
                  <TableHead className="font-bold">Deadline</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments?.map((a) => {
                  const hasResources = a.project.description && extractUrls(a.project.description).length > 0;
                  return (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="font-bold text-base mb-1">{a.project.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1 max-w-sm">
                          {a.project.description?.split('\n')[0] || "No description provided."}
                        </div>
                        {hasResources && (
                          <button
                            onClick={() => handleOpenBrief(a.id)}
                            className="text-xs text-primary font-semibold mt-1 flex items-center gap-1 hover:underline"
                          >
                            <FolderOpen className="w-3 h-3" /> View project files & brief
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">
                        {a.project.deadline ? format(new Date(a.project.deadline), "MMM d, yyyy") : "No deadline"}
                      </TableCell>
                      <TableCell>
                        {a.status === 'approved' ? (
                          <Badge className="bg-green-500">Approved</Badge>
                        ) : a.status === 'submitted' ? (
                          <Badge className="bg-blue-500">Under Review</Badge>
                        ) : (
                          <Select value={a.status} onValueChange={(v) => handleStatusChange(a.id, v as EmployeeAssignmentStatus)}>
                            <SelectTrigger className="w-[140px] h-8 text-xs font-bold bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="assigned">Assigned</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {a.project.description && (
                          <Button variant="ghost" size="sm" onClick={() => handleOpenBrief(a.id)}>
                            <FileText className="w-4 h-4 mr-1" /> Brief
                          </Button>
                        )}
                        {['assigned', 'in_progress'].includes(a.status) && (
                          <Button size="sm" onClick={() => handleOpenSubmit(a.id)}>
                            <LinkIcon className="w-4 h-4 mr-1" /> Submit
                          </Button>
                        )}
                        {a.status === 'submitted' && (
                          <span className="text-sm text-muted-foreground italic pr-4">Awaiting Review</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {assignments?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No projects assigned yet. Check back soon!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Brief & Files Dialog */}
      <Dialog open={briefDialogOpen} onOpenChange={setBriefDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Project Brief
            </DialogTitle>
            <DialogDescription className="font-semibold text-foreground">{selectedAssignment?.project.title}</DialogDescription>
          </DialogHeader>

          {selectedAssignment?.project.description ? (
            <div className="space-y-4 mt-2">
              {/* Full description with clickable links */}
              <div className="bg-muted/30 rounded-xl border border-border p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  <TextWithLinks text={selectedAssignment.project.description} />
                </p>
              </div>

              {/* Extracted resource links as buttons */}
              {resourceUrls.length > 0 && (
                <div>
                  <div className="text-sm font-bold mb-3 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary" /> Resource Files
                  </div>
                  <div className="space-y-2">
                    {resourceUrls.map((url, i) => {
                      const hostname = (() => { try { return new URL(url).hostname.replace("www.", ""); } catch { return url; } })();
                      return (
                        <button
                          key={i}
                          onClick={() => window.open(url, "_blank")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left group"
                        >
                          <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold group-hover:text-primary transition-colors">{hostname}</div>
                            <div className="text-xs text-muted-foreground truncate">{url}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedAssignment.project.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-3">
                  <span className="font-semibold">Deadline:</span>
                  {format(new Date(selectedAssignment.project.deadline), "MMMM d, yyyy")}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mt-4">No brief has been provided yet. Check back later or contact your manager.</p>
          )}

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setBriefDialogOpen(false)}>Close</Button>
            {['assigned', 'in_progress'].includes(selectedAssignment?.status ?? '') && (
              <Button onClick={() => { setBriefDialogOpen(false); handleOpenSubmit(selectedId!); }}>
                <LinkIcon className="w-4 h-4 mr-2" /> Submit Work
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Deliverable Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Submit Deliverable</DialogTitle>
            <DialogDescription>Provide a link to your completed work (Google Drive, Figma, GitHub, Dropbox, etc.)</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitDeliverable)} className="space-y-4 mt-4">
              <FormField control={form.control} name="deliverableUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Deliverable URL</FormLabel>
                  <FormControl><Input placeholder="https://drive.google.com/..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateAssignment.isPending}>
                  {updateAssignment.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Submit to Admin
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
