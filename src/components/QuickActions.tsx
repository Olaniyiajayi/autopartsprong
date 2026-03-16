import { PlusCircle, Upload, FileText, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { label: "Add Part", icon: PlusCircle, url: "/dashboard/inventory/add" },
  { label: "Bulk Upload", icon: Upload, url: "/dashboard/inventory/bulk-upload" },
  { label: "Create Invoice", icon: FileText, url: "/dashboard/invoices" },
  { label: "Scan Label", icon: QrCode, url: "" },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <>
      {actions.map((action) => (
        <div
          key={action.label}
          onClick={() => action.url && navigate(action.url)}
          className="rounded-xl bg-card border border-border flex flex-col items-center justify-center gap-3 min-h-[160px] cursor-pointer hover:border-primary/40 transition-colors"
        >
          <action.icon className="w-8 h-8 text-foreground" />
          <span className="text-sm font-medium text-foreground">{action.label}</span>
        </div>
      ))}
    </>
  );
}
