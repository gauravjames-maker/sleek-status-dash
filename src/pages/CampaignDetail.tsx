import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { WhenScheduleDialog } from "@/components/WhenScheduleDialog";
import { AuditLogDialog } from "@/components/AuditLogDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreVertical, ExternalLink, User, Calendar, Mail, Clock, RefreshCw, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [whenDialogOpen, setWhenDialogOpen] = useState(false);
  const [auditLogOpen, setAuditLogOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span 
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => navigate("/campaigns/marketing")}
                    >
                      Marketing campaigns
                    </span>
                    <span>›</span>
                    <span>Outbound campaign</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold">GJ - 101</h1>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Click edit to add a description</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setAuditLogOpen(true)}>
                <FileText className="h-4 w-4" />
                Audit Log
              </Button>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View analytics
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Launch
              </Button>
            </div>
          </div>
        </header>

        {/* Sub-header with metadata */}
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Account:</span>
                <span>Test Account</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Category:</span>
                <span>GJ 101</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="link" className="h-auto p-0 text-primary">
                Edit
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Last modified:</span>
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs font-semibold bg-status-completed text-white">
                  GJ
                </AvatarFallback>
              </Avatar>
              <span>Nov 25, 2025, 05:11 PM</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Who Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 bg-muted/30">
                      <span className="text-sm font-medium text-muted-foreground">1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Who</h2>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Target audience</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">GJ BP - 1</span>
                        <span className="text-muted-foreground">- 1 of 8 nodes</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Blueprint Filter
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Total users</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-medium">50</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Last counted</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>Nov 25, 2025, 05:09 PM</span>
                        <span className="text-primary cursor-pointer hover:underline text-xs">0006613</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button variant="link" className="h-auto p-0 text-sm font-normal">
                      <span className="flex items-center gap-2">
                        <span>Data variables</span>
                        <Badge variant="secondary" className="rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary/10 text-primary border-0">
                          3
                        </Badge>
                      </span>
                    </Button>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="font-normal">New Variable</Badge>
                      <Badge variant="outline" className="font-normal">true</Badge>
                      <Badge variant="outline" className="font-normal">Limit</Badge>
                      <Badge variant="outline" className="font-normal">25</Badge>
                      <Badge variant="outline" className="font-normal">gender</Badge>
                      <Badge variant="outline" className="font-normal">M</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Audience recording</div>
                    <div className="text-sm">Broken AR Mapping for In-App - 1 of 8 nodes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* When Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 bg-muted/30">
                      <span className="text-sm font-medium text-muted-foreground">2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">When</h2>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setWhenDialogOpen(true)}>Add</Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Schedule type</h3>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Unscheduled</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Launch your campaign at any time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 bg-muted/30">
                      <span className="text-sm font-medium text-muted-foreground">3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">What</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Preview & test</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>

                <div className="grid grid-cols-[400px_1fr] gap-8">
                  {/* Left column - Email details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                      <span className="text-muted-foreground text-xs">Template</span>
                      <span className="text-primary cursor-pointer hover:underline">Gaurav&lt;&gt;Content</span>

                      <span className="text-muted-foreground text-xs">Supplemental data</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground text-xs">Subject line</span>
                      <span>No sales?</span>

                      <span className="text-muted-foreground text-xs">Preheader</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground text-xs">Sending profile</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground text-xs">From name</span>
                      <span>Honey</span>

                      <span className="text-muted-foreground text-xs">From address</span>
                      <span>gaurav.james@messagegears.com</span>

                      <span className="text-muted-foreground text-xs">Reply-to name</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground text-xs">Reply-to address</span>
                      <span className="text-muted-foreground">-</span>
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="flex items-center gap-2 text-xs text-status-completed">
                        <div className="w-5 h-5 rounded-full bg-status-completed/20 flex items-center justify-center">
                          <span className="text-sm">✓</span>
                        </div>
                        <span>0 email spam tests</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-status-completed">
                        <div className="w-5 h-5 rounded-full bg-status-completed/20 flex items-center justify-center">
                          <span className="text-sm">✓</span>
                        </div>
                        <span>0 email client tests</span>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Email preview */}
                  <div className="bg-muted/30 rounded-lg p-8 flex items-start justify-center">
                    <div className="bg-card rounded-lg shadow-sm border border-border max-w-sm w-full p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-center text-card-foreground">No Sales Yet?</h3>
                        <div className="w-full aspect-video bg-muted/50 rounded overflow-hidden">
                          <img 
                            src="/placeholder.svg" 
                            alt="Customer working" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                          <p>
                            No sales occurred during this period primarily due to low customer engagement and service connection from outreach efforts. The effectiveness of the product's value proposition may not have fully aligned with customer needs, and external factors such as market timing and competitive positioning. the details a lack opportunity; Steps are being taken to refine messaging, improve outreach, and better align
                          </p>
                        </div>
                        <div className="flex justify-center pt-2">
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-6">
                            Boost your SALES today!
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground/30 bg-muted/30">
                      <span className="text-sm font-medium text-muted-foreground">4</span>
                    </div>
                    <h2 className="text-lg font-semibold">Advanced</h2>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-[220px_1fr] gap-x-4 gap-y-2">
                    <span className="text-muted-foreground text-xs">Notification email address</span>
                    <span className="text-sm">gaurav.james@messagegears.com (Progress updates disabled)</span>

                    <span className="text-muted-foreground text-xs">Pre-campaign trigger</span>
                    <span className="text-muted-foreground text-sm">-</span>

                    <span className="text-muted-foreground text-xs">Post-campaign trigger</span>
                    <span className="text-sm">dw test trigger</span>

                    <span className="text-muted-foreground text-xs">Suppression list</span>
                    <span className="text-muted-foreground text-sm">-</span>

                    <span className="text-muted-foreground text-xs">Campaign identifier</span>
                    <span className="text-sm">GJ_101</span>

                    <span className="text-muted-foreground text-xs">Seedlist</span>
                    <span className="text-muted-foreground text-sm">-</span>

                    <span className="text-muted-foreground text-xs">URL append</span>
                    <span className="text-muted-foreground text-sm">-</span>

                    <span className="text-muted-foreground text-xs">Custom properties</span>
                    <span className="text-muted-foreground text-sm">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <WhenScheduleDialog open={whenDialogOpen} onOpenChange={setWhenDialogOpen} />
      <AuditLogDialog open={auditLogOpen} onOpenChange={setAuditLogOpen} campaignId={id} />
    </div>
  );
};

export default CampaignDetail;
