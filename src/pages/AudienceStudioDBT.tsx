import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Database, 
  Play, 
  Settings, 
  Pencil, 
  Trash2,
  RefreshCw,
  GitBranch,
  Cloud,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ExternalLink
} from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDBTModels, mockDBTConnection, type DBTModel, type DBTConnection } from "@/types/dbt-studio";
import { DBTConnectionCard } from "@/components/dbt-studio/DBTConnectionCard";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AudienceStudioDBT = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("models");
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<DBTModel[]>(mockDBTModels);
  const [connection, setConnection] = useState<DBTConnection | null>(mockDBTConnection);
  const [deleteModel, setDeleteModel] = useState<DBTModel | null>(null);
  const [runningModel, setRunningModel] = useState<string | null>(null);

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: DBTModel['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-status-completed-bg text-green-700 border-0"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'running':
        return <Badge className="bg-status-sending-bg text-amber-700 border-0"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Running</Badge>;
      case 'error':
        return <Badge className="bg-status-failed-bg text-red-700 border-0"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
    }
  };

  const handleRunModel = async (model: DBTModel) => {
    setRunningModel(model.id);
    // Simulate running
    setTimeout(() => {
      setModels(prev => prev.map(m => 
        m.id === model.id 
          ? { ...m, status: 'active' as const, lastRun: new Date().toISOString() }
          : m
      ));
      setRunningModel(null);
    }, 3000);
  };

  const handleDeleteModel = () => {
    if (deleteModel) {
      setModels(prev => prev.filter(m => m.id !== deleteModel.id));
      setDeleteModel(null);
    }
  };

  const totalAudience = models.reduce((sum, m) => sum + (m.audienceCount || 0), 0);
  const activeModels = models.filter(m => m.status === 'active').length;
  const errorModels = models.filter(m => m.status === 'error').length;

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Audience Studio DBT</h1>
                <Badge variant="outline" className="text-xs">Beta</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Build reusable audience segments with dbt models</p>
            </div>
            <Button onClick={() => navigate("/people/audience-studio-dbt/builder")}>
              <Plus className="h-4 w-4 mr-2" />
              New DBT Model
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Models</CardDescription>
                <CardTitle className="text-3xl">{models.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Models</CardDescription>
                <CardTitle className="text-3xl text-green-600">{activeModels}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Audience</CardDescription>
                <CardTitle className="text-3xl">{totalAudience.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Errors</CardDescription>
                <CardTitle className="text-3xl text-red-600">{errorModels}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="models" className="gap-2"><Database className="w-4 h-4" />DBT Models</TabsTrigger>
              <TabsTrigger value="connections" className="gap-2"><Cloud className="w-4 h-4" />Connections</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="w-4 h-4" />Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="models">
              <div className="mb-4 flex items-center justify-between">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search models..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </Button>
              </div>
              
              <div className="bg-card rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Audience Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.map((model) => (
                      <TableRow key={model.id} className="group">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                            {model.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {model.description}
                        </TableCell>
                        <TableCell>
                          {model.audienceCount?.toLocaleString() || '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(model.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {model.lastRun 
                            ? formatDistanceToNow(new Date(model.lastRun), { addSuffix: true })
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => navigate(`/people/audience-studio-dbt/builder?id=${model.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleRunModel(model)}
                              disabled={runningModel === model.id}
                            >
                              {runningModel === model.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteModel(model)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredModels.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No models found. Create your first DBT model to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DBTConnectionCard 
                  connection={connection} 
                  onConnect={() => setConnection(mockDBTConnection)}
                  onDisconnect={() => setConnection(null)}
                />
                
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      dbt Core (Local)
                    </CardTitle>
                    <CardDescription>
                      Connect to a local dbt project for development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Configure Local Connection
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>DBT Settings</CardTitle>
                  <CardDescription>Configure your dbt integration preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Auto-sync models</p>
                      <p className="text-sm text-muted-foreground">Automatically sync model metadata from dbt Cloud</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">GitHub Integration</p>
                      <p className="text-sm text-muted-foreground">Push generated models to your GitHub repository</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Default Warehouse</p>
                      <p className="text-sm text-muted-foreground">Snowflake (connected via dbt Cloud)</p>
                    </div>
                    <Badge variant="outline">Snowflake</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={!!deleteModel} onOpenChange={() => setDeleteModel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Model</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteModel?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AudienceStudioDBT;
