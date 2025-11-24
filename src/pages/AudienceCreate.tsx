import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Code, Sparkles, Check, ChevronsUpDown, Search, ArrowUpDown, X, Info } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Mock schema data
const mockSchemas = [
  { name: "public", description: "Default public schema" },
  { name: "analytics", description: "Analytics and reporting tables" },
  { name: "archive", description: "Historical data archive" },
  { name: "staging", description: "Staging environment tables" },
];

// Mock table data
const mockTables = [
  { name: "users", schema: "public", columns: ["id", "email", "created_at", "status"] },
  { name: "orders", schema: "public", columns: ["id", "user_id", "amount", "status"] },
  { name: "products", schema: "public", columns: ["id", "name", "price", "category"] },
  { name: "subscriptions", schema: "public", columns: ["id", "user_id", "plan", "start_date"] },
  { name: "customers", schema: "analytics", columns: ["id", "name", "segment", "ltv"] },
  { name: "events", schema: "analytics", columns: ["id", "event_type", "timestamp", "user_id"] },
];

// Mock database connections
const mockDatabaseConnections = [
  { id: "db-1", name: "Production Database", type: "PostgreSQL" },
  { id: "db-2", name: "Staging Database", type: "PostgreSQL" },
  { id: "db-3", name: "Analytics Database", type: "MySQL" },
  { id: "db-4", name: "Legacy Database", type: "PostgreSQL" },
  { id: "db-5", name: "Testing Database", type: "PostgreSQL" },
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
  {
    label: "Comprehensive customer profile",
    prompt: "Show me a detailed customer profile including first name, last name, age calculated from date of birth, email, total order amount with tax and shipping, average order value, number of orders, subscription plan type, subscription start and end dates, last purchase date, customer lifetime value, preferred payment method, billing address city and state, account status, loyalty points balance, and customer segment classification (VIP, Regular, New), filtered for customers who have spent more than $1000 in the last 12 months and have an active subscription, grouped by customer segment and ordered by lifetime value descending with a limit of top 100 customers",
  },
];

