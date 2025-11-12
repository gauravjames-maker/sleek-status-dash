import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import Blueprints from "./pages/Blueprints";
import BlueprintCreate from "./pages/BlueprintCreate";
import BlueprintAudience from "./pages/BlueprintAudience";
import BlueprintBuilder from "./pages/BlueprintBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/people/blueprints" element={<Blueprints />} />
          <Route path="/people/blueprints/new" element={<BlueprintCreate />} />
          <Route path="/people/blueprints/new/audience" element={<BlueprintAudience />} />
          <Route path="/people/blueprints/builder/:id" element={<BlueprintBuilder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
