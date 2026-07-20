import { useState } from "react";
import { useListAdminApplicants, useRejectApplicant, getListAdminApplicantsQueryKey, useListAdminInterviewSlots, useCreateAdminInterviewSlot } from "@workspace/api-client-react";
import { ServiceCategory } from "@workspace/api-client-react/api.schemas";
import { Loader2, Eye, XCircle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Applicants() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const { data: applicants, isLoading } = useListAdminApplicants({
    status: statusFilter !== "all" ? statusFilter : undefined,
    serviceCategory: serviceFilter !== "all" ? serviceFilter as ServiceCategory : undefined,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const rejectApp = useRejectApplicant();

  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const applicant = applicants?.find(a => a.id === selectedApplicant);

  const handleReject = (id: number) => {
    rejectApp.mutate({ id }, {
      onSuccess: () => {
        setViewDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListAdminApplicantsQueryKey() });
        toast({ title: "Applicant Rejected" });
      },
      onError: (err) => toast({ variant: "destructive", title: "Error", description: (err.data as any)?.message || err.message })
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Applicants & Interviews</h1>
          <p className="text-muted-foreground font-medium">Review talent applications and manage interviews.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-10">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-full sm:w-[250px] h-10">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
            <SelectItem value="VIDEO_EDITING">Video Editing</SelectItem>
            <SelectItem value="PHOTOGRAPHY_VIDEOGRAPHY">Photography & Videography</SelectItem>
            <SelectItem value="GRAPHIC_DESIGN">Graphic Design</SelectItem>
            <SelectItem value="CONTENT_WRITING">Content Writing</SelectItem>
            <SelectItem value="SEO_DIGITAL_MARKETING">SEO & Digital Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Applicant</TableHead>
                  <TableHead className="font-bold">Specialty</TableHead>
                  <TableHead className="font-bold">Experience</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Applied</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants?.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-semibold">{app.fullName}</div>
                      <div className="text-sm text-muted-foreground">{app.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">{app.serviceCategory.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{app.yearsExperience} yrs</TableCell>
                    <TableCell>
                      <Badge className={
                        app.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' :
                        app.status === 'interview_scheduled' ? 'bg-blue-500 hover:bg-blue-600' :
                        'bg-yellow-500 hover:bg-yellow-600'
                      }>
                        {app.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(app.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedApplicant(app.id); setViewDialogOpen(true); }}>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {applicants?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No applicants found matching filters.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Applicant Details</DialogTitle>
          </DialogHeader>
          {applicant && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Name</div>
                  <div className="font-semibold">{applicant.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Contact</div>
                  <div className="font-semibold">{applicant.email}<br />{applicant.phone}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Specialty</div>
                  <Badge variant="outline">{applicant.serviceCategory.replace(/_/g, " ")}</Badge>
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Experience</div>
                  <div className="font-semibold">{applicant.yearsExperience} years</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Expected Rate</div>
                  <div className="font-semibold">{applicant.expectedRate || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Availability</div>
                  <div className="font-semibold">{applicant.availability || "N/A"}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-muted-foreground mb-2">Portfolio Links</div>
                {applicant.portfolioLinks?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {applicant.portfolioLinks.map((link, i) => (
                      <Button key={i} variant="outline" size="sm" className="h-8" onClick={() => window.open(link, "_blank")}>
                        <ExternalLink className="w-3 h-3 mr-2" /> Link {i + 1}
                      </Button>
                    ))}
                  </div>
                ) : <span className="text-sm text-muted-foreground">None provided</span>}
              </div>

              {applicant.resumeUrl && (
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-2">Resume</div>
                  <Button variant="outline" size="sm" onClick={() => window.open(applicant.resumeUrl!, "_blank")}>
                    <ExternalLink className="w-3 h-3 mr-2" /> View Resume
                  </Button>
                </div>
              )}

              {applicant.equipmentOwned && (
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-2">Equipment</div>
                  <div className="text-sm bg-muted/20 p-3 rounded-lg border border-border">{applicant.equipmentOwned}</div>
                </div>
              )}

              {applicant.coverNote && (
                <div>
                  <div className="text-sm font-bold text-muted-foreground mb-2">Cover Note</div>
                  <div className="text-sm bg-muted/20 p-3 rounded-lg border border-border whitespace-pre-wrap">{applicant.coverNote}</div>
                </div>
              )}

              {['applied', 'interview_scheduled', 'interviewed'].includes(applicant.status) && (
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="destructive" onClick={() => handleReject(applicant.id)} disabled={rejectApp.isPending}>
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
