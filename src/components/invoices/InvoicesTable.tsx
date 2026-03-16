import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreVertical, FileText, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const invoices = [
  { id: "INV-8821", date: "Oct 24, 2023", customer: "Emeka Obi", amount: 450000, status: "Paid", payment: "OPay" },
  { id: "INV-8822", date: "Oct 24, 2023", customer: "Ladippo Wholesale", amount: 1250500, status: "Awaiting Payment", payment: "Moniepoint" },
  { id: "INV-8823", date: "Oct 22, 2023", customer: "Chidi Spare Parts", amount: 85000, status: "Overdue", payment: "Kuda Bank" },
  { id: "INV-8824", date: "Oct 21, 2023", customer: "Bolaji Motors", amount: 210000, status: "Paid", payment: "Bank Transfer" },
  { id: "INV-8825", date: "Oct 20, 2023", customer: "Yusuf & Sons Ltd", amount: 55500, status: "Awaiting Payment", payment: "OPay" },
  { id: "INV-8826", date: "Oct 19, 2023", customer: "Ikeja Logistics", amount: 320000, status: "Overdue", payment: "Kuda Bank" },
  { id: "INV-8827", date: "Oct 18, 2023", customer: "Festac Garage", amount: 78200, status: "Paid", payment: "Moniepoint" },
];

const statusStyles: Record<string, string> = {
  "Paid": "bg-green-100 text-green-700",
  "Awaiting Payment": "bg-yellow-100 text-yellow-700",
  "Overdue": "bg-red-100 text-red-700",
};

interface Props {
  activeTab: string;
}

export function InvoicesTable({ activeTab }: Props) {
  const filtered = activeTab === "All Invoices"
    ? invoices
    : invoices.filter((inv) => inv.status === activeTab);

  if (filtered.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border">
        <EmptyState
          icon={FileText}
          title={activeTab === "All Invoices" ? "No invoices yet" : `No ${activeTab.toLowerCase()} invoices`}
          description={activeTab === "All Invoices" 
            ? "Create your first invoice to start tracking payments and revenue."
            : `There are no invoices with "${activeTab}" status right now.`}
          actionLabel={activeTab === "All Invoices" ? "Create Invoice" : undefined}
          actionIcon={Plus}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Invoice ID</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Date</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Customer</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Amount</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Payment Via</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-semibold text-foreground">#{inv.id}</TableCell>
              <TableCell className="text-muted-foreground">{inv.date}</TableCell>
              <TableCell className="text-foreground">{inv.customer}</TableCell>
              <TableCell className="font-bold text-foreground">₦{inv.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusStyles[inv.status]}>
                  {inv.status}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground">{inv.payment}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing 1 to {filtered.length} of 42 results
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" className="w-8 h-8 bg-primary text-primary-foreground">1</Button>
          <Button variant="outline" size="icon" className="w-8 h-8">2</Button>
          <Button variant="outline" size="icon" className="w-8 h-8">3</Button>
          <Button variant="outline" size="icon" className="w-8 h-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
