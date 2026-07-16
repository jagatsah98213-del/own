import { useListAdminServices, useListAdminTestimonials, useUpdateAdminTestimonial, getListAdminTestimonialsQueryKey, useListAdminPortfolioItems, useCreateAdminPortfolioItem, getListAdminPortfolioItemsQueryKey } from "@workspace/api-client-react";
import { Loader2, ExternalLink, Plus, Check, X, Pencil, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { PortfolioItemInputMediaType, ServiceCategory } from "@workspace/api-client-react/api.schemas";

// ─── Portfolio schema ──────────────────────────────────────────────────────────
const portSchema = z.object({
  title: z.string().min(2, "Title is required"),
  serviceCategory: z.nativeEnum(ServiceCategory),
  mediaType: z.nativeEnum(PortfolioItemInputMediaType),
  mediaUrl: z.string().url(),
});

// ─── FAQ types & hooks ─────────────────────────────────────────────────────────
interface Faq { id: number; question: string; answer: string; sortOrder: number; isPublished: boolean }

const faqSchema = z.object({
  question: z.string().min(5, "Question is required"),
  answer: z.string().min(10, "Answer is required"),
});

function useFaqs() {
  return useQuery<Faq[]>({
    queryKey: ["admin-faqs"],
    queryFn: () => fetch("/api/admin/faqs", { credentials: "include" }).then(r => r.json()),
  });
}

function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { question: string; answer: string }) =>
      fetch("/api/admin/faqs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });
}

