import { PlusCircle, FileText, QrCode } from "lucide-react";

const actions = [
  { label: "Add Part", icon: PlusCircle },
  { label: "Create Invoice", icon: FileText },
  { label: "Scan Label", icon: QrCode },
];

export function QuickActions() {
  return (
    <>
      {actions.map((action) => (
        <div
          key={action.label}
          className="rounded-xl bg-card border border-border flex flex-col items-center justify-center gap-3 min-h-[160px] cursor-pointer hover:border-primary/40 transition-colors"
        >
          <action.icon className="w-8 h-8 text-foreground" />
          <span className="text-sm font-medium text-foreground">{action.label}</span>
        </div>
      ))}
    </>
  );
}
