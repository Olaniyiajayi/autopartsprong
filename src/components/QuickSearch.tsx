import { Search } from "lucide-react";

export function QuickSearch() {
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h2 className="text-base font-semibold text-foreground mb-3">Quick Search</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by Part No or VIN..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