function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Faq> }) =>
      fetch(`/api/admin/faqs/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });
}

function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/admin/faqs/${id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });
}

export default function SiteContent() {
  const { data: services, isLoading: loadingServices } = useListAdminServices();
  const { data: testimonials, isLoading: loadingTestimonials } = useListAdminTestimonials();
  const { data: portfolio, isLoading: loadingPortfolio } = useListAdminPortfolioItems();
  const { data: faqs, isLoading: loadingFaqs } = useFaqs();

  const updateTestimonial = useUpdateAdminTestimonial();
  const createPortfolio = useCreateAdminPortfolioItem();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Portfolio dialog
  const [portDialogOpen, setPortDialogOpen] = useState(false);
  const portForm = useForm<z.infer<typeof portSchema>>({
    resolver: zodResolver(portSchema),
    defaultValues: { title: "", mediaUrl: "", mediaType: "image", serviceCategory: undefined }
  });

  // FAQ dialogs
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [deletingFaqId, setDeletingFaqId] = useState<number | null>(null);

  const faqForm = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema),
    defaultValues: { question: "", answer: "" },
  });

  const handleTestimonialToggle = (id: number, current: boolean) => {
    updateTestimonial.mutate({ id, data: { isPublished: !current } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminTestimonialsQueryKey() })
    });
  };

  const handleCreatePortfolio = (values: z.infer<typeof portSchema>) => {
    createPortfolio.mutate({ data: { ...values, isFeatured: false, sortOrder: 0 } }, {
      onSuccess: () => {
        setPortDialogOpen(false);
        portForm.reset();
        queryClient.invalidateQueries({ queryKey: getListAdminPortfolioItemsQueryKey() });
        toast({ title: "Portfolio item added" });
      }
    });
  };

  const openNewFaq = () => {
    setEditingFaq(null);
    faqForm.reset({ question: "", answer: "" });
    setFaqDialogOpen(true);
  };

  const openEditFaq = (faq: Faq) => {
    setEditingFaq(faq);
    faqForm.reset({ question: faq.question, answer: faq.answer });
    setFaqDialogOpen(true);
  };

  const handleFaqSubmit = (values: z.infer<typeof faqSchema>) => {
    if (editingFaq) {
      updateFaq.mutate({ id: editingFaq.id, data: values }, {
        onSuccess: () => {
          setFaqDialogOpen(false);
          toast({ title: "FAQ updated" });
        },
      });
    } else {
      createFaq.mutate(values, {
        onSuccess: () => {
          setFaqDialogOpen(false);
          faqForm.reset();
          toast({ title: "FAQ added" });
        },
      });
    }
  };

  const handleToggleFaqPublished = (faq: Faq) => {
    updateFaq.mutate({ id: faq.id, data: { isPublished: !faq.isPublished } }, {
      onSuccess: () => toast({ title: faq.isPublished ? "FAQ hidden" : "FAQ published" }),
    });
  };

  const handleDeleteFaq = () => {
    if (deletingFaqId == null) return;
    deleteFaq.mutate(deletingFaqId, {
      onSuccess: () => {
        setDeletingFaqId(null);
        toast({ title: "FAQ deleted" });
      },
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Site Content</h1>
        <p className="text-muted-foreground font-medium">Manage public-facing website data.</p>
      </div>

      {/* ── Services ── */}
      <section>
        <h2 className="text-xl font-bold mb-4">Services Matrix</h2>
        <Card className="shadow-sm">
          {loadingServices ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Base Price</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-bold">{s.title}</TableCell>
                    <TableCell><Badge variant="outline">{s.category.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{s.startingPrice || "N/A"}</TableCell>
                    <TableCell><Badge className="bg-green-500 hover:bg-green-600">Active</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </section>

      {/* ── Portfolio ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Portfolio Showcase</h2>
          <Button size="sm" onClick={() => setPortDialogOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loadingPortfolio ? (
            <div className="col-span-full flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            portfolio?.map(p => (
              <Card key={p.id} className="overflow-hidden shadow-sm">
                <div className="aspect-video bg-muted relative">
                  {p.mediaType === 'image' && <img src={p.mediaUrl} className="object-cover w-full h-full" alt={p.title} />}
                  {p.mediaType !== 'image' && <div className="absolute inset-0 flex items-center justify-center bg-primary/5 font-bold uppercase tracking-widest text-primary/50">{p.mediaType}</div>}
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">{p.serviceCategory.replace(/_/g, " ")}</Badge>
                  <div className="font-bold truncate">{p.title}</div>
                  <Button variant="link" className="px-0 h-auto text-xs mt-2 text-primary" onClick={() => window.open(p.mediaUrl, "_blank")}>
                    View Asset <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section>
        <h2 className="text-xl font-bold mb-4">Testimonials (Moderation)</h2>
        <Card className="shadow-sm">
          {loadingTestimonials ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-[200px]">Client</TableHead>
                  <TableHead className="font-bold">Quote</TableHead>
                  <TableHead className="font-bold w-[100px]">Rating</TableHead>
                  <TableHead className="font-bold w-[120px]">Status</TableHead>
                  <TableHead className="text-right font-bold w-[100px]">Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials?.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-bold">{t.clientName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground italic">"{t.quote}"</TableCell>
                    <TableCell>{t.rating} / 5</TableCell>
                    <TableCell>
                      {t.isPublished ? <Badge className="bg-green-500">Published</Badge> : <Badge variant="secondary">Hidden</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleTestimonialToggle(t.id, t.isPublished)}>
                        {t.isPublished ? <X className="w-4 h-4 text-destructive" /> : <Check className="w-4 h-4 text-green-500" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </section>

      {/* ── FAQs ── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Freelancer FAQs</h2>
            <p className="text-sm text-muted-foreground mt-0.5">These appear on the public Freelancers page.</p>
          </div>
          <Button size="sm" onClick={openNewFaq}><Plus className="w-4 h-4 mr-2" /> Add FAQ</Button>
        </div>
        <Card className="shadow-sm">
          {loadingFaqs ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : !faqs?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No FAQs yet. Add one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-8" />
                  <TableHead className="font-bold">Question</TableHead>
                  <TableHead className="font-bold hidden md:table-cell">Answer (preview)</TableHead>
                  <TableHead className="font-bold w-[110px] text-center">Status</TableHead>
                  <TableHead className="font-bold text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map(faq => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-muted-foreground/40">
                      <GripVertical className="w-4 h-4" />
                    </TableCell>
                    <TableCell className="font-semibold max-w-[240px]">
                      <p className="truncate">{faq.question}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell max-w-[300px]">
                      <p className="truncate">{faq.answer}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleFaqPublished(faq)}
                        className="focus:outline-none"
                      >
                        {faq.isPublished
                          ? <Badge className="bg-green-500 hover:bg-green-600 cursor-pointer">Published</Badge>
                          : <Badge variant="secondary" className="cursor-pointer">Hidden</Badge>
                        }
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditFaq(faq)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeletingFaqId(faq.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </section>

      {/* Portfolio dialog */}
      <Dialog open={portDialogOpen} onOpenChange={setPortDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Portfolio Item</DialogTitle>
          </DialogHeader>
          <Form {...portForm}>
            <form onSubmit={portForm.handleSubmit(handleCreatePortfolio)} className="space-y-4">
              <FormField control={portForm.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={portForm.control} name="serviceCategory" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                      <SelectItem value="VIDEO_EDITING">Video Editing</SelectItem>
                      <SelectItem value="PHOTOGRAPHY_VIDEOGRAPHY">Photography & Videography</SelectItem>
                      <SelectItem value="GRAPHIC_DESIGN">Graphic Design</SelectItem>
                      <SelectItem value="CONTENT_WRITING">Content Writing</SelectItem>
                      <SelectItem value="SEO_DIGITAL_MARKETING">SEO & Digital Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={portForm.control} name="mediaType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="image">Image URL</SelectItem>
                      <SelectItem value="video">Video URL</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={portForm.control} name="mediaUrl" render={({ field }) => (
                <FormItem><FormLabel>Asset URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createPortfolio.isPending}>Save Item</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* FAQ create/edit dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <Form {...faqForm}>
            <form onSubmit={faqForm.handleSubmit(handleFaqSubmit)} className="space-y-4">
              <FormField control={faqForm.control} name="question" render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. How do payouts work?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={faqForm.control} name="answer" render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a clear, concise answer..."
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setFaqDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createFaq.isPending || updateFaq.isPending}>
                  {editingFaq ? "Save Changes" : "Add FAQ"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* FAQ delete confirm dialog */}
      <Dialog open={deletingFaqId != null} onOpenChange={(o) => !o && setDeletingFaqId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this FAQ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove the FAQ from the public page. This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingFaqId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteFaq} disabled={deleteFaq.isPending}>
              {deleteFaq.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
