import { AppSidebar } from "@/components/AppSidebar";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryTable } from "@/components/inventory/InventoryTable";

const Inventory = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col bg-background">
        <InventoryHeader />
        <div className="flex-1 p-6 space-y-4">
          <InventoryFilters />
          <InventoryTable />
        </div>
      </main>
    </div>
  );
};

export default Inventory;