const mockData = {
  users: [
    { 
      id: 1, 
      first_name: "John",
      last_name: "Anderson", 
      email: "john.anderson@example.com", 
      age: 34,
      total_amount: 1245.67,
      order_count: 8,
      subscription_plan: "Premium",
      customer_segment: "VIP",
      loyalty_points: 2450,
      created_at: "2024-01-01", 
      status: "active" 
    },
    { 
      id: 2, 
      first_name: "Sarah",
      last_name: "Mitchell", 
      email: "sarah.mitchell@example.com", 
      age: 28,
      total_amount: 892.34,
      order_count: 5,
      subscription_plan: "Standard",
      customer_segment: "Regular",
      loyalty_points: 1680,
      created_at: "2024-01-02", 
      status: "active" 
    },
    { 
      id: 3, 
      first_name: "Michael",
      last_name: "Chen", 
      email: "michael.chen@example.com", 
      age: 42,
      total_amount: 2567.89,
      order_count: 15,
      subscription_plan: "Enterprise",
      customer_segment: "VIP",
      loyalty_points: 5890,
      created_at: "2024-01-03", 
      status: "active" 
    },
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
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const [audienceName, setAudienceName] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedSchemas, setSelectedSchemas] = useState<string[]>([]);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [openDatabaseCombo, setOpenDatabaseCombo] = useState(false);
  const [openTableCombo, setOpenTableCombo] = useState(false);
  const [openSchemaCombo, setOpenSchemaCombo] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const generateSQLFromNaturalLanguage = async () => {
    const token = sessionStorage.getItem("gpt_token");
    
    if (!token) {
      setShowTokenDialog(true);
      return;
    }

    if (selectedTables.length === 0 || !naturalLanguageQuery) {
      toast({
        title: "Missing Information",
        description: "Please select at least one table and enter your query.",
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
              content: `You are a SQL expert. Convert natural language queries to SQL. The available tables are: ${selectedTables.join(", ")}. 
Available schemas: ${selectedSchemas.length > 0 ? selectedSchemas.join(", ") : "all"}
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
    const firstTable = selectedTables[0] || "users";
    const mockResult = mockData[firstTable as keyof typeof mockData] || [];
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
            <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">Create Audience</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use AI or write SQL queries to define your audience
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent transition-colors flex items-center gap-1.5 px-3 py-1"
                    onClick={() => setShowInfoDialog(true)}
                  >
                    <Info className="h-3.5 w-3.5" />
                    How SQL AI Works
                  </Badge>
                </div>
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
                  <Label htmlFor="database-connection">Database Connection</Label>
                  <Popover open={openDatabaseCombo} onOpenChange={setOpenDatabaseCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDatabaseCombo}
                        className="w-full justify-between mt-2"
                      >
                        {selectedDatabase
                          ? mockDatabaseConnections.find((db) => db.id === selectedDatabase)?.name
                          : "Select or search database connection..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 z-50 bg-popover" align="start">
                      <Command>
                        <CommandInput placeholder="Search database..." />
                        <CommandList>
                          <CommandEmpty>No database found.</CommandEmpty>
                          <CommandGroup>
                            {mockDatabaseConnections.map((db) => (
                              <CommandItem
                                key={db.id}
                                value={db.id}
                                onSelect={(currentValue) => {
                                  setSelectedDatabase(currentValue);
                                  setOpenDatabaseCombo(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDatabase === db.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div>
                                  <div className="font-medium">{db.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {db.type}
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

                <div>
                  <Label htmlFor="table-select">Select Table (Multiple)</Label>
                  <Popover open={openTableCombo} onOpenChange={setOpenTableCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTableCombo}
                        className="w-full justify-between mt-2 h-auto min-h-[40px]"
                      >
                        <div className="flex flex-wrap gap-1 flex-1">
                          {selectedTables.length > 0 ? (
                            selectedTables.map((tableName) => (
                              <Badge key={tableName} variant="secondary" className="gap-1">
                                {tableName}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTables(selectedTables.filter(t => t !== tableName));
                                  }}
                                />
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">Select tables...</span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 z-50 bg-popover" align="start">
                      <Command>
                        <CommandInput placeholder="Search tables..." />
                        <CommandList>
                          <CommandEmpty>No table found.</CommandEmpty>
                          <CommandGroup>
                            {mockTables.map((table) => (
                              <CommandItem
                                key={table.name}
                                value={table.name}
                                onSelect={(currentValue) => {
                                  setSelectedTables(
                                    selectedTables.includes(currentValue)
                                      ? selectedTables.filter(t => t !== currentValue)
                                      : [...selectedTables, currentValue]
                                  );
                                }}
                              >
                                <Checkbox
                                  checked={selectedTables.includes(table.name)}
                                  className="mr-2"
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

                <div>
                  <Label htmlFor="schema-select">Select Schema (Multiple)</Label>
                  <Popover open={openSchemaCombo} onOpenChange={setOpenSchemaCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSchemaCombo}
                        className="w-full justify-between mt-2 h-auto min-h-[40px]"
                      >
                        <div className="flex flex-wrap gap-1 flex-1">
                          {selectedSchemas.length > 0 ? (
                            selectedSchemas.map((schemaName) => (
                              <Badge key={schemaName} variant="secondary" className="gap-1">
                                {schemaName}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSchemas(selectedSchemas.filter(s => s !== schemaName));
                                  }}
                                />
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">Select schemas...</span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 z-50 bg-popover" align="start">
                      <Command>
                        <CommandInput placeholder="Search schemas..." />
                        <CommandList>
                          <CommandEmpty>No schema found.</CommandEmpty>
                          <CommandGroup>
                            {mockSchemas.map((schema) => (
                              <CommandItem
                                key={schema.name}
                                value={schema.name}
                                onSelect={(currentValue) => {
                                  setSelectedSchemas(
                                    selectedSchemas.includes(currentValue)
                                      ? selectedSchemas.filter(s => s !== currentValue)
                                      : [...selectedSchemas, currentValue]
                                  );
                                }}
                              >
                                <Checkbox
                                  checked={selectedSchemas.includes(schema.name)}
                                  className="mr-2"
                                />
                                <div>
                                  <div className="font-medium">{schema.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {schema.description}
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

      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              How MG - AI Works
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Don't worry if you're not tech-savvy—here's how MG - AI works:
            </p>
            <p>
              Just select the table(s) and schema(s) you want to explore. You can pick one table or many, across schemas if needed. Add all you need to know about which table and schema your data exists in for accurate results. If you are unsure about the schemas, that's also okay—having only the table details will still do the job.
            </p>
            <p>
              Then, simply tell MG - AI in plain English how you'd like to see your audience. MG - AI will do all the hard work, writing the right SQL queries behind the scenes to get you the results you want.
            </p>
            <p>
              If you feel MG - AI didn't quite get it right, you can edit the SQL yourself. This way, you get the best of both worlds—ease of AI assistance with full control when you need it.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
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
