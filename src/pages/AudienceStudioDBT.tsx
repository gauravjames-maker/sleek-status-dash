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
  Users,
  Settings, 
  Pencil, 
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  GitBranch,
  Layers,
  Sparkles
} from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  mockParentModels, 
  mockAudiences, 
  mockWarehouseTables,
  mockDBTConnection,
  audienceTemplates,
  type DBTParentModel, 
  type DBTAudience,
  type WarehouseTable,
} from "@/types/dbt-studio";
import { DBTConnectionCard } from "@/components/dbt-studio/DBTConnectionCard";
import { ParentModelSetup } from "@/components/dbt-studio/ParentModelSetup";
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
  const [activeTab, setActiveTab] = useState("audiences");
  const [searchQuery, setSearchQuery] = useState("");
  const [parentModels, setParentModels] = useState<DBTParentModel[]>(mockParentModels);
  const [audiences, setAudiences] = useState<DBTAudience[]>(mockAudiences);
  const [warehouseTables] = useState<WarehouseTable[]>(mockWarehouseTables);
  const [deleteAudience, setDeleteAudience] = useState<DBTAudience | null>(null);
  const [runningAudience, setRunningAudience] = useState<string | null>(null);

  const filteredAudiences = audiences.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: DBTAudience['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'running':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Running</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
    }
  };

  const handleRunAudience = async (audience: DBTAudience) => {
    setRunningAudience(audience.id);
    setTimeout(() => {
      setAudiences(prev => prev.map(a => 
        a.id === audience.id 
          ? { ...a, status: 'active' as const, lastRun: new Date().toISOString() }
          : a
      ));
      setRunningAudience(null);
    }, 3000);
  };

  const handleDeleteAudience = () => {
    if (deleteAudience) {
      setAudiences(prev => prev.filter(a => a.id !== deleteAudience.id));
      setDeleteAudience(null);
    }
  };

  const handleSaveParentModel = (model: DBTParentModel) => {
    setParentModels(prev => {
      const exists = prev.find(p => p.id === model.id);
      if (exists) {
        return prev.map(p => p.id === model.id ? model : p);
      }
      return [...prev, model];
    });
  };

  const totalAudience = audiences.reduce((sum, a) => sum + a.estimatedSize, 0);
  const activeAudiences = audiences.filter(a => a.status === 'active').length;

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
              New Audience
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Parent Models</CardDescription>
                <CardTitle className="text-3xl">{parentModels.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Audiences</CardDescription>
                <CardTitle className="text-3xl">{audiences.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Audiences</CardDescription>
                <CardTitle className="text-3xl text-green-600">{activeAudiences}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Reach</CardDescription>
                <CardTitle className="text-3xl">{totalAudience.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="audiences" className="gap-2"><Users className="w-4 h-4" />Audiences</TabsTrigger>
              <TabsTrigger value="schema" className="gap-2"><Database className="w-4 h-4" />Schema Setup</TabsTrigger>
              <TabsTrigger value="settings" className="gap-2"><Settings className="w-4 h-4" />Settings</TabsTrigger>
            </TabsList>

            {/* Audiences Tab */}
            <TabsContent value="audiences">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Audiences List */}
                <div className="lg:col-span-3">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search audiences..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="pl-10" 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Audience Name</TableHead>
                          <TableHead>Parent Model</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Run</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAudiences.map((audience) => (
                          <TableRow key={audience.id} className="group">
                            <TableCell>
                              <div>
                                <p className="font-medium">{audience.name}</p>
                                <p className="text-xs text-muted-foreground">{audience.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                <Layers className="w-3 h-3" />
                                {audience.parentModelName}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {audience.estimatedSize.toLocaleString()}
                            </TableCell>
                            <TableCell>{getStatusBadge(audience.status)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {audience.lastRun 
                                ? formatDistanceToNow(new Date(audience.lastRun), { addSuffix: true })
                                : 'Never'
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/people/audience-studio-dbt/builder?id=${audience.id}`)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleRunAudience(audience)}
                                  disabled={runningAudience === audience.id}
                                >
                                  {runningAudience === audience.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteAudience(audience)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredAudiences.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No audiences found. Create your first audience to get started.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Templates Sidebar */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Quick Templates
                      </CardTitle>
                      <CardDescription>Start with pre-built segments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {audienceTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => navigate(`/people/audience-studio-dbt/builder?template=${template.id}`)}
                          className="w-full p-3 text-left rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Schema Setup Tab (Admin) */}
            <TabsContent value="schema">
              <ParentModelSetup
                parentModels={parentModels}
                warehouseTables={warehouseTables}
                onSaveModel={handleSaveParentModel}
                onDeleteModel={(id) => setParentModels(prev => prev.filter(p => p.id !== id))}
              />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DBTConnectionCard 
                  connection={mockDBTConnection} 
                  onConnect={() => {}}
                  onDisconnect={() => {}}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">GitHub Integration</CardTitle>
                    <CardDescription>Push dbt models to your repository</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <GitBranch className="w-4 h-4 mr-2" />
                      Connect GitHub
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={!!deleteAudience} onOpenChange={() => setDeleteAudience(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteAudience?.name}"? This will also remove the associated dbt model.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAudience} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AudienceStudioDBT;
