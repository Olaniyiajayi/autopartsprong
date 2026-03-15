import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Good Morning, Alex 👋
        </h1>
        <p className="text-sm text-muted-foreground">Lagos Central Branch</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Landmark className="w-4 h-4" />
          Bank Status
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          End of Day Report
        </Button>
      </div>
    </header>
  );
}
