import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp, Play, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// Mocked data
const MOCK_TABLES = ["customers", "orders", "events", "products", "sessions"];
const MOCK_SCHEMAS = ["public", "marketing", "sales", "analytics"];

const MOCK_AMBIGUITY_OPTIONS = [
  {
    id: "status_active",
    title: "Active = status = 'active'",
    description: "Users whose status column equals 'active'.",
  },
  {
    id: "last_login_30d",
    title: "Active = last_login in last 30 days",
    description: "Users who logged in at least once in the last 30 days.",
  },
  {
    id: "lifecycle_engaged",
    title: "Active = lifecycle_stage = 'engaged'",
    description: "Users in the 'engaged' lifecycle stage.",
  },
];

const SAVED_PREFERENCES = [
  {
    id: "high_value",
    label: "High-value customers",
    query: "Show me customers who spent more than $500 in the last 90 days",
    recommended: true,
  },
  {
    id: "inactive",
    label: "Inactive users",
    query: "Find users who haven't logged in for 60 days but were active before",
    recommended: true,
  },
  {
    id: "recent_purchasers",
    label: "Recent purchasers",
    query: "Customers who made a purchase in the last 7 days",
    recommended: true,
  },
  {
    id: "engaged_non_buyers",
    label: "Engaged non-buyers",
    query: "Users with more than 5 sessions but no orders",
    recommended: false,
  },
  {
    id: "demo_ambiguity",
    label: "Demo: Active customers (ambiguous)",
    query: "Show me active high-value customers from the last 30 days",
    recommended: false,
  },
];

const MOCK_SQL = `SELECT 
  c.customer_id,
  c.email,
  c.status,
  c.last_login,
  SUM(o.total_amount) as total_spend
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.last_login >= NOW() - INTERVAL '30 days'
  AND c.status = 'active'
GROUP BY c.customer_id, c.email, c.status, c.last_login
HAVING SUM(o.total_amount) > 100
ORDER BY total_spend DESC
LIMIT 1000;`;

const MOCK_PREVIEW_DATA = [
  { customer_id: "C001", email: "alice@example.com", status: "active", last_login: "2025-12-14", total_spend: "$2,450" },
  { customer_id: "C002", email: "bob@example.com", status: "active", last_login: "2025-12-13", total_spend: "$1,890" },
  { customer_id: "C003", email: "carol@example.com", status: "active", last_login: "2025-12-12", total_spend: "$1,650" },
  { customer_id: "C004", email: "david@example.com", status: "active", last_login: "2025-12-11", total_spend: "$1,420" },
  { customer_id: "C005", email: "eva@example.com", status: "active", last_login: "2025-12-10", total_spend: "$1,180" },
  { customer_id: "C006", email: "frank@example.com", status: "active", last_login: "2025-12-09", total_spend: "$980" },
  { customer_id: "C007", email: "grace@example.com", status: "active", last_login: "2025-12-08", total_spend: "$850" },
];

type FlowState = "input" | "ambiguity" | "result";

