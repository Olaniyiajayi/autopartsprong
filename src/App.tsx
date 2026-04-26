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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Index />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/add" element={<AddPart />} />
            <Route path="/inventory/bulk-upload" element={<BulkUpload />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
