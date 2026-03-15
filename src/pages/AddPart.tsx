import { AppSidebar } from "@/components/AppSidebar";
import { AddPartForm } from "@/components/inventory/AddPartForm";
import { Bell, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AddPart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col pl-64 bg-background">
        {/* Header */}
        <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate("/inventory")} className="hover:text-foreground transition-colors">
              Inventory
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Add New Part</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 pt-20 max-w-4xl">
          <h1 className="text-2xl font-bold text-foreground">Register New Car Part</h1>
          <p className="text-muted-foreground mt-1 mb-8">
            Create a new listing for the Lagos warehouse inventory system.
          </p>
          <AddPartForm />
        </div>
      </main>
    </div>
  );
};

export default AddPart;