export default function AudienceCreatePOC() {
  const navigate = useNavigate();
  
  // Form state
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");
  
  // Flow state
  const [flowState, setFlowState] = useState<FlowState>("input");
  const [selectedAmbiguity, setSelectedAmbiguity] = useState<string>("");
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [sqlCode, setSqlCode] = useState(MOCK_SQL);
  const [previewHighlight, setPreviewHighlight] = useState(false);

  const handleGenerateSQL = () => {
    // Always show ambiguity panel for POC
    setFlowState("ambiguity");
  };

  const handleUseThisMeaning = () => {
    setFlowState("result");
    setSqlCode(MOCK_SQL);
  };

  const handleCancelAmbiguity = () => {
    setFlowState("input");
    setSelectedAmbiguity("");
  };

  const handleRunMock = () => {
    setPreviewHighlight(true);
    setTimeout(() => setPreviewHighlight(false), 1000);
  };

  const handleTableToggle = (table: string) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const getExplanationBullets = () => {
    const selected = MOCK_AMBIGUITY_OPTIONS.find(o => o.id === selectedAmbiguity);
    return [
      `You asked: "${naturalLanguageQuery || 'show me active customers from the last 30 days'}"`,
      `Selected tables: ${selectedTables.length > 0 ? selectedTables.join(", ") : "customers, orders"}`,
      `You chose: ${selected?.title || "Active = last_login in last 30 days"}`,
      "MG-AI joined customers with orders on customers.customer_id = orders.customer_id.",
      "Applied filter: last_login >= 30 days ago.",
      "Added aggregation: total_spend > $100.",
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/people/audience")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Create Audience</h1>
              <p className="text-sm text-muted-foreground">People &gt; Audience &gt; Create Audience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="ai-sql" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="ai-sql" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI – SQL
            </TabsTrigger>
            <TabsTrigger value="manual" disabled className="opacity-50">
              Manual SQL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-sql" className="space-y-6">
            {/* 1. Data Selection Row */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Data Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tables Multi-select */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Tables <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px] bg-background">
                      {MOCK_TABLES.map((table) => (
                        <Badge
                          key={table}
                          variant={selectedTables.includes(table) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedTables.includes(table) 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          )}
                          onClick={() => handleTableToggle(table)}
                        >
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Schema Dropdown */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Schema <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Select value={selectedSchema} onValueChange={setSelectedSchema}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select schema..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {MOCK_SCHEMAS.map((schema) => (
                          <SelectItem key={schema} value={schema}>
                            {schema}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Select the table(s) and optional schema. If you're unsure about the schema, just pick the table.
                </p>
              </CardContent>
            </Card>

            {/* 2. Natural Language Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Describe your audience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Preferences */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Saved Preferences
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SAVED_PREFERENCES.map((pref) => (
                      <Badge
                        key={pref.id}
                        variant="outline"
                        className={cn(
                          "cursor-pointer transition-all hover:bg-muted px-3 py-1.5",
                          pref.recommended && "border-primary/50 bg-primary/5",
                          naturalLanguageQuery === pref.query && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => setNaturalLanguageQuery(pref.query)}
                      >
                        {pref.recommended && <Sparkles className="h-3 w-3 mr-1.5 text-primary" />}
                        {pref.label}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Recommended prompts include built-in time constraints for faster queries.
                  </p>
                </div>

                <Textarea
                  placeholder="Example: Show me active high-value customers from the last 30 days."
                  className="min-h-[120px] resize-none text-base"
                  value={naturalLanguageQuery}
                  onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerateSQL}
                    disabled={selectedTables.length === 0}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate SQL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 3. Ambiguity Panel */}
            {flowState === "ambiguity" && (
              <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-amber-700 dark:text-amber-400">
                    We need a quick clarification
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your request could mean different things. What did you mean?
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={selectedAmbiguity} 
                    onValueChange={setSelectedAmbiguity}
                    className="space-y-3"
                  >
                    {MOCK_AMBIGUITY_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                          selectedAmbiguity === option.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-background hover:border-muted-foreground/30"
                        )}
                      >
                        <RadioGroupItem value={option.id} className="mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{option.title}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={handleCancelAmbiguity}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUseThisMeaning}
                      disabled={!selectedAmbiguity}
                    >
                      Use this meaning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 4 & 5 & 6. Result Section */}
            {flowState === "result" && (
              <>
                {/* Explanation Box (Collapsible) */}
                <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            How MG-AI generated this SQL
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                            {isExplanationOpen ? (
                              <>Hide details <ChevronUp className="h-4 w-4" /></>
                            ) : (
                              <>Show details <ChevronDown className="h-4 w-4" /></>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <ul className="space-y-2 text-sm">
                            {getExplanationBullets().map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary mt-1.5">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                {/* SQL Editor */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Generated SQL</CardTitle>
                      <Button onClick={handleRunMock} className="gap-2" size="sm">
                        <Play className="h-4 w-4" />
                        Run (mock)
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={sqlCode}
                      onChange={(e) => setSqlCode(e.target.value)}
                      className="font-mono text-sm min-h-[200px] bg-muted/30"
                    />
                  </CardContent>
                </Card>

                {/* Preview Table */}
                <Card className={cn(
                  "transition-all duration-300",
                  previewHighlight && "ring-2 ring-primary"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Preview results</CardTitle>
                      <Badge variant="secondary">{MOCK_PREVIEW_DATA.length} rows</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">customer_id</TableHead>
                            <TableHead className="font-semibold">email</TableHead>
                            <TableHead className="font-semibold">status</TableHead>
                            <TableHead className="font-semibold">last_login</TableHead>
                            <TableHead className="font-semibold text-right">total_spend</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {MOCK_PREVIEW_DATA.map((row) => (
                            <TableRow key={row.customer_id}>
                              <TableCell className="font-mono text-xs">{row.customer_id}</TableCell>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                                  {row.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{row.last_login}</TableCell>
                              <TableCell className="text-right font-medium">{row.total_spend}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => navigate("/people/audience")}>
                    Cancel
                  </Button>
                  <Button>
                    Save Audience
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Manual SQL editor coming soon...
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
