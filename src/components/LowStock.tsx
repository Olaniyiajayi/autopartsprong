import { AlertTriangle, PackageCheck } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

const items = [
  { name: "Toyota Oil Filter (A1)", status: "Only 2 left" },
  { name: "Honda Brake Pads", status: "Out of stock" },
];

export function LowStock() {
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="text-base font-semibold text-foreground">Low Stock</h2>
        </div>
        <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
          6 ITEMS
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.status}</p>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">Restock</button>
          </div>
        ))}
      </div>
    </div>
  );
}
