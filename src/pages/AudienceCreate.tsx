import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Code, Sparkles, Check, ChevronsUpDown, Search, ArrowUpDown, X, Info, Save, Trash2, AlertTriangle, Database } from "lucide-react";
import DatabaseSchemaViewer, { databaseSchema, getAvailableTables } from "@/components/DatabaseSchemaViewer";
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

// Example prompts with accurate SQL queries based on database schema
const examplePrompts = [
  {
    label: "High-value customers",
    prompt: "Show me all users who have placed more than 3 orders with a total amount greater than $500, ordered by total spend descending",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name, u.status,
       cm.total_orders, cm.total_spent, cm.customer_segment
FROM users u
JOIN customer_metrics cm ON u.id = cm.user_id
WHERE cm.total_orders > 3
  AND cm.total_spent > 500
ORDER BY cm.total_spent DESC`,
  },
  {
    label: "Inactive users",
    prompt: "Find all users who signed up more than 30 days ago but haven't placed any orders yet",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name, u.created_at, u.status
FROM users u
LEFT JOIN customer_metrics cm ON u.id = cm.user_id
WHERE u.created_at < CURRENT_DATE - INTERVAL '30 days'
  AND (cm.total_orders IS NULL OR cm.total_orders = 0)
ORDER BY u.created_at ASC`,
  },
  {
    label: "Recent active subscribers",
    prompt: "Get all users with active subscriptions that started in the last 90 days, sorted by start date",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name,
       s.plan_type, s.start_date, s.monthly_price, s.status
FROM users u
JOIN subscriptions s ON u.id = s.user_id
WHERE s.status = 'active'
  AND s.start_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY s.start_date DESC`,
  },
  {
    label: "At-risk customers",
    prompt: "Show users who had orders in the last 6 months but none in the last 60 days",
    hasError: true,
    sql: `SELECT u.id, u.email, u.first_name, u.last_name, cm.customer_segment
FROM user_activity ua
JOIN users u ON u.id = ua.user_id
JOIN customer_metrics cm ON u.id = cm.user_id
WHERE ua.last_order_date BETWEEN DATEADD(month, -6, GETDATE()) AND DATEADD(day, -60, GETDATE())
  AND ua.order_count > 0
ORDER BY cm.last_order_date DESC`,
  },
  {
    label: "Premium segment",
    prompt: "Find users with status 'active' who have a premium subscription plan and have made at least 2 purchases this year",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name,
       s.plan_type, s.monthly_price,
       cm.total_orders, cm.total_spent, cm.customer_segment
FROM users u
JOIN subscriptions s ON u.id = s.user_id
JOIN customer_metrics cm ON u.id = cm.user_id
WHERE u.status = 'active'
  AND s.plan_type IN ('Premium', 'Enterprise')
  AND s.status = 'active'
  AND cm.total_orders >= 2
ORDER BY cm.total_spent DESC`,
  },
  {
    label: "Comprehensive customer profile",
    prompt: "Show me a detailed customer profile including first name, last name, email, total order amount, average order value, number of orders, subscription plan type, last purchase date, customer lifetime value, preferred payment method, billing address, and customer segment classification",
    sql: `SELECT u.id, u.first_name, u.last_name, u.email, u.date_of_birth, u.status,
       cm.total_orders, cm.total_spent, cm.avg_order_value, cm.customer_ltv,
       cm.loyalty_points, cm.customer_segment, cm.last_order_date, cm.first_order_date,
       s.plan_type, s.start_date AS subscription_start, s.end_date AS subscription_end, s.monthly_price,
       pm.type AS payment_method, pm.last_four,
       a.street, a.city, a.state, a.postal_code, a.country
FROM users u
JOIN customer_metrics cm ON u.id = cm.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
LEFT JOIN payment_methods pm ON u.id = pm.user_id AND pm.is_default = true
LEFT JOIN addresses a ON u.id = a.user_id AND a.is_billing = true
WHERE cm.total_spent > 1000
ORDER BY cm.customer_ltv DESC
LIMIT 100`,
  },
];


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
  const [savedPreferences, setSavedPreferences] = useState<Array<{ label: string; prompt: string; sql: string; hasError?: boolean }>>(examplePrompts);
  const [sqlError, setSqlError] = useState<{
    message: string;
    line: number;
    column?: number;
    suggestion?: string;
  } | null>(null);

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
      
      // Check for potential issues in the generated SQL
      const detectedError = detectSQLIssues(cleanSQL);
      setSqlError(detectedError);
      
      if (detectedError) {
        toast({
          title: "SQL Generated with Warning",
          description: "Review the highlighted issue in your query.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "SQL Generated",
          description: "Your query has been generated successfully.",
        });
      }
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

  // Parse SQL to extract tables and columns
  const parseSQLQuery = (sql: string) => {
    const upperSQL = sql.toUpperCase();
    const tables: string[] = [];
    const columns: string[] = [];
    
    // Extract table names from FROM and JOIN clauses
    const tablePattern = /(?:FROM|JOIN)\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/gi;
    let match;
    while ((match = tablePattern.exec(sql)) !== null) {
      tables.push(match[1].toLowerCase());
    }
    
    // Extract column names from SELECT clause
    const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/is);
    if (selectMatch) {
      const selectClause = selectMatch[1];
      if (selectClause.trim() === '*') {
        // Select all columns from first table
      } else {
        const columnParts = selectClause.split(',');
        columnParts.forEach(part => {
          const cleaned = part.trim()
            .replace(/.*\.\s*/, '') // Remove table alias prefix
            .replace(/\s+AS\s+\w+/i, '') // Remove AS alias
            .trim();
          if (cleaned && !cleaned.includes('(')) { // Skip functions
            columns.push(cleaned.toLowerCase());
          }
        });
      }
    }
    
    return { tables, columns };
  };

  // Generate preview data based on SQL query and database schema
  const generatePreviewData = (sql: string) => {
    const { tables, columns } = parseSQLQuery(sql);
    
    if (tables.length === 0) {
      return [];
    }
    
    // Find tables in schema
    const schemaTables = tables.map(tableName => 
      databaseSchema.tables.find(t => t.name.toLowerCase() === tableName)
    ).filter(Boolean);
    
    if (schemaTables.length === 0) {
      // Return empty if no valid tables found
      return [];
    }
    
    // For JOINs, combine data from multiple tables
    if (schemaTables.length > 1) {
      const primaryTable = schemaTables[0];
      const joinedData = primaryTable?.sampleData.map((primaryRow, index) => {
        const combinedRow: Record<string, any> = { ...primaryRow };
        
        // Add data from joined tables (using user_id as join key)
        schemaTables.slice(1).forEach(joinedTable => {
          if (joinedTable) {
            const joinedRow = joinedTable.sampleData.find(
              (jr: any) => jr.user_id === primaryRow.id || jr.user_id === primaryRow.user_id || jr.id === primaryRow.user_id
            ) || joinedTable.sampleData[index % joinedTable.sampleData.length];
            
            if (joinedRow) {
              // Prefix joined columns with table name to avoid conflicts
              Object.entries(joinedRow).forEach(([key, value]) => {
                if (key !== 'user_id' && key !== 'id') {
                  combinedRow[`${joinedTable.name}_${key}`] = value;
                } else if (!combinedRow[key]) {
                  combinedRow[key] = value;
                }
              });
            }
          }
        });
        
        return combinedRow;
      }) || [];
      
      // Filter to selected columns if specified
      if (columns.length > 0) {
        return joinedData.map(row => {
          const filteredRow: Record<string, any> = {};
          columns.forEach(col => {
            // Check for exact match or partial match
            const matchingKey = Object.keys(row).find(
              key => key.toLowerCase() === col || key.toLowerCase().endsWith(`_${col}`)
            );
            if (matchingKey) {
              filteredRow[col] = row[matchingKey];
            } else if (row[col] !== undefined) {
              filteredRow[col] = row[col];
            }
          });
          // Include all columns if no specific matches found
          return Object.keys(filteredRow).length > 0 ? filteredRow : row;
        });
      }
      
      return joinedData;
    }
    
    // Single table query
    const tableData = schemaTables[0]?.sampleData || [];
    
    // Filter to selected columns if specified
    if (columns.length > 0 && columns[0] !== '*') {
      return tableData.map((row: any) => {
        const filteredRow: Record<string, any> = {};
        columns.forEach(col => {
          if (row[col] !== undefined) {
            filteredRow[col] = row[col];
          }
        });
        // Return full row if no columns matched
        return Object.keys(filteredRow).length > 0 ? filteredRow : row;
      });
    }
    
    return tableData;
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

    // Generate preview data based on actual SQL query and schema
    const result = generatePreviewData(sqlQuery);
    setPreviewData(result);
    setShowPreviewDialog(true);
    setSearchTerm("");
    setSortColumn("");
    
    toast({
      title: "Query Executed",
      description: result.length > 0 ? `Found ${result.length} results.` : "No results found. Check if the table exists in the schema.",
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

  const useExamplePrompt = (prompt: string, hasError?: boolean, sql?: string) => {
    setNaturalLanguageQuery(prompt);
    setSqlError(null);
    
    // If SQL is provided, use it directly
    if (sql) {
      setSqlQuery(sql);
      
      // If this is an error example, set the error state
      if (hasError) {
        const availableTables = getAvailableTables();
        setSqlError({
          message: `Table "user_activity" does not exist in the selected schema`,
          line: 2,
          suggestion: `Available tables: ${availableTables.join(', ')}. For at-risk customers, use "customer_metrics" table which has last_order_date and customer_segment columns.`,
        });
        
        toast({
          title: "Example: At-Risk Customers Query",
          description: "This query has an issue - the referenced table doesn't exist. Check the Database Schema for valid tables.",
        });
      } else {
        toast({
          title: "SQL Loaded",
          description: "Query has been loaded. Click 'Preview Results' to see the data.",
        });
      }
    }
  };

  // Function to detect common SQL issues using actual database schema
  const detectSQLIssues = (sql: string): typeof sqlError => {
    const lines = sql.split('\n');
    const availableTables = getAvailableTables();
    
    // Check for non-existent table references
    const tablePattern = /FROM\s+(\w+)|JOIN\s+(\w+)/gi;
    let match;
    while ((match = tablePattern.exec(sql)) !== null) {
      const tableName = match[1] || match[2];
      if (tableName && !availableTables.includes(tableName.toLowerCase())) {
        const lineIndex = sql.substring(0, match.index).split('\n').length;
        return {
          message: `Table "${tableName}" does not exist in the selected schema`,
          line: lineIndex,
          suggestion: `Available tables: ${availableTables.join(', ')}. Click "View Database Schema" to see all tables and columns.`,
        };
      }
    }
    
    // Check for non-existent column references
    const columnPattern = /SELECT\s+(.+?)\s+FROM/is;
    const columnMatch = columnPattern.exec(sql);
    if (columnMatch) {
      const selectClause = columnMatch[1];
      if (selectClause.includes('undefined') || selectClause.includes('null_column')) {
        return {
          message: `Invalid column reference in SELECT clause`,
          line: 1,
          suggestion: `Check column names against the selected table schema`,
        };
      }
    }
    
    // Check for syntax issues
    if (sql.includes('SELEC ') || sql.includes('FORM ') || sql.includes('WHER ')) {
      const typos = ['SELEC ', 'FORM ', 'WHER '];
      for (const typo of typos) {
        if (sql.includes(typo)) {
          const lineIndex = sql.substring(0, sql.indexOf(typo)).split('\n').length;
          return {
            message: `Possible typo: "${typo.trim()}" - did you mean "${typo.trim()}T" or another keyword?`,
            line: lineIndex,
            suggestion: `SQL keywords should be: SELECT, FROM, WHERE`,
          };
        }
      }
    }
    
    // Check for ambiguous column references in JOINs
    if (sql.toUpperCase().includes('JOIN') && !sql.includes('.')) {
      const hasMultipleTables = (sql.match(/FROM|JOIN/gi) || []).length > 1;
      if (hasMultipleTables) {
        return {
          message: `Ambiguous column references detected - columns should be prefixed with table aliases when using JOINs`,
          line: 1,
          suggestion: `Use table aliases like: users.id, orders.user_id`,
        };
      }
    }
    
    return null;
  };

  // Simulate an example with error for demo
  const simulateErrorExample = () => {
    const errorSQL = `SELECT id, email, total_purchases, last_login_date
FROM customer_profiles
WHERE status = 'active'
  AND total_purchases > 500
ORDER BY last_login_date DESC`;
    
    setSqlQuery(errorSQL);
    setSqlError({
      message: `Table "customer_profiles" does not exist in the selected schema`,
      line: 2,
      suggestion: `Available tables: users, orders, products, subscriptions. Did you mean "customers" from the analytics schema?`,
    });
    
    toast({
      title: "Example: SQL with Issue",
      description: "This demonstrates how errors are highlighted.",
    });
  };

  // Render SQL with error highlighting
  const renderSQLWithHighlight = () => {
    if (!sqlError || !sqlQuery) return null;
    
    const lines = sqlQuery.split('\n');
    
    return (
      <div className="mt-2 font-mono text-sm">
        <div className="rounded-lg border border-border overflow-hidden">
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const isErrorLine = lineNum === sqlError.line;
            
            return (
              <div
                key={index}
                className={cn(
                  "flex",
                  isErrorLine && "bg-destructive/10 border-l-2 border-l-destructive"
                )}
              >
                <span className="w-10 px-2 py-1 text-right text-muted-foreground bg-muted/50 select-none border-r border-border">
                  {lineNum}
                </span>
                <pre className="flex-1 px-3 py-1 overflow-x-auto">
                  <code className={cn(isErrorLine && "text-destructive")}>{line}</code>
                </pre>
              </div>
            );
          })}
        </div>
        
        {/* Error message */}
        <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">
                Line {sqlError.line}: {sqlError.message}
              </p>
              {sqlError.suggestion && (
                <p className="text-xs text-muted-foreground">
                  💡 {sqlError.suggestion}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const savePreference = () => {
    if (!naturalLanguageQuery.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a query before saving.",
        variant: "destructive",
      });
      return;
    }

    const label = naturalLanguageQuery.substring(0, 30) + (naturalLanguageQuery.length > 30 ? "..." : "");
    const newPreference = {
      label,
      prompt: naturalLanguageQuery,
      sql: sqlQuery || "",
    };

    setSavedPreferences([...savedPreferences, newPreference]);
    
    toast({
      title: "Preference Saved",
      description: "Your audience preference has been saved with the SQL query.",
    });
  };

  const deletePreference = (index: number) => {
    setSavedPreferences(savedPreferences.filter((_, i) => i !== index));
    toast({
      title: "Preference Deleted",
      description: "Audience preference has been removed.",
    });
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
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent transition-colors flex items-center gap-1.5 px-3 py-1"
                onClick={() => setShowInfoDialog(true)}
              >
                <Info className="h-3.5 w-3.5" />
                How SQL AI Works
              </Badge>
              <Button onClick={handleSave}>Save Audience</Button>
            </div>
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
                    <Label className="text-sm text-muted-foreground">Audience Preference</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {savedPreferences.map((example, index) => (
                        <div key={index} className="relative group">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => useExamplePrompt(example.prompt, example.hasError, example.sql)}
                            className="text-xs pr-8"
                          >
                            {example.label}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePreference(index);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={simulateErrorExample}
                      className="text-xs text-muted-foreground"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Show Error Example
                    </Button>
                    <DatabaseSchemaViewer
                      trigger={
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                          <Database className="h-3 w-3 mr-1" />
                          View Database Schema
                        </Button>
                      }
                    />
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={generateSQLFromNaturalLanguage}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate SQL"}
                    </Button>
                    {naturalLanguageQuery.trim() && (
                      <Button
                        onClick={savePreference}
                        variant="outline"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Preference
                      </Button>
                    )}
                  </div>
                </div>

                {sqlQuery && (
                  <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Generated SQL Query</Label>
                      {sqlError && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Issue Detected
                        </Badge>
                      )}
                    </div>
                    
                    {sqlError ? (
                      renderSQLWithHighlight()
                    ) : (
                      <Textarea
                        value={sqlQuery}
                        onChange={(e) => {
                          setSqlQuery(e.target.value);
                          setSqlError(null);
                        }}
                        className="mt-2 font-mono text-sm min-h-[120px]"
                      />
                    )}
                    
                    {sqlError && (
                      <Textarea
                        value={sqlQuery}
                        onChange={(e) => {
                          setSqlQuery(e.target.value);
                          const newError = detectSQLIssues(e.target.value);
                          setSqlError(newError);
                        }}
                        placeholder="Edit the SQL to fix the issue..."
                        className="font-mono text-sm min-h-[100px]"
                      />
                    )}
                    
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
