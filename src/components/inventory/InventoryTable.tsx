import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const inventoryItems = [
  {
    image: "🔧",
    name: "Toyota Camry Brake Pads (Front)",
    sku: "BP-TY-001",
    vehicle: "Toyota Camry (2018-2023)",
    condition: "Tokunbo",
    conditionColor: "bg-muted text-foreground",
    stock: 15,
    maxStock: 20,
    stockColor: "bg-primary",
    price: 25000,
  },
  {
    image: "⚙️",
    name: "Honda Civic Alternator",
    sku: "ALT-HN-042",
    vehicle: "Honda Civic (2012-2016)",
    condition: "New",
    conditionColor: "bg-green-100 text-green-700",
    stock: 8,
    maxStock: 20,
    stockColor: "bg-warning",
    price: 85000,
  },
  {
    image: "🔩",
    name: "Lexus RX350 Shock Absorbers",
    sku: "SH-LX-009",
    vehicle: "Lexus RX350",
    condition: "Nigerian Used",
    conditionColor: "bg-purple-100 text-purple-700",
    stock: 2,
    maxStock: 20,
    stockColor: "bg-destructive",
    price: 45000,
  },
  {
    image: "🏎️",
    name: "Mercedes C-Class AMG Grille",
    sku: "GR-MB-012",
    vehicle: "Mercedes Benz C300 (W205)",
    condition: "Tokunbo",
    conditionColor: "bg-muted text-foreground",
    stock: 4,
    maxStock: 20,
    stockColor: "bg-warning",
    price: 120000,
  },
];

export function InventoryTable() {
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
