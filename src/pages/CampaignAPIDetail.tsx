import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { AuditLogDialog } from "@/components/AuditLogDialog";
import { ArrowLeft, Pause, Play, RotateCcw, Calendar, AlertCircle, CheckCircle, XCircle, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

// Mock data - in a real app, this would come from an API
const mockAPIKeyDetail = {
  id: "1",
  name: "Airflow–Prod",
  campaignType: "Marketing",
  description: "Production key for Airflow orchestration",
  status: "Active",
  scopes: ["Can launch campaigns via API", "Can change campaign schedules via API"],
  createdOn: "2024-01-15",
  lastUsed: "2024-11-26 14:30",
  createdBy: "admin@company.com",
};

const mockAssociatedCampaigns = [
  {
    id: "1",
    name: "Holiday Sale Campaign",
    launchType: "API",
    lastAction: "launch",
    actionTimestamp: "2024-11-26 14:30",
    actionStatus: "success",
    nextScheduled: "2024-11-30 09:00",
    status: "Active",
  },
  {
    id: "2",
    name: "Product Launch Email",
    launchType: "API",
    lastAction: "pause",
    actionTimestamp: "2024-11-25 16:45",
    actionStatus: "success",
    nextScheduled: "Not scheduled",
    status: "Paused",
  },
  {
    id: "3",
    name: "Weekly Newsletter",
    launchType: "API",
    lastAction: "schedule change",
    actionTimestamp: "2024-11-24 11:20",
    actionStatus: "failed",
    nextScheduled: "2024-11-27 10:00",
    status: "Failed",
  },
];

const mockAuditLog = [
  {
    id: "1",
    campaign: "Holiday Sale Campaign",
    action: "launch",
    timestamp: "2024-11-26 14:30",
    status: "success",
    details: "Campaign launched successfully",
  },
  {
    id: "2",
    campaign: "Product Launch Email",
    action: "pause",
    timestamp: "2024-11-25 16:45",
    status: "success",
    details: "Campaign paused by API",
  },
  {
    id: "3",
    campaign: "Weekly Newsletter",
    action: "schedule change",
    timestamp: "2024-11-24 11:20",
    status: "failed",
    details: "Invalid schedule format provided",
  },
  {
    id: "4",
    campaign: "Welcome Series",
    action: "launch",
    timestamp: "2024-11-23 09:15",
    status: "success",
    details: "Campaign launched successfully",
  },
];

const mockStats = {
  totalLaunches: 45,
  totalPauses: 12,
  totalFailures: 3,
  successRate: 95,
};

export default function CampaignAPIDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [globalPauseDialogOpen, setGlobalPauseDialogOpen] = useState(false);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [relaunchDialogOpen, setRelaunchDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [filterAction, setFilterAction] = useState("all");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [auditLogDialogOpen, setAuditLogDialogOpen] = useState(false);

  const handleGlobalPause = () => {
    console.log("Pausing all campaigns");
    setGlobalPauseDialogOpen(false);
  };

  const handlePauseCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setPauseDialogOpen(true);
  };

  const handleConfirmPause = () => {
    console.log("Pausing campaign:", selectedCampaign?.name);
    setPauseDialogOpen(false);
  };

  const handleRelaunch = (campaign: any) => {
    setSelectedCampaign(campaign);
    setRelaunchDialogOpen(true);
  };

  const handleConfirmRelaunch = () => {
    console.log("Relaunching campaign:", selectedCampaign?.name);
    setRelaunchDialogOpen(false);
  };

  const handleReschedule = (campaign: any) => {
    setSelectedCampaign(campaign);
    setRescheduleDialogOpen(true);
  };

  const handleConfirmReschedule = () => {
    console.log("Rescheduling campaign:", selectedCampaign?.name, rescheduleDate, rescheduleTime);
    setRescheduleDialogOpen(false);
  };

  const filteredAuditLog = filterAction === "all" 
    ? mockAuditLog 
    : mockAuditLog.filter(log => log.action === filterAction);

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin/campaign-api")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to API Keys
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAuditLogDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Audit Log
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{mockAPIKeyDetail.name}</h1>
                  <p className="text-muted-foreground mt-1">{mockAPIKeyDetail.description}</p>
                </div>
                <Badge variant={mockAPIKeyDetail.status === "Active" ? "default" : "secondary"}>
                  {mockAPIKeyDetail.status}
                </Badge>
              </div>
            </div>

            {/* API Key Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>API Key Details</CardTitle>
                <CardDescription>Overview of key metadata and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Campaign Type</div>
                    <div className="font-medium">{mockAPIKeyDetail.campaignType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Created On</div>
                    <div className="font-medium">{mockAPIKeyDetail.createdOn}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Last Used</div>
                    <div className="font-medium">{mockAPIKeyDetail.lastUsed}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Created By</div>
                    <div className="font-medium">{mockAPIKeyDetail.createdBy}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground mb-1">Scopes / Permissions</div>
                    <div className="flex gap-2 flex-wrap">
                      {mockAPIKeyDetail.scopes.map((scope, index) => (
                        <Badge key={index} variant="outline">{scope}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Launches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalLaunches}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Pauses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalPauses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Failures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{mockStats.totalFailures}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockStats.successRate}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Associated Campaigns */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Associated Campaigns</CardTitle>
                    <CardDescription>
                      All campaigns this API key has interacted with. Use individual controls to manage each campaign or global controls to affect all at once.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setGlobalPauseDialogOpen(true)}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Global Pause All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Launch Type</TableHead>
                      <TableHead>Last Action</TableHead>
                      <TableHead>Action Status</TableHead>
                      <TableHead>Next Scheduled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssociatedCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{campaign.launchType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium capitalize">{campaign.lastAction}</div>
                            <div className="text-muted-foreground">{campaign.actionTimestamp}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {campaign.actionStatus === "success" ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Success
                            </div>
                          ) : (
                            <div className="flex items-center text-destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Failed
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{campaign.nextScheduled}</TableCell>
                        <TableCell>
                          <Badge variant={
                            campaign.status === "Active" ? "default" : 
                            campaign.status === "Paused" ? "secondary" : 
                            "destructive"
                          }>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {campaign.status === "Active" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePauseCampaign(campaign)}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : campaign.status === "Paused" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePauseCampaign(campaign)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : null}
                            {campaign.status === "Failed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRelaunch(campaign)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReschedule(campaign)}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* API Activity Log */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API Activity Log</CardTitle>
                    <CardDescription>
                      Recent API actions performed with this key
                    </CardDescription>
                  </div>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="launch">Launch</SelectItem>
                      <SelectItem value="pause">Pause</SelectItem>
                      <SelectItem value="schedule change">Schedule Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditLog.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.campaign}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          {log.status === "success" ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Success
                            </div>
                          ) : (
                            <div className="flex items-center text-destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Failed
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Pause Dialog */}
      <AlertDialog open={globalPauseDialogOpen} onOpenChange={setGlobalPauseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause All Campaigns?</AlertDialogTitle>
            <AlertDialogDescription>
              This will pause all active campaigns associated with this API key. Campaigns can be resumed individually or globally later. This action is reversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGlobalPause}>Pause All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Individual Pause/Resume Dialog */}
      <AlertDialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCampaign?.status === "Active" ? "Pause" : "Resume"} Campaign?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCampaign?.status === "Active" 
                ? `This will pause the campaign "${selectedCampaign?.name}". You can resume it later from this interface.`
                : `This will resume the campaign "${selectedCampaign?.name}" and activate any scheduled sends.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPause}>
              {selectedCampaign?.status === "Active" ? "Pause" : "Resume"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Relaunch Dialog */}
      <AlertDialog open={relaunchDialogOpen} onOpenChange={setRelaunchDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Relaunch Failed Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will attempt to relaunch the campaign "{selectedCampaign?.name}" that previously failed. Make sure the issue causing the failure has been resolved before relaunching.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRelaunch}>Relaunch</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Campaign</DialogTitle>
            <DialogDescription>
              Change the scheduled send date and time for "{selectedCampaign?.name}". This will override any existing schedule. The campaign will be sent at the new date and time you specify.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>
            <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Rescheduling will affect the delivery time. Ensure the new schedule aligns with your campaign goals and audience timezone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReschedule}>Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Log Dialog */}
      <AuditLogDialog
        open={auditLogDialogOpen}
        onOpenChange={setAuditLogDialogOpen}
      />
    </div>
  );
}
