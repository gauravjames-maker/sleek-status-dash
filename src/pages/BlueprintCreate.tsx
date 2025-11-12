import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Network, Users, Database, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlueprintCreate = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: "audience",
      icon: Users,
      title: "Choose an Audience",
      description: "Use an existing Audience to link to the Blueprint as its starting population. All data settings will come directly from the Audience",
      onClick: () => navigate("/people/blueprints/new/audience"),
    },
    {
      id: "blueprint",
      icon: Network,
      title: "Continue with a Blueprint",
      description: "Use an existing Blueprint to continue a chain. All data settings will come directly from the parent Blueprint",
      onClick: () => {},
    },
    {
      id: "warehouse",
      icon: Database,
      title: "Query your data warehouse",
      description: "Start from scratch and write a new query, or copy an existing SQL query from an Audience",
      onClick: () => {},
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      
      <main className="flex-1 overflow-auto bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 -ml-2"
            onClick={() => navigate("/people/blueprints")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Blueprints
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-8">
            <Network className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Create your Blueprint</h1>
          <p className="text-muted-foreground mb-12">Choose an option below to begin</p>

          <div className="w-full max-w-3xl space-y-4">
            {options.map((option) => (
              <Card
                key={option.id}
                className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={option.onClick}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlueprintCreate;
