import { AppSidebar } from "@/components/AppSidebar";
import { InvoicesHeader } from "@/components/invoices/InvoicesHeader";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { useState } from "react";

const tabs = ["All Invoices", "Awaiting Payment", "Paid", "Overdue"] as const;
type Tab = typeof tabs[number];

const Invoices = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All Invoices");

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col pl-64 bg-background">
        <InvoicesHeader />
        <div className="flex-1 p-6 pt-16 space-y-4">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          <InvoicesTable activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
};

export default Invoices;
