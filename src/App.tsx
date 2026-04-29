import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import MarketingCampaigns from "./pages/MarketingCampaigns";
import CampaignDetail from "./pages/CampaignDetail";
import Blueprints from "./pages/Blueprints";
import BlueprintCreate from "./pages/BlueprintCreate";
import BlueprintAudience from "./pages/BlueprintAudience";
import BlueprintBuilder from "./pages/BlueprintBuilder";
import Templates from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import Audience from "./pages/Audience";
import AudienceCreate from "./pages/AudienceCreate";
import AudienceStudio from "./pages/AudienceStudio";
import AudienceBuilder from "./pages/AudienceBuilder";
import AudienceStudioDBT from "./pages/AudienceStudioDBT";
import AudienceMG from "./pages/AudienceMG";
import DBTBuilder from "./pages/DBTBuilder";
import CampaignAPI from "./pages/CampaignAPI";
import CampaignAPIDetail from "./pages/CampaignAPIDetail";
import AnalyticsJobList from "./pages/AnalyticsJobList";
import Journeys from "./pages/Journeys";
import JourneyDetail from "./pages/JourneyDetail";
import SystemConfiguration from "./pages/SystemConfiguration";
import NotFound from "./pages/NotFound";
import { MaintenanceModeProvider } from "./context/MaintenanceModeContext";
import { MaintenanceModeBanner } from "./components/MaintenanceModeBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MaintenanceModeProvider>
        <BrowserRouter>
          <div className="flex h-screen flex-col">
            <MaintenanceModeBanner />
            <div className="min-h-0 flex-1">
              <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/journeys" element={<Journeys />} />
          <Route path="/campaigns/journeys/:id" element={<JourneyDetail />} />
          <Route path="/campaigns/marketing" element={<MarketingCampaigns />} />
          <Route path="/campaigns/marketing/overview/:id" element={<CampaignDetail />} />
          <Route path="/people/blueprints" element={<Blueprints />} />
          <Route path="/people/blueprints/new" element={<BlueprintCreate />} />
          <Route path="/people/blueprints/new/audience" element={<BlueprintAudience />} />
          <Route path="/people/blueprints/builder/:id" element={<BlueprintBuilder />} />
          <Route path="/people/audience" element={<Audience />} />
          <Route path="/people/audience/create" element={<AudienceCreate />} />
          <Route path="/people/audience-mg" element={<AudienceMG />} />
          <Route path="/people/audience-studio" element={<AudienceStudio />} />
          <Route path="/people/audience-studio/builder" element={<AudienceBuilder />} />
          <Route path="/people/audience-studio-dbt" element={<AudienceStudioDBT />} />
          <Route path="/people/audience-studio-dbt/builder" element={<DBTBuilder />} />
          <Route path="/content/templates" element={<Templates />} />
          <Route path="/content/templates/:id" element={<TemplateDetail />} />
          <Route path="/admin/system-configuration" element={<SystemConfiguration />} />
          <Route path="/admin/campaign-api" element={<CampaignAPI />} />
          <Route path="/admin/campaign-api/:id" element={<CampaignAPIDetail />} />
          <Route path="/analytics/job" element={<AnalyticsJobList />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
            </div>
          </div>
        </BrowserRouter>
      </MaintenanceModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
