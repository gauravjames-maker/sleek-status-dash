import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, FileText, Rocket, Send, Mail, Shield, MoreHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import TemplatePreview from "./TemplatePreview";

const TemplateDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <CampaignSidebar />
        
        <main className="flex-1 overflow-auto bg-background">
          {/* Header */}
          <header className="border-b border-border bg-card">
            <div className="px-6 py-4">
              <button
                onClick={() => navigate("/content/templates")}
                className="flex items-center gap-2 text-sm text-primary hover:underline mb-3"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Template Overview
              </button>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-card border-2 border-border rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">Gaurav&lt;&gt;Content</h1>
                    <button className="text-sm text-muted-foreground hover:text-foreground">
                      click to add description
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <select className="px-4 py-2 border border-border rounded-lg bg-card text-sm">
                    <option>Draft</option>
                    <option>Approved</option>
                  </select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                  >
                    Preview and Test
                  </Button>
                  
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Quick Launch
                  </Button>
                  
                  <button className="p-2 hover:bg-accent rounded-lg">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content card */}
              <div className="lg:col-span-2">
                <div className="border-2 border-dashed border-border rounded-lg p-8 bg-card">
                  <div className="max-w-2xl mx-auto">
                    <img 
                      src="/placeholder.svg" 
                      alt="No Sales Yet template preview"
                      className="w-full rounded-lg shadow-sm mb-4"
                    />
                    <div className="space-y-3 text-sm text-foreground">
                      <p className="font-semibold text-base">No Sales Yet?</p>
                      <p>No sales occurred during this period primarily due to low customer engagement and limited conversion from outreach efforts. The product's value proposition may not have fully aligned with customer needs, and external factors such as market timing and competition also played a role. Additionally, gaps in follow-up and lead nurturing likely reduced conversion opportunities. Steps are being taken to refine messaging, improve outreach, and better align offerings with customer expectations.</p>
                      <button className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm font-medium">
                        Boost your SALES today!
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar cards */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 bg-card flex flex-col items-center justify-center min-h-[200px] hover:border-primary/50 cursor-pointer transition-colors">
                  <Plus className="w-8 h-8 text-muted-foreground mb-3" />
                  <span className="text-sm text-muted-foreground">Create Push Content</span>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 bg-card flex flex-col items-center justify-center min-h-[200px] hover:border-primary/50 cursor-pointer transition-colors">
                  <Plus className="w-8 h-8 text-muted-foreground mb-3" />
                  <span className="text-sm text-muted-foreground">Create SMS Content</span>
                </div>
              </div>
            </div>

            {/* Bottom sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Configure Sample Data */}
              <div className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Configure Sample Data</h3>
                </div>
                <div className="text-sm text-muted-foreground mb-4">0 Snippets</div>
                <button className="text-sm text-primary hover:underline">+ Snippet</button>
              </div>

              {/* Campaign stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">0 Marketing Campaigns</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">0 Experiment Campaigns</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">0 Transactional Campaigns</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">0 Email Client Tests</span>
                  </div>
                  <button className="text-sm text-primary hover:underline">+ Test</button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">0 Spam Tests</span>
                  </div>
                  <button className="text-sm text-primary hover:underline">+ Test</button>
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold">GJ</span>
                </div>
                <div>
                  <span>Modified By </span>
                  <span className="font-medium text-foreground">Gaurav James</span>
                  <span> a day ago</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold">GJ</span>
                </div>
                <div>
                  <span>Created By </span>
                  <span className="font-medium text-foreground">Gaurav James</span>
                  <span> a day ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showPreview && (
        <TemplatePreview onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

export default TemplateDetail;
