import { TrendingUp } from "lucide-react";

export function SalesCard() {
  return (
    <div className="rounded-xl bg-primary p-6 text-primary-foreground flex flex-col justify-between min-h-[160px]">
      <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Today's Sales</p>
      <div>
        <p className="text-4xl font-bold mt-2">
          <span className="text-2xl">₦</span>0.00
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="bg-primary-foreground/20 text-xs font-semibold px-3 py-1 rounded-full">
            0 ORDERS TODAY
          </span>
          <span className="flex items-center gap-1 text-xs opacity-90">
            <TrendingUp className="w-3 h-3" /> No data yet
          </span>
        </div>
      </div>
    </div>
  );
}
