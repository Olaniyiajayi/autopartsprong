import { Clock } from "lucide-react";

const transactions = [
  {
    time: "10:45 AM",
    customer: "Emeka Obi",
    order: "Brake Pad (Toyota Corolla)",
    amount: "₦24,500",
    via: "OPay",
    viaColor: "bg-blue-500",
  },
  {
    time: "09:30 AM",
    customer: "Ladipo Wholesale",
    order: "Engine Oil (5 Cartons)",
    amount: "₦185,000",
    via: "Moniepoint",
    viaColor: "bg-green-500",
  },
  {
    time: "08:15 AM",
    customer: "Sarah Yusuf",
    order: "Oil Filter",
    amount: "₦6,000",
    via: "Kuda",
    viaColor: "bg-purple-500",
  },
];

export function RecentTransactions() {
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">View All</button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-xs uppercase text-muted-foreground tracking-wider">
            <th className="text-left pb-4 font-medium">Time</th>
            <th className="text-left pb-4 font-medium">Customer / Order</th>
            <th className="text-left pb-4 font-medium">Amount</th>
            <th className="text-left pb-4 font-medium">Payment Via</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-4 text-sm text-muted-foreground">{tx.time}</td>
              <td className="py-4">
                <p className="text-sm font-medium text-foreground">{tx.customer}</p>
                <p className="text-xs text-muted-foreground">{tx.order}</p>
              </td>
              <td className="py-4 text-sm font-semibold text-foreground">{tx.amount}</td>
              <td className="py-4">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={`w-2 h-2 rounded-full ${tx.viaColor}`} />
                  {tx.via}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
