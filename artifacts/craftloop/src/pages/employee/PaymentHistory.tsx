import { useListEmployeePayments } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function PaymentHistory() {
  const { data: payments, isLoading } = useListEmployeePayments();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment History</h1>
        <p className="text-muted-foreground font-medium">Track your earnings and pending payouts.</p>
      </div>

      <Card className="shadow-sm overflow-hidden border-border">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                  <TableHead className="font-bold py-4">Date Recorded</TableHead>
                  <TableHead className="font-bold">Project</TableHead>
                  <TableHead className="font-bold">Method</TableHead>
                  <TableHead className="font-bold text-right">Amount</TableHead>
                  <TableHead className="font-bold text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((pay) => (
                  <TableRow key={pay.id} className="border-border">
                    <TableCell className="font-medium text-muted-foreground">
                      {format(new Date(pay.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {pay.project?.title || `Project #${pay.projectId}`}
                      {pay.referenceNote && (
                        <div className="text-xs text-muted-foreground font-normal mt-1 flex items-center before:content-[''] before:w-1 before:h-1 before:bg-border before:rounded-full before:mr-2">
                          {pay.referenceNote}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/50">
                        {pay.method.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-foreground">
                      ${pay.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      {pay.status === 'paid' ? (
                        <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20 shadow-none font-bold">
                          Paid
                          {pay.paidAt && <span className="ml-1 text-xs opacity-70 block font-normal">on {format(new Date(pay.paidAt), "MMM d")}</span>}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30 shadow-none font-bold">
                          Processing
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {payments?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-lg">No payments have been recorded yet.</TableCell>
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