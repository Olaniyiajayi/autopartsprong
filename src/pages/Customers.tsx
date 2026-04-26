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
import { MessageCircle, ChevronLeft, ChevronRight, Users, UserPlus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { getContacts, Contact } from "@/services/contact";

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
  const [customers, setCustomers] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalCustomers = customers.length;
  const pageSize = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { items } = await getContacts({ contact_type: "CUSTOMER" });
        setCustomers(items);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const paginatedCustomers = customers.slice((page - 1) * pageSize, page * pageSize);

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
                <p className="text-2xl font-bold text-foreground mt-1">{totalCustomers.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">ACTIVE THIS MONTH</p>
                <p className="text-2xl font-bold text-foreground mt-1">-</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">TOP LOCATION</p>
                <p className="text-2xl font-bold text-foreground mt-1">-</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading customers...</p>
                </div>
              ) : customers.length === 0 ? (
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
                    <TableHead>LOCATION (CITY)</TableHead>
                    <TableHead>PAYMENT TYPE</TableHead>
                    <TableHead>ACCOUNT NO</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.contact_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {getInitials(customer.contact_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.contact_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{customer.contact_phone}</TableCell>
                      <TableCell>{customer.delivery_address?.city || "-"}</TableCell>
                      <TableCell>{customer.payment_type || "-"}</TableCell>
                      <TableCell>{customer.account_number || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/customers/edit/${customer.contact_id}`)}
                            className="text-primary text-sm font-medium hover:underline"
                          >
                            Edit Profile
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
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalCustomers > pageSize && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedCustomers.length} of {totalCustomers.toLocaleString()} customers
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.ceil(totalCustomers / pageSize) }, (_, i) => i + 1).map((n) => (
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
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPage((p) => Math.min(Math.ceil(totalCustomers / pageSize), p + 1))}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
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
