import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, User, ChevronRight, Search, UserPlus, Check, RotateCcw, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getContact, updateContact, ContactPut, PaymentType } from "@/services/contact";

const MARKET_LOCATIONS = [
  "Ladipo Market",
  "Aspamda",
  "Ikorodu",
  "Kano Hub",
  "Lekki Phase 1",
  "Alaba International",
  "Trade Fair Complex",
];

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");
  const [marketLocation, setMarketLocation] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      try {
        const data = await getContact(id);
        setName(data.contact_name);
        setPhone(data.contact_phone || "");
        setAccountNumber(data.account_number || "");
        setEmail(data.contact_email || "");
        setMarketLocation(data.delivery_address?.city || "");
        setPaymentType(data.payment_type || "");
        setNotes(data.note || "");
      } catch (error) {
        console.error("Failed to fetch customer details:", error);
        alert("Error loading customer details.");
        navigate("/customers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name.trim() || !phone.trim() || !marketLocation) return;
    
    setIsUpdating(true);
    try {
      const payload: ContactPut = {
        contact_id: id,
        contact_name: name,
        contact_phone: phone,
        contact_email: email || undefined,
        account_number: accountNumber || undefined,
        payment_type: paymentType ? (paymentType as PaymentType) : undefined,
        delivery_address: {
          city: marketLocation,
        },
        same_as_delivery_address: true,
        billing_address: {
          city: marketLocation,
        },
        note: notes || undefined,
      };

      await updateContact(payload);
      navigate("/customers");
    } catch (error) {
      console.error("Failed to update customer:", error);
      alert("Error updating customer. Check console for details.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 flex flex-col pl-64 bg-background">
        <header className="fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate("/customers")} className="hover:text-foreground transition-colors">
              Customers
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Edit Customer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64 bg-background" />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 pt-20 max-w-3xl">
          <h1 className="text-2xl font-bold text-foreground">Edit Customer</h1>
          <p className="text-muted-foreground mt-1 mb-8">
            Update contact and business details for this customer.
          </p>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Customer Information</h2>
                  <p className="text-sm text-muted-foreground">Update the primary contact and business details.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Customer Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Company / Account Number (Optional)</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Shop Code or Account No"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Market Location * (City)</Label>
                    <Select value={marketLocation} onValueChange={setMarketLocation} required>
                      <SelectTrigger id="location" className={!marketLocation ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Select a market location" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARKET_LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type (Optional)</Label>
                    <Select value={paymentType} onValueChange={(val) => setPaymentType(val as PaymentType)}>
                      <SelectTrigger id="paymentType" className={!paymentType ? "text-muted-foreground" : ""}>
                        <SelectValue placeholder="Select a payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">CASH</SelectItem>
                        <SelectItem value="ACCOUNT">ACCOUNT</SelectItem>
                        <SelectItem value="CAPRICORN">CAPRICORN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special instructions or customer preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] resize-y"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/customers")} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isUpdating}>
                    <UserPlus className="w-4 h-4" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditCustomer;
