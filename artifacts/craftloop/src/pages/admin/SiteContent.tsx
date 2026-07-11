import { useListAdminServices, useListAdminTestimonials, useUpdateAdminTestimonial, getListAdminTestimonialsQueryKey, useListAdminPortfolioItems, useCreateAdminPortfolioItem, getListAdminPortfolioItemsQueryKey } from "@workspace/api-client-react";
import { Loader2, ExternalLink, Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { PortfolioItemInputMediaType, ServiceCategory } from "@workspace/api-client-react/api.schemas";

const portSchema = z.object({
  title: z.string().min(2, "Title is required"),
  serviceCategory: z.nativeEnum(ServiceCategory),
  mediaType: z.nativeEnum(PortfolioItemInputMediaType),
  mediaUrl: z.string().url(),
});

export default function SiteContent() {
  const { data: services, isLoading: loadingServices } = useListAdminServices();
  const { data: testimonials, isLoading: loadingTestimonials } = useListAdminTestimonials();
  const { data: portfolio, isLoading: loadingPortfolio } = useListAdminPortfolioItems();
  
  const updateTestimonial = useUpdateAdminTestimonial();
  const createPortfolio = useCreateAdminPortfolioItem();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [portDialogOpen, setPortDialogOpen] = useState(false);

  const portForm = useForm<z.infer<typeof portSchema>>({
    resolver: zodResolver(portSchema),
    defaultValues: { title: "", mediaUrl: "", mediaType: "image", serviceCategory: undefined }
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

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Site Content</h1>
        <p className="text-muted-foreground font-medium">Manage public-facing website data.</p>
      </div>

      {/* Services */}
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

      {/* Portfolio */}
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
                  {p.mediaType === 'image' && <img src={p.mediaUrl} className="object-cover w-full h-full" />}
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

      {/* Testimonials */}
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
    </div>
  );
}