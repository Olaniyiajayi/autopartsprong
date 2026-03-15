import { Search, Bot, Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InventoryHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search parts, SKUs..."
            className="pl-9 w-56 bg-background"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Bot className="w-4 h-4" />
          Ask Axel
        </Button>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Create
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
    </header>
  );
}
