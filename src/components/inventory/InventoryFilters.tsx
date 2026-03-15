import { Car, Settings2, Layers, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function InventoryFilters() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 text-sm">
          <Car className="w-4 h-4" />
          Vehicle Make
        </Button>
        <Button variant="outline" className="gap-2 text-sm">
          <Settings2 className="w-4 h-4" />
          Condition
        </Button>
        <Button variant="outline" className="gap-2 text-sm">
          <Layers className="w-4 h-4" />
          Part Category
        </Button>
        <Badge className="bg-primary/10 text-primary border-0 gap-1 px-3 py-1.5 text-sm font-medium">
          Toyota <X className="w-3 h-3 cursor-pointer" />
        </Badge>
        <Badge className="bg-primary/10 text-primary border-0 gap-1 px-3 py-1.5 text-sm font-medium">
          Tokunbo <X className="w-3 h-3 cursor-pointer" />
        </Badge>
      </div>
      <Button variant="outline" className="gap-2 text-sm">
        <Download className="w-4 h-4" />
        Export CSV
      </Button>
    </div>
  );
}
