import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Package, Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";

const inventoryItems: Array<{
  image: string; name: string; sku: string; vehicle: string;
  condition: string; conditionColor: string; stock: number;
  maxStock: number; stockColor: string; price: number;
}> = [];

export function InventoryTable() {
  const navigate = useNavigate();
  const items = inventoryItems; // Will be replaced with real data later

  if (items.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border">
        <EmptyState
          icon={Package}
          title="No parts in inventory"
          description="Add your first car part to start tracking your inventory and stock levels."
          actionLabel="Add New Part"
          actionIcon={Plus}
          onAction={() => navigate("/inventory/add")}
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Image</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Part Name & ID</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Vehicle Model</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Condition</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Stock Level</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Price (₦)</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.map((item) => (
            <TableRow key={item.sku}>
              <TableCell>
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                  {item.image}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.vehicle}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={item.conditionColor}>
                  {item.condition}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-foreground">{item.stock} Units</p>
                  <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${item.stockColor}`}
                      style={{ width: `${(item.stock / item.maxStock) * 100}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                ₦{item.price.toLocaleString()}
              </TableCell>
              <TableCell>
                <Button variant="ghost" className="text-primary font-medium text-sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Showing 1 to 4 of 1,248 items
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
