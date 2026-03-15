import { Search, Bell, User, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InvoicesHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <h1 className="text-2xl font-bold text-foreground">Invoices Management</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-9 w-52 bg-background" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5 text-muted-foreground" />
        </Button>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Create New Invoice
        </Button>
      </div>
    </header>
  );
}
