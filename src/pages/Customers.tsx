import { AppSidebar } from "@/components/AppSidebar";
import { CustomersHeader } from "@/components/customers/CustomersHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, ChevronLeft, ChevronRight, Users, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";

const SAMPLE_CUSTOMERS = [
  { id: "1", name: "Chukwudi Okafor", phone: "+234 803 123 4567", location: "Ladipo Market", orders: 15, totalSpent: "₦450,000", lastOrder: "Oct 12, 2023" },
  { id: "2", name: "Adesola Bakare", phone: "+234 802 456 7890", location: "Ikorodu", orders: 8, totalSpent: "₦210,500", lastOrder: "Oct 10, 2023" },
  { id: "3", name: "Ibrahim Musa", phone: "+234 805 789 0123", location: "Kano Hub", orders: 22, totalSpent: "₦1,200,000", lastOrder: "Oct 11, 2023" },
  { id: "4", name: "Blessing Okon", phone: "+234 807 012 3456", location: "Lekki Phase 1", orders: 5, totalSpent: "₦95,000", lastOrder: "Oct 05, 2023" },
  { id: "5", name: "Ngozi Eze", phone: "+234 809 345 6789", location: "Aspamda", orders: 12, totalSpent: "₦310,000", lastOrder: "Oct 14, 2023" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Customers = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const customers = SAMPLE_CUSTOMERS; // Will be replaced with real data later
  const totalCustomers = 1284;
  const pageSize = 5;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col pl-64 bg-background">
        <CustomersHeader />
        <div className="flex-1 p-6 pt-20 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">TOTAL CUSTOMERS</p>
                <p className="text-2xl font-bold text-foreground mt-1">1,284</p>
                <p className="text-xs text-primary font-medium mt-1">📈 +12%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">ACTIVE THIS MONTH</p>
                <p className="text-2xl font-bold text-foreground mt-1">452</p>
                <p className="text-xs text-muted-foreground mt-1">of total base</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">TOP LOCATION</p>
                <p className="text-2xl font-bold text-foreground mt-1">Ladipo</p>
                <p className="text-xs text-muted-foreground mt-1">38% of orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer table */}
          <Card>
            <CardContent className="p-0">
              {customers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No customers yet"
                  description="Add your first customer to start building your buyer directory and track orders."
                  actionLabel="Add New Customer"
                  actionIcon={UserPlus}
                  onAction={() => navigate("/customers/add")}
                />
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead>PHONE NUMBER</TableHead>
                    <TableHead>LOCATION</TableHead>
                    <TableHead>ORDERS</TableHead>
                    <TableHead>TOTAL SPENT</TableHead>
                    <TableHead>LAST ORDER</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_CUSTOMERS.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.totalSpent}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.lastOrder}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button className="text-primary text-sm font-medium hover:underline">
                            View Profile
                          </button>
                          <Button size="icon" variant="outline" className="h-9 w-9 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {pageSize} of {totalCustomers.toLocaleString()} customers
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {[1, 2, 3].map((n) => (
                <Button
                  key={n}
                  variant={page === n ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Support WhatsApp */}
      <a
        href="#"
        className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-white shadow-lg hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">Support WhatsApp</span>
      </a>
    </div>
  );
};

export default Customers;
