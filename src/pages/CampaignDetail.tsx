import { useParams, useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreVertical, ExternalLink, User, Calendar, Mail, Clock, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
                    <span>/</span>
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
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-lg">1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Who</h2>
                    </div>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Target audience</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-primary">GJ BP - 1</span>
                      </div>
                      <span className="text-muted-foreground">- 1 of 8 nodes</span>
                      <Badge variant="secondary" className="gap-1">
                        <span className="text-xs">Blueprint Filter</span>
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Total users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold">50</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Last counted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Nov 25, 2025, 05:09 PM</span>
                        <span className="text-primary cursor-pointer hover:underline">0926613</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button variant="link" className="h-auto p-0 text-sm">
                      <span className="flex items-center gap-2">
                        Data variables
                        <Badge variant="secondary" className="rounded-full w-5 h-5 flex items-center justify-center p-0">
                          <span className="text-xs">4</span>
                        </Badge>
                      </span>
                    </Button>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">New Variable</Badge>
                      <Badge variant="outline">true</Badge>
                      <Badge variant="outline">Limit</Badge>
                      <Badge variant="outline">25</Badge>
                      <Badge variant="outline">gender</Badge>
                      <Badge variant="outline">M</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Audience recording</div>
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
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-lg">2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">When</h2>
                    </div>
                  </div>
                  <Button variant="outline">Add</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Schedule type</h3>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Unscheduled</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
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
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-lg">3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">What</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Preview & test</Button>
                    <Button variant="outline">Edit</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left column - Email details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="text-muted-foreground">Template</span>
                      <span className="text-primary">Gaurav&lt;&gt;Content</span>

                      <span className="text-muted-foreground">Supplemental data</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground">Subject line</span>
                      <span>No sales?</span>

                      <span className="text-muted-foreground">Preheader</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground">Sending profile</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground">From name</span>
                      <span>Honey</span>

                      <span className="text-muted-foreground">From address</span>
                      <span>gaurav.james@messagegears.com</span>

                      <span className="text-muted-foreground">Reply-to name</span>
                      <span className="text-muted-foreground">-</span>

                      <span className="text-muted-foreground">Reply-to address</span>
                      <span className="text-muted-foreground">-</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-status-completed">
                        <span className="text-lg">✓</span>
                        <span>0 email spam tests</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-status-completed">
                        <span className="text-lg">✓</span>
                        <span>0 email client tests</span>
                      </div>
                    </div>
                  </div>

                  {/* Right column - Email preview */}
                  <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                    <div className="bg-card rounded shadow-lg max-w-md w-full p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-center text-card-foreground">No Sales Yet?</h3>
                        <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">Email content preview</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>
                            No sales occurred during this period primarily due to the customer
                            engagement and service connection from outreach efforts. The
                            effectiveness of marketing and customer relationships was not
                            translating to closed sales, which can point to underlying
                            customer needs, and entering factors such as market timing and
                            positioning, the details a lack opportunity...
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Generate SALES today!
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
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-lg">4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold">Advanced</span>
                    </div>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-[200px_1fr] gap-2">
                    <span className="text-muted-foreground">Notification email address</span>
                    <span>gaurav.james@messagegears.com (Progress updates disabled)</span>

                    <span className="text-muted-foreground">Pre-campaign trigger</span>
                    <span className="text-muted-foreground">-</span>

                    <span className="text-muted-foreground">Post-campaign trigger</span>
                    <span>dw test trigger</span>

                    <span className="text-muted-foreground">Suppression list</span>
                    <span className="text-muted-foreground">-</span>

                    <span className="text-muted-foreground">Campaign identifier</span>
                    <span>GJ_101</span>

                    <span className="text-muted-foreground">Seedlist</span>
                    <span className="text-muted-foreground">-</span>

                    <span className="text-muted-foreground">URL append</span>
                    <span className="text-muted-foreground">-</span>

                    <span className="text-muted-foreground">Custom properties</span>
                    <span className="text-muted-foreground">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignDetail;
