import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Users } from "lucide-react";

const AudienceMG = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audience - MG</h1>
            <p className="text-sm text-muted-foreground">Manage your MessageGears audiences</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Audience - MG module coming soon.</p>
        </div>
      </main>
    </div>
  );
};

export default AudienceMG;
