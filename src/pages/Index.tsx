import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SalesCard } from "@/components/SalesCard";
import { QuickActions } from "@/components/QuickActions";
import { RecentTransactions } from "@/components/RecentTransactions";
import { LowStock } from "@/components/LowStock";
import { QuickSearch } from "@/components/QuickSearch";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 p-6 space-y-6">
          {/* Top row: Sales + Quick Actions */}
          <div className="grid grid-cols-4 gap-4">
            <SalesCard />
            <QuickActions />
          </div>

          {/* Bottom row: Transactions + Low Stock + Search */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <RecentTransactions />
            </div>
            <div className="space-y-4">
              <LowStock />
              <QuickSearch />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
