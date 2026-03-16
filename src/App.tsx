import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Landing from "./pages/Landing.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Index from "./pages/Index.tsx";
import Inventory from "./pages/Inventory.tsx";
import Invoices from "./pages/Invoices.tsx";
import AddPart from "./pages/AddPart.tsx";
import BulkUpload from "./pages/BulkUpload.tsx";
import Customers from "./pages/Customers.tsx";
import AddCustomer from "./pages/AddCustomer.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/dashboard/inventory" element={<Inventory />} />
            <Route path="/dashboard/inventory/add" element={<AddPart />} />
            <Route path="/dashboard/inventory/bulk-upload" element={<BulkUpload />} />
            <Route path="/dashboard/invoices" element={<Invoices />} />
            <Route path="/dashboard/customers" element={<Customers />} />
            <Route path="/dashboard/customers/add" element={<AddCustomer />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
