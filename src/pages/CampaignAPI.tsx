import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, RotateCw, Trash2, Eye, Copy, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "@/hooks/use-toast";

interface APIKey {
  id: string;
  name: string;
  description: string;
  status: "active" | "revoked";
  scopes: string[];
  lastUsed: string;
  createdOn: string;
  key?: string;
}

const mockAPIKeys: APIKey[] = [
  {
    id: "1",
    name: "Airflow–Prod",
    description: "Production Airflow integration for automated campaign launches",
    status: "active",
    scopes: ["Can launch campaigns via API", "Can change campaign schedules via API"],
    lastUsed: "2025-11-26 14:23:45",
    createdOn: "2025-10-15 09:30:00",
  },
  {
    id: "2",
    name: "Dev Testing",
    description: "Development environment testing key",
    status: "active",
    scopes: ["Can launch campaigns via API"],
    lastUsed: "2025-11-25 16:10:22",
    createdOn: "2025-11-01 11:00:00",
  },
  {
    id: "3",
    name: "Legacy Integration",
    description: "Old integration - to be removed",
    status: "revoked",
    scopes: ["Can launch campaigns via API", "Can change campaign schedules via API"],
    lastUsed: "2025-09-15 08:45:12",
    createdOn: "2025-01-10 14:20:00",
  },
];

const CampaignAPI = () => {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scopes: [] as string[],
  });

  const scopeOptions = [
    { id: "launch", label: "Can launch campaigns via API" },
    { id: "schedule", label: "Can change campaign schedules via API" },
  ];

  const filteredKeys = apiKeys.filter(
    (key) =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateKey = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Key name is required",
        variant: "destructive",
      });
      return;
    }

    const newKey: APIKey = {
      id: String(Date.now()),
      name: formData.name,
      description: formData.description,
      status: "active",
      scopes: formData.scopes,
      lastUsed: "Never",
      createdOn: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    const generatedSecret = `mg_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(generatedSecret);
    setApiKeys([...apiKeys, newKey]);
    setCreateDialogOpen(false);
    setNewKeyDialogOpen(true);
    setFormData({ name: "", description: "", scopes: [] });
  };

  const handleRevokeKey = () => {
    if (selectedKey) {
      setApiKeys(
        apiKeys.map((key) =>
          key.id === selectedKey.id ? { ...key, status: "revoked" as const } : key
        )
      );
      toast({
        title: "API Key Revoked",
        description: `Key "${selectedKey.name}" has been revoked`,
      });
      setRevokeDialogOpen(false);
    }
  };

  const handleRotateKey = () => {
    const newSecret = `mg_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(newSecret);
    toast({
      title: "API Key Rotated",
      description: `New key generated for "${selectedKey?.name}"`,
    });
    setRotateDialogOpen(false);
    setNewKeyDialogOpen(true);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "API key has been copied",
    });
  };

  const toggleScope = (scopeId: string) => {
    const scopeLabel = scopeOptions.find((s) => s.id === scopeId)?.label || "";
    setFormData((prev) => ({
      ...prev,
      scopes: prev.scopes.includes(scopeLabel)
        ? prev.scopes.filter((s) => s !== scopeLabel)
        : [...prev.scopes, scopeLabel],
    }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CampaignSidebar />
      
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">Campaign API</h1>
                <p className="text-sm text-muted-foreground">
                  Manage API keys for campaign launch and scheduling control
                </p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search API keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {key.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.status === "active" ? "default" : "secondary"}>
                        {key.status === "active" ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {key.scopes.map((scope, idx) => (
                          <span key={idx} className="text-xs text-muted-foreground">
                            • {scope}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {key.lastUsed}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {key.createdOn}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/campaign-api/${key.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {key.status === "active" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedKey(key);
                                setRotateDialogOpen(true);
                              }}
                            >
                              <RotateCw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedKey(key);
                                setRevokeDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Create API Key Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for external campaign management
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name *</Label>
              <Input
                id="key-name"
                placeholder="e.g., Airflow-Prod"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this key used for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Scopes / Permissions</Label>
              {scopeOptions.map((scope) => (
                <div key={scope.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={scope.id}
                    checked={formData.scopes.includes(scope.label)}
                    onCheckedChange={() => toggleScope(scope.id)}
                  />
                  <label
                    htmlFor={scope.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {scope.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Key Generated Dialog */}
      <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Save this key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm font-mono break-all flex-1">{generatedKey}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyKey}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                <strong>Warning:</strong> Make sure to copy your API key now. You won't be able
                to see it again!
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setNewKeyDialogOpen(false)}>I've Saved the Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently revoke the API key "{selectedKey?.name}". Any applications
              using this key will immediately lose access. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeKey} className="bg-destructive text-destructive-foreground">
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rotate Confirmation */}
      <AlertDialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rotate API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new API key for "{selectedKey?.name}". The old key will be
              immediately invalidated. Make sure to update all applications using this key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRotateKey}>Generate New Key</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignAPI;
