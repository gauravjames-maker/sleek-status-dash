import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Code, Sparkles, Check, ChevronsUpDown, Search, ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { useToast } from "@/hooks/use-toast";
import GPTTokenDialog from "@/components/GPTTokenDialog";
import { cn } from "@/lib/utils";

// Mock table data
const mockTables = [
  { name: "users", schema: "public", columns: ["id", "email", "created_at", "status"] },
  { name: "orders", schema: "public", columns: ["id", "user_id", "amount", "status"] },
  { name: "products", schema: "public", columns: ["id", "name", "price", "category"] },
  { name: "subscriptions", schema: "public", columns: ["id", "user_id", "plan", "start_date"] },
];

// Sample audience name suggestions
const audienceNameSuggestions = [
  "Active Users",
  "Premium Subscribers",
  "Inactive Users (30 days)",
  "High Value Customers",
  "Trial Users",
  "Churned Customers",
  "New Sign-ups",
  "Power Users",
  "Recent Purchasers",
  "Newsletter Subscribers",
];

// Example prompts for demo purposes
const examplePrompts = [
  {
    label: "High-value customers",
    prompt: "Show me all users who have placed more than 3 orders with a total amount greater than $500, ordered by total spend descending",
  },
  {
    label: "Inactive users",
    prompt: "Find all users who signed up more than 30 days ago but haven't placed any orders yet",
  },
  {
    label: "Recent active subscribers",
    prompt: "Get all users with active subscriptions that started in the last 90 days, sorted by start date",
  },
  {
    label: "At-risk customers",
    prompt: "Show users who had orders in the last 6 months but none in the last 60 days",
  },
  {
    label: "Premium segment",
    prompt: "Find users with status 'active' who have a premium subscription plan and have made at least 2 purchases this year",
  },
];

const mockData = {
  users: [
    { id: 1, email: "user1@example.com", created_at: "2024-01-01", status: "active" },
    { id: 2, email: "user2@example.com", created_at: "2024-01-02", status: "active" },
    { id: 3, email: "user3@example.com", created_at: "2024-01-03", status: "inactive" },
  ],
  orders: [
    { id: 1, user_id: 1, amount: 99.99, status: "completed" },
    { id: 2, user_id: 2, amount: 149.99, status: "completed" },
    { id: 3, user_id: 1, amount: 79.99, status: "pending" },
  ],
};

const AudienceCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [audienceName, setAudienceName] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [openNameCombo, setOpenNameCombo] = useState(false);
  const [openTableCombo, setOpenTableCombo] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const generateSQLFromNaturalLanguage = async () => {
    const token = sessionStorage.getItem("gpt_token");
    
    if (!token) {
      setShowTokenDialog(true);
      return;
    }

    if (!selectedTable || !naturalLanguageQuery) {
      toast({
        title: "Missing Information",
        description: "Please select a table and enter your query.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a SQL expert. Convert natural language queries to SQL. The available table is "${selectedTable}" with the following structure:
${selectedTable === "users" ? "Columns: id (int), email (text), created_at (date), status (text)" : ""}
${selectedTable === "orders" ? "Columns: id (int), user_id (int), amount (decimal), status (text)" : ""}
Only return the SQL query, nothing else.`,
            },
            {
              role: "user",
              content: naturalLanguageQuery,
            },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate SQL");
      }

      const data = await response.json();
      const generatedSQL = data.choices[0].message.content.trim();
      
      // Clean up the SQL (remove markdown code blocks if present)
      const cleanSQL = generatedSQL
        .replace(/```sql\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      setSqlQuery(cleanSQL);
      
      toast({
        title: "SQL Generated",
        description: "Your query has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating SQL:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate SQL query. Please check your token and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const executeQuery = () => {
    if (!sqlQuery) {
      toast({
        title: "No Query",
        description: "Please enter or generate a SQL query first.",
        variant: "destructive",
      });
      return;
    }

    // Mock execution - in real app this would call backend
    const mockResult = mockData[selectedTable as keyof typeof mockData] || [];
    setPreviewData(mockResult);
    setShowPreviewDialog(true);
    setSearchTerm("");
    setSortColumn("");
    
    toast({
      title: "Query Executed",
      description: `Found ${mockResult.length} results.`,
    });
  };

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    if (!previewData.length) return [];

    let filtered = previewData;

    // Apply search filter
    if (searchTerm) {
      filtered = previewData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [previewData, searchTerm, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const useExamplePrompt = (prompt: string) => {
    setNaturalLanguageQuery(prompt);
  };

  const handleSave = () => {
    if (!audienceName || !sqlQuery) {
      toast({
        title: "Missing Information",
        description: "Please provide an audience name and SQL query.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Audience Created",
      description: `"${audienceName}" has been created successfully.`,
    });
    
    navigate("/people/audience");
  };

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/people/audience")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Create Audience</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Use AI or write SQL queries to define your audience
                </p>
              </div>
            </div>
            <Button onClick={handleSave}>Save Audience</Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audience-name">Audience Name</Label>
                  <Popover open={openNameCombo} onOpenChange={setOpenNameCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openNameCombo}
                        className="w-full justify-between mt-2"
                      >
                        {audienceName || "Select or type audience name..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 z-50 bg-popover" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search or type audience name..."
                          value={audienceName}
                          onValueChange={setAudienceName}
                        />
                        <CommandList>
                          <CommandEmpty>Type to create a custom name</CommandEmpty>
                          <CommandGroup>
                            {audienceNameSuggestions
                              .filter((name) =>
                                name.toLowerCase().includes(audienceName.toLowerCase())
                              )
                              .map((name) => (
                                <CommandItem
                                  key={name}
                                  value={name}
                                  onSelect={(currentValue) => {
                                    setAudienceName(currentValue);
                                    setOpenNameCombo(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      audienceName === name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="table-select">Select Table</Label>
                  <Popover open={openTableCombo} onOpenChange={setOpenTableCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTableCombo}
                        className="w-full justify-between mt-2"
                      >
                        {selectedTable
                          ? mockTables.find((table) => table.name === selectedTable)?.name
                          : "Select or search table..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 z-50 bg-popover" align="start">
                      <Command>
                        <CommandInput placeholder="Search table..." />
                        <CommandList>
                          <CommandEmpty>No table found.</CommandEmpty>
                          <CommandGroup>
                            {mockTables.map((table) => (
                              <CommandItem
                                key={table.name}
                                value={table.name}
                                onSelect={(currentValue) => {
                                  setSelectedTable(currentValue);
                                  setOpenTableCombo(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTable === table.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">{table.schema}.{table.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {table.columns.join(", ")}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Tabs defaultValue="ai-sql" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai-sql">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI - SQL
                </TabsTrigger>
                <TabsTrigger value="manual-sql">
                  <Code className="h-4 w-4 mr-2" />
                  Manual SQL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-sql" className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-6">
                  <Label htmlFor="natural-query">Describe Your Audience</Label>
                  <Textarea
                    id="natural-query"
                    placeholder="e.g., Show me all active users who signed up in the last 30 days"
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                  
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">Try these examples:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {examplePrompts.map((example) => (
                        <Button
                          key={example.label}
                          variant="outline"
                          size="sm"
                          onClick={() => useExamplePrompt(example.prompt)}
                          className="text-xs"
                        >
                          {example.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateSQLFromNaturalLanguage}
                    disabled={isGenerating}
                    className="mt-4"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate SQL"}
                  </Button>
                </div>

                {sqlQuery && (
                  <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                    <Label>Generated SQL Query</Label>
                    <Textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="mt-2 font-mono text-sm min-h-[120px]"
                    />
                    <Button onClick={executeQuery} variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Preview Results
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manual-sql" className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                  <Label htmlFor="manual-query">SQL Query</Label>
                  <Textarea
                    id="manual-query"
                    placeholder="SELECT * FROM users WHERE status = 'active'"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="mt-2 font-mono text-sm min-h-[200px]"
                  />
                  <Button onClick={executeQuery} variant="outline" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Preview Results
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <GPTTokenDialog open={showTokenDialog} onOpenChange={setShowTokenDialog} />
      
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col z-50">
          <DialogHeader>
            <DialogTitle>Query Results</DialogTitle>
            <DialogDescription>
              {filteredAndSortedData.length} of {previewData.length} records
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto border border-border rounded-lg">
            {filteredAndSortedData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(filteredAndSortedData[0]).map((key) => (
                      <TableHead key={key}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(key)}
                          className="h-8 px-2 flex items-center gap-1"
                        >
                          {key}
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((row, idx) => (
                    <TableRow key={idx}>
                      {Object.values(row).map((value: any, cellIdx) => (
                        <TableCell key={cellIdx}>{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AudienceCreate;
