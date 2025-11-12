import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Network, ChevronLeft, RefreshCw, Target as TargetIcon, Split, Plus, X, Undo, Redo, BarChart3, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type NodeType = "start" | "target" | "split" | null;

interface FlowNode {
  id: string;
  type: NodeType;
  name?: string;
}

const BlueprintBuilder = () => {
  const navigate = useNavigate();
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: "start", type: "start" }
  ]);

  const handleAddNode = (type: NodeType) => {
    if (type === "target") {
      setSelectedNodeType("target");
      setShowSidePanel(true);
    } else if (type === "split") {
      setSelectedNodeType("split");
      setShowSidePanel(true);
    }
    setShowNodeMenu(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CampaignSidebar />
      
      <main className="flex-1 overflow-hidden bg-background flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80"
                onClick={() => navigate("/people/blueprints")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Blueprints
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Network className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Gaurav→EXP1</div>
                  <div className="text-xs text-muted-foreground">click to add description</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Blueprint Snapshot</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                    #FASTCACHE►
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Enable Blueprint Snapshot</span>
                <Switch />
              </div>
              <Button variant="outline">Preview</Button>
              <Button className="bg-primary text-primary-foreground">Save</Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border bg-card px-6 flex gap-6 flex-shrink-0">
          <button className="pb-3 border-b-2 border-primary font-medium text-sm">
            Data Settings
          </button>
          <button className="pb-3 border-b-2 border-transparent font-medium text-sm text-muted-foreground hover:text-foreground">
            Blueprint
          </button>
          <button className="pb-3 border-b-2 border-transparent font-medium text-sm text-muted-foreground hover:text-foreground">
            Blueprint Snapshot Settings
          </button>
        </div>

        {/* Toolbar */}
        <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-primary text-primary-foreground">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh count
            </Button>
            <span className="text-sm text-muted-foreground">Last counted: -</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <TargetIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              Create campaign or chain
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-muted/20 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Starting Population Card */}
            <Card className="p-6 mb-6 border-2 border-primary">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <Network className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Starting population</h3>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-muted-foreground mb-1">Audience</div>
                      <div className="flex items-center gap-1">
                        <Network className="h-3 w-3" />
                        <span className="font-medium">SingleStore Large Audience ...</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Data variables</div>
                      <div className="font-medium">1</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Total users</div>
                      <div className="font-medium">-</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Last counted</div>
                      <div className="font-medium">-</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-muted-foreground text-sm mb-1">Labels</div>
                    <div className="font-medium">-</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Add Node Button */}
            <div className="flex justify-center mb-6 relative">
              <Button
                className="rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                size="icon"
                onClick={() => setShowNodeMenu(!showNodeMenu)}
              >
                <Plus className="h-5 w-5" />
              </Button>

              {/* Node Menu */}
              {showNodeMenu && (
                <Card className="absolute top-12 z-10 p-2 shadow-lg min-w-[200px]">
                  <button
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded transition-colors"
                    onClick={() => handleAddNode("target")}
                  >
                    <div className="w-10 h-10 bg-green-500/10 rounded flex items-center justify-center">
                      <TargetIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium">Target</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded transition-colors"
                    onClick={() => handleAddNode("split")}
                  >
                    <div className="w-10 h-10 bg-purple-500/10 rounded flex items-center justify-center">
                      <Split className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Split</span>
                  </button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Side Panel - Target */}
      <Sheet open={showSidePanel && selectedNodeType === "target"} onOpenChange={setShowSidePanel}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TargetIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-xl">Target</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  Create segments with a mutually exclusive set of criteria that a recipient must meet to qualify
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Node name</label>
              <Input placeholder="Enter node name" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Limit the number of recipients in this node</span>
                <button className="text-muted-foreground">ⓘ</button>
              </div>
              <Switch />
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                  <Input placeholder="Enter segment name" className="font-medium" />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Network className="h-4 w-4" />
                  <span>0</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  Labels <button className="text-muted-foreground">ⓘ</button>
                </label>
                <Button variant="outline" size="sm">Add label</Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Users who</span>
                  <Select defaultValue="meet">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meet">meet</SelectItem>
                      <SelectItem value="dont-meet">don't meet</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">
                    all
                  </Button>
                  <Select defaultValue="any">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">any</SelectItem>
                      <SelectItem value="all">all</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm">of the following rules...</span>
                </div>

                <div className="border rounded p-3 space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Enter value" className="flex-1" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="link" size="sm" className="text-primary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add rule
                  </Button>
                  <Button variant="link" size="sm" className="text-primary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add group
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSidePanel(false)}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground">Add segment</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Side Panel - Split */}
      <Sheet open={showSidePanel && selectedNodeType === "split"} onOpenChange={setShowSidePanel}>
        <SheetContent className="w-[500px] sm:w-[600px]">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Split className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-xl">Split</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  Divide audience by percentage or specific number
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Split Type</label>
              <Select defaultValue="percentage">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">By Percentage</SelectItem>
                  <SelectItem value="number">By Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowSidePanel(false)}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground">Add to Blueprint</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BlueprintBuilder;
