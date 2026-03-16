import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function CustomersHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <h1 className="text-2xl font-bold text-foreground">Customers</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone number..."
            className="pl-9 w-72 bg-background"
          />
        </div>
        <Button
          onClick={() => navigate("/dashboard/customers/add")}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4" />
          Add New Customer
        </Button>
      </div>
    </header>
  );
}
