import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, User, ChevronRight, Search, UserPlus, Check, RotateCcw, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MARKET_LOCATIONS = [
  "Ladipo Market",
  "Aspamda",
  "Ikorodu",
  "Kano Hub",
  "Lekki Phase 1",
  "Alaba International",
  "Trade Fair Complex",
];

const AddCustomer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [marketLocation, setMarketLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !marketLocation) return;
    // Placeholder: would call API to add customer
    navigate("/customers");
  };

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
            <span className="text-foreground font-medium">Add New Customer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search customers, parts, or orders..." className="pl-9 w-64 bg-background" />
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
          <h1 className="text-2xl font-bold text-foreground">Add New Customer</h1>
          <p className="text-muted-foreground mt-1 mb-8">
            Register a new buyer or business partner to the platform.
          </p>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Customer Information</h2>
                  <p className="text-sm text-muted-foreground">Fill in the primary contact and business details.</p>
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
                    <Label htmlFor="business">Business Name (Optional)</Label>
                    <Input
                      id="business"
                      placeholder="Shop or Company Name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
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
                <div className="space-y-2">
                  <Label htmlFor="location">Market Location *</Label>
                  <Select value={marketLocation} onValueChange={setMarketLocation}>
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
                  <Button type="button" variant="outline" onClick={() => navigate("/customers")}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="w-4 h-4" />
                    Add Customer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">KYC Verified</p>
                  <p className="text-xs text-muted-foreground">Identity checked</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Instant History</p>
                  <p className="text-xs text-muted-foreground">Orders tracked</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BellRing className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Auto Alerts</p>
                  <p className="text-xs text-muted-foreground">Notifications on</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddCustomer;
