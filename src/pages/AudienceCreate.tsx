import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Code, Sparkles, Check, ChevronsUpDown, Search, ArrowUpDown, X, Info, Save, Trash2, AlertTriangle, Database, Shield, Clock, Users, Settings, CheckCircle, XCircle, Zap, Calendar } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { useToast } from "@/hooks/use-toast";
import GPTTokenDialog from "@/components/GPTTokenDialog";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

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

// Time range options
const timeRangeOptions = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "180d", label: "Last 6 months", days: 180 },
  { value: "365d", label: "Last year", days: 365 },
  { value: "custom", label: "Custom range", days: null },
];

// Data domain options (maps to optimized views/tables)
const dataDomainOptions = [
  { value: "all", label: "All Data", description: "Full access to all tables", tables: [] },
  { value: "purchases", label: "Purchases", description: "Order and transaction data", tables: ["orders", "customer_metrics"] },
  { value: "engagement", label: "Engagement", description: "User activity and events", tables: ["users", "subscriptions"] },
  { value: "web_events", label: "Web Events", description: "Website interaction data", tables: ["events"] },
  { value: "customer_profile", label: "Customer Profile", description: "Customer demographics and attributes", tables: ["users", "customer_metrics", "addresses"] },
];

// Admin settings (would come from backend in production)
const adminSettings = {
  defaultTimeRange: "30d",
  maxDateWindowDays: 365,
  defaultResultLimit: 10000,
  hardResultCap: 100000,
  allowedTables: ["users", "orders", "subscriptions", "customer_metrics", "addresses", "payment_methods", "products", "events"],
  disallowedTables: ["raw_logs", "system_audit", "internal_metrics"],
  maxJoinTables: 4,
  requireDateFilter: true,
};

// Enhanced example prompts with structured constraints
const examplePrompts = [
  {
    label: "High-value customers",
    prompt: "Show me all users who have placed more than 3 orders with a total amount greater than $500, ordered by total spend descending",
    isRecommended: true,
    hasTimeConstraint: true,
    dataDomain: "purchases",
    timeRange: "90d",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name, u.status,
       cm.total_orders, cm.total_spent, cm.customer_segment
FROM users u
JOIN customer_metrics cm ON u.id = cm.user_id
WHERE cm.total_orders > 3
  AND cm.total_spent > 500
  AND cm.last_order_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY cm.total_spent DESC
LIMIT 10000`,
  },
  {
    label: "Inactive users",
    prompt: "Find all users who signed up more than 30 days ago but haven't placed any orders yet",
    isRecommended: true,
    hasTimeConstraint: true,
    dataDomain: "engagement",
    timeRange: "30d",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name, u.created_at, u.status
FROM users u
LEFT JOIN customer_metrics cm ON u.id = cm.user_id
WHERE u.created_at < CURRENT_DATE - INTERVAL '30 days'
  AND (cm.total_orders IS NULL OR cm.total_orders = 0)
ORDER BY u.created_at ASC
LIMIT 10000`,
  },
  {
    label: "Recent active subscribers",
    prompt: "Get all users with active subscriptions that started in the last 90 days, sorted by start date",
    isRecommended: true,
    hasTimeConstraint: true,
    dataDomain: "engagement",
    timeRange: "90d",
    sql: `SELECT u.id, u.email, u.first_name, u.last_name,
       s.plan_type, s.start_date, s.monthly_price, s.status
FROM users u
JOIN subscriptions s ON u.id = s.user_id
WHERE s.status = 'active'
  AND s.start_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY s.start_date DESC
LIMIT 10000`,
  },
  {
    label: "At-risk customers (Demo Error)",
    prompt: "Show users who had orders in the last 6 months but none in the last 60 days",
    isRecommended: false,
    hasTimeConstraint: false,
    hasError: true,
    dataDomain: "purchases",
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
    isRecommended: true,
    hasTimeConstraint: true,
    dataDomain: "customer_profile",
    timeRange: "365d",
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
  AND cm.last_order_date >= CURRENT_DATE - INTERVAL '365 days'
ORDER BY cm.total_spent DESC
LIMIT 10000`,
  },
  {
    label: "Free-form query",
    prompt: "",
    isRecommended: false,
    hasTimeConstraint: false,
    dataDomain: "all",
    isFreeForm: true,
  },
];

// Saved preference type
interface SavedPreference {
  label: string;
  prompt: string;
  sql?: string;
  hasError?: boolean;
  isRecommended?: boolean;
  hasTimeConstraint?: boolean;
  dataDomain?: string;
  timeRange?: string;
  isFreeForm?: boolean;
}

// Query safety analysis result type
interface QuerySafetyResult {
  isValid: boolean;
  hasDateFilter: boolean;
  hasResultLimit: boolean;
  usesOptimizedView: boolean;
  tablesUsed: string[];
  estimatedDateSpan: string | null;
  warnings: string[];
  errors: string[];
}

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
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<SavedPreference[]>(examplePrompts.filter(p => !p.isFreeForm) as SavedPreference[]);
  const [sqlError, setSqlError] = useState<{
    message: string;
    line: number;
    column?: number;
    suggestion?: string;
  } | null>(null);

  // New state for cost-aware guardrails
  const [timeRange, setTimeRange] = useState(adminSettings.defaultTimeRange);
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [resultLimit, setResultLimit] = useState(adminSettings.defaultResultLimit);
  const [dataDomain, setDataDomain] = useState("all");
  const [querySafety, setQuerySafety] = useState<QuerySafetyResult | null>(null);
  const [showSafetyWarning, setShowSafetyWarning] = useState(false);

  // Analyze SQL query for safety
  const analyzeQuerySafety = (sql: string): QuerySafetyResult => {
    const result: QuerySafetyResult = {
      isValid: true,
      hasDateFilter: false,
      hasResultLimit: false,
      usesOptimizedView: true,
      tablesUsed: [],
      estimatedDateSpan: null,
      warnings: [],
      errors: [],
    };

    // Extract tables used
    const tablePattern = /(?:FROM|JOIN)\s+(\w+)/gi;
    let match;
    while ((match = tablePattern.exec(sql)) !== null) {
      const tableName = match[1].toLowerCase();
      if (!result.tablesUsed.includes(tableName)) {
        result.tablesUsed.push(tableName);
      }
    }

    // Check for date filter
    const datePatterns = [
      /WHERE.*(?:created_at|updated_at|start_date|end_date|last_order_date|order_date|timestamp).*(?:>=|>|BETWEEN)/i,
      /INTERVAL\s*'\d+\s*(?:days?|months?|years?)'/i,
      /CURRENT_DATE/i,
      /NOW\(\)/i,
    ];
    result.hasDateFilter = datePatterns.some(pattern => pattern.test(sql));

    // Check for result limit
    result.hasResultLimit = /LIMIT\s+\d+/i.test(sql);

    // Check for disallowed tables
    const disallowedUsed = result.tablesUsed.filter(t => 
      adminSettings.disallowedTables.includes(t)
    );
    if (disallowedUsed.length > 0) {
      result.errors.push(`Query uses restricted tables: ${disallowedUsed.join(', ')}`);
      result.isValid = false;
    }

    // Check for too many joins
    if (result.tablesUsed.length > adminSettings.maxJoinTables) {
      result.warnings.push(`Query joins ${result.tablesUsed.length} tables (max recommended: ${adminSettings.maxJoinTables})`);
    }

    // Check for missing date filter (if required)
    if (adminSettings.requireDateFilter && !result.hasDateFilter) {
      result.warnings.push("No date filter detected - query may scan large historical data");
    }

    // Check for missing limit
    if (!result.hasResultLimit) {
      result.warnings.push("No result limit - consider adding LIMIT to control output size");
    }

    // Estimate date span from SQL
    const intervalMatch = sql.match(/INTERVAL\s*'(\d+)\s*(days?|months?|years?)'/i);
    if (intervalMatch) {
      result.estimatedDateSpan = `${intervalMatch[1]} ${intervalMatch[2]}`;
    }

    // Check if using optimized views (simplified check)
    const optimizedTables = ["customer_metrics", "users", "subscriptions"];
    result.usesOptimizedView = result.tablesUsed.some(t => optimizedTables.includes(t));

    return result;
  };

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

    // Validate time range selection
    if (!timeRange) {
      toast({
        title: "Time Range Required",
        description: "Please select a time range to keep queries fast and cost-efficient.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setQuerySafety(null);

    // Build time constraint for the prompt
    const timeConstraint = timeRange === "custom" 
      ? `between ${customDateFrom} and ${customDateTo}`
      : `in the ${timeRangeOptions.find(t => t.value === timeRange)?.label.toLowerCase()}`;

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

IMPORTANT CONSTRAINTS:
1. Always include a date filter using the time range: ${timeConstraint}
2. Always add LIMIT ${resultLimit} at the end of the query
3. Use optimized tables when possible (customer_metrics for aggregations)
4. Avoid raw log tables

Only return the SQL query, nothing else.`,
            },
            {
              role: "user",
              content: `${naturalLanguageQuery}\n\nTime range: ${timeConstraint}\nResult limit: ${resultLimit}`,
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
      
      // Analyze query safety
      const safetyResult = analyzeQuerySafety(cleanSQL);
      setQuerySafety(safetyResult);
      
      // Check for potential issues in the generated SQL
      const detectedError = detectSQLIssues(cleanSQL);
      setSqlError(detectedError);
      
      if (detectedError) {
        toast({
          title: "SQL Generated with Warning",
          description: "Review the highlighted issue in your query.",
          variant: "destructive",
        });
      } else if (safetyResult.warnings.length > 0 || safetyResult.errors.length > 0) {
        setShowSafetyWarning(true);
        toast({
          title: "Query Safety Review",
          description: "Please review the safety summary before running.",
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

  // Parse SQL to extract tables, columns, and WHERE conditions
  const parseSQLQuery = (sql: string) => {
    const tables: string[] = [];
    const columns: string[] = [];
    const whereConditions: Array<{ column: string; operator: string; value: any }> = [];
    
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
      if (selectClause.trim() !== '*') {
        const columnParts = selectClause.split(',');
        columnParts.forEach(part => {
          const cleaned = part.trim()
            .replace(/.*\.\s*/, '') // Remove table alias prefix
            .replace(/\s+AS\s+\w+/i, '') // Remove AS alias
            .trim();
          if (cleaned && !cleaned.includes('(')) {
            columns.push(cleaned.toLowerCase());
          }
        });
      }
    }
    
    // Parse WHERE conditions
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)/is);
    if (whereMatch) {
      const whereClause = whereMatch[1];
      
      // Simple equality conditions
      const eqPattern = /(\w+(?:\.\w+)?)\s*=\s*'([^']+)'/gi;
      let eqMatch;
      while ((eqMatch = eqPattern.exec(whereClause)) !== null) {
        whereConditions.push({
          column: eqMatch[1].replace(/.*\./, '').toLowerCase(),
          operator: '=',
          value: eqMatch[2],
        });
      }
      
      // Numeric comparisons
      const numPattern = /(\w+(?:\.\w+)?)\s*(>|<|>=|<=|=)\s*(\d+)/gi;
      let numMatch;
      while ((numMatch = numPattern.exec(whereClause)) !== null) {
        whereConditions.push({
          column: numMatch[1].replace(/.*\./, '').toLowerCase(),
          operator: numMatch[2],
          value: parseFloat(numMatch[3]),
        });
      }
      
      // Status checks
      if (whereClause.toLowerCase().includes("status = 'active'")) {
        whereConditions.push({ column: 'status', operator: '=', value: 'active' });
      }
      if (whereClause.toLowerCase().includes("status = 'inactive'")) {
        whereConditions.push({ column: 'status', operator: '=', value: 'inactive' });
      }
      
      // Segment checks
      const segmentMatch = whereClause.match(/customer_segment\s*=\s*'(\w+)'/i);
      if (segmentMatch) {
        whereConditions.push({ column: 'customer_segment', operator: '=', value: segmentMatch[1] });
      }
      
      // Plan type checks
      const planMatch = whereClause.match(/plan_type\s+IN\s*\(([^)]+)\)/i);
      if (planMatch) {
        const plans = planMatch[1].split(',').map(p => p.trim().replace(/'/g, ''));
        whereConditions.push({ column: 'plan_type', operator: 'IN', value: plans });
      }
    }
    
    return { tables, columns, whereConditions };
  };

  // Apply WHERE conditions to filter data
  const applyWhereConditions = (data: any[], conditions: Array<{ column: string; operator: string; value: any }>) => {
    if (conditions.length === 0) return data;
    
    return data.filter(row => {
      return conditions.every(condition => {
        const rowValue = row[condition.column];
        if (rowValue === undefined) return true;
        
        switch (condition.operator) {
          case '=':
            return String(rowValue).toLowerCase() === String(condition.value).toLowerCase();
          case '>':
            return parseFloat(rowValue) > condition.value;
          case '<':
            return parseFloat(rowValue) < condition.value;
          case '>=':
            return parseFloat(rowValue) >= condition.value;
          case '<=':
            return parseFloat(rowValue) <= condition.value;
          case 'IN':
            return Array.isArray(condition.value) && 
              condition.value.some(v => String(rowValue).toLowerCase() === String(v).toLowerCase());
          default:
            return true;
        }
      });
    });
  };

  // Generate preview data based on SQL query and database schema
  const generatePreviewData = (sql: string) => {
    const { tables, columns, whereConditions } = parseSQLQuery(sql);
    
    if (tables.length === 0) {
      return [];
    }
    
    // Find tables in schema
    const schemaTables = tables.map(tableName => 
      databaseSchema.tables.find(t => t.name.toLowerCase() === tableName)
    ).filter(Boolean);
    
    if (schemaTables.length === 0) {
      return [];
    }
    
    let resultData: any[] = [];
    
    // For JOINs, combine data from multiple tables
    if (schemaTables.length > 1) {
      const primaryTable = schemaTables[0];
      resultData = primaryTable?.sampleData.map((primaryRow: any, index: number) => {
        const combinedRow: Record<string, any> = { ...primaryRow };
        
        schemaTables.slice(1).forEach(joinedTable => {
          if (joinedTable) {
            const joinedRow = joinedTable.sampleData.find(
              (jr: any) => jr.user_id === primaryRow.id || jr.user_id === primaryRow.user_id || jr.id === primaryRow.user_id
            ) || joinedTable.sampleData[index % joinedTable.sampleData.length];
            
            if (joinedRow) {
              Object.entries(joinedRow).forEach(([key, value]) => {
                if (key !== 'user_id' && key !== 'id') {
                  combinedRow[key] = value;
                } else if (!combinedRow[key]) {
                  combinedRow[key] = value;
                }
              });
            }
          }
        });
        
        return combinedRow;
      }) || [];
    } else {
      resultData = [...(schemaTables[0]?.sampleData || [])];
    }
    
    // Apply WHERE conditions to filter data
    resultData = applyWhereConditions(resultData, whereConditions);
    
    // Filter to selected columns if specified
    if (columns.length > 0) {
      resultData = resultData.map(row => {
        const filteredRow: Record<string, any> = {};
        columns.forEach(col => {
          const matchingKey = Object.keys(row).find(
            key => key.toLowerCase() === col || key.toLowerCase().endsWith(`_${col}`)
          );
          if (matchingKey) {
            filteredRow[col] = row[matchingKey];
          } else if (row[col] !== undefined) {
            filteredRow[col] = row[col];
          }
        });
        return Object.keys(filteredRow).length > 0 ? filteredRow : row;
      });
    }
    
    // Apply result limit
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      resultData = resultData.slice(0, limit);
    }
    
    return resultData;
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

    // Check for safety errors before execution
    if (querySafety?.errors.length) {
      toast({
        title: "Query Blocked",
        description: "Please fix the safety issues before running the query.",
        variant: "destructive",
      });
      return;
    }

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

    if (searchTerm) {
      filtered = previewData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

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

  const useExamplePrompt = (example: SavedPreference) => {
    setNaturalLanguageQuery(example.prompt);
    setSqlError(null);
    setSqlQuery("");
    setQuerySafety(null);
    
    // Set scope controls from the example
    if (example.timeRange) {
      setTimeRange(example.timeRange);
    }
    if (example.dataDomain) {
      setDataDomain(example.dataDomain);
    }
    
    toast({
      title: "Prompt Loaded",
      description: example.isRecommended 
        ? "Recommended prompt with built-in constraints. Click 'Generate SQL' to create the query."
        : "Click 'Generate SQL' to create the query.",
    });
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

  // Render query safety summary
  const renderQuerySafetySummary = () => {
    if (!querySafety) return null;

    return (
      <div className="mt-4 p-4 rounded-lg border border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Query Safety Summary</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            {querySafety.hasDateFilter ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-500" />
            )}
            <span>Date filter</span>
          </div>
          <div className="flex items-center gap-2">
            {querySafety.hasResultLimit ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-500" />
            )}
            <span>Result limit</span>
          </div>
          <div className="flex items-center gap-2">
            {querySafety.usesOptimizedView ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Optimized tables</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span>{querySafety.tablesUsed.length} table(s)</span>
          </div>
        </div>

        {querySafety.estimatedDateSpan && (
          <div className="mt-3 text-xs text-muted-foreground">
            <span className="font-medium">Date span:</span> {querySafety.estimatedDateSpan}
          </div>
        )}

        {querySafety.warnings.length > 0 && (
          <div className="mt-3 space-y-1">
            {querySafety.warnings.map((warning, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {querySafety.errors.length > 0 && (
          <div className="mt-3 space-y-1">
            {querySafety.errors.map((error, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-destructive">
                <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        {(querySafety.warnings.length > 0 || querySafety.errors.length > 0) && (
          <div className="mt-3 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                // Add missing constraints to query
                let updatedSQL = sqlQuery;
                if (!querySafety.hasResultLimit) {
                  updatedSQL = updatedSQL.trim().replace(/;?\s*$/, '') + `\nLIMIT ${resultLimit}`;
                }
                setSqlQuery(updatedSQL);
                setQuerySafety(analyzeQuerySafety(updatedSQL));
              }}
            >
              <Zap className="h-3 w-3 mr-1" />
              Auto-fix constraints
            </Button>
          </div>
        )}
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
      isRecommended: false,
      hasTimeConstraint: Boolean(timeRange && timeRange !== "custom"),
      dataDomain,
      timeRange,
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
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent transition-colors flex items-center gap-1.5 px-3 py-1"
                onClick={() => setShowAdminSettings(true)}
              >
                <Settings className="h-3.5 w-3.5" />
                Admin Settings
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
                {/* Scope Controls Card */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label className="font-medium">Query Scope Controls</Label>
                    <span className="text-xs text-muted-foreground ml-2">
                      These settings help keep queries fast and cost-efficient
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Time Range */}
                    <div className="space-y-2">
                      <Label className="text-sm flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Time Range <span className="text-destructive">*</span>
                      </Label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {timeRangeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {timeRange === "custom" && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Input
                            type="date"
                            value={customDateFrom}
                            onChange={(e) => setCustomDateFrom(e.target.value)}
                            placeholder="From"
                          />
                          <Input
                            type="date"
                            value={customDateTo}
                            onChange={(e) => setCustomDateTo(e.target.value)}
                            placeholder="To"
                          />
                        </div>
                      )}
                    </div>

                    {/* Result Limit */}
                    <div className="space-y-2">
                      <Label className="text-sm flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        Max Audience Size
                      </Label>
                      <Select 
                        value={resultLimit.toString()} 
                        onValueChange={(v) => setResultLimit(parseInt(v, 10))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="1000">1,000 profiles</SelectItem>
                          <SelectItem value="5000">5,000 profiles</SelectItem>
                          <SelectItem value="10000">10,000 profiles (default)</SelectItem>
                          <SelectItem value="25000">25,000 profiles</SelectItem>
                          <SelectItem value="50000">50,000 profiles</SelectItem>
                          <SelectItem value="100000">100,000 profiles (max)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>

                  {!timeRange && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Please select a time range before generating SQL. This prevents scanning unnecessary historical data.
                    </div>
                  )}
                </div>

                {/* Natural Language Query Card */}
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
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-muted-foreground">Audience Preferences</Label>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
                          <Zap className="h-2.5 w-2.5 mr-0.5" />
                          Recommended
                        </Badge>
                        <span>= includes time & limit constraints</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {savedPreferences.map((example, index) => (
                        <div key={index} className="relative group">
                          <Button
                            variant={example.isRecommended ? "default" : "outline"}
                            size="sm"
                            onClick={() => useExamplePrompt(example)}
                            className={cn(
                              "text-xs pr-8",
                              example.isRecommended && "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30",
                              example.hasError && "border-destructive/50 text-destructive"
                            )}
                          >
                            {example.isRecommended && <Zap className="h-3 w-3 mr-1" />}
                            {example.hasError && <AlertTriangle className="h-3 w-3 mr-1" />}
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
                      
                      {/* Free-form option */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNaturalLanguageQuery("");
                          setSqlQuery("");
                          setQuerySafety(null);
                        }}
                        className="text-xs border border-dashed border-border"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        Free-form query
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
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
                      disabled={isGenerating || !timeRange}
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
                          setQuerySafety(analyzeQuerySafety(e.target.value));
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
                          setQuerySafety(analyzeQuerySafety(e.target.value));
                        }}
                        placeholder="Edit the SQL to fix the issue..."
                        className="font-mono text-sm min-h-[100px]"
                      />
                    )}

                    {/* Query Safety Summary */}
                    {renderQuerySafetySummary()}
                    
                    <Button 
                      onClick={executeQuery} 
                      variant="outline" 
                      className="w-full"
                      disabled={querySafety?.errors.length ? querySafety.errors.length > 0 : false}
                    >
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
                    onChange={(e) => {
                      setSqlQuery(e.target.value);
                      setQuerySafety(analyzeQuerySafety(e.target.value));
                    }}
                    className="mt-2 font-mono text-sm min-h-[200px]"
                  />
                  
                  {sqlQuery && renderQuerySafetySummary()}
                  
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

      {/* How It Works Dialog */}
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
              <strong>New:</strong> Use the scope controls to set your time range and audience size limits. This helps keep your queries fast and cost-efficient.
            </p>
            <p>
              Then, simply tell MG - AI in plain English how you'd like to see your audience. MG - AI will do all the hard work, writing the right SQL queries behind the scenes to get you the results you want.
            </p>
            <p>
              Look for <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30 mx-1"><Zap className="h-2.5 w-2.5 mr-0.5 inline" />Recommended</Badge> prompts—these include built-in constraints for safer, faster queries.
            </p>
            <p>
              If you feel MG - AI didn't quite get it right, you can edit the SQL yourself. This way, you get the best of both worlds—ease of AI assistance with full control when you need it.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Settings Dialog */}
      <Dialog open={showAdminSettings} onOpenChange={setShowAdminSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Admin Query Settings
            </DialogTitle>
            <DialogDescription>
              Configure default constraints and safety rules for AI-generated queries
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Time Range Defaults</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Default Time Range</Label>
                  <Select defaultValue={adminSettings.defaultTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {timeRangeOptions.filter(o => o.value !== "custom").map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Maximum Date Window (days)</Label>
                  <Input type="number" defaultValue={adminSettings.maxDateWindowDays} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Result Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Default Result Limit</Label>
                  <Input type="number" defaultValue={adminSettings.defaultResultLimit} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Hard Result Cap</Label>
                  <Input type="number" defaultValue={adminSettings.hardResultCap} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Query Safety Rules</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Require date filter in all queries</Label>
                  <Switch defaultChecked={adminSettings.requireDateFilter} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Max tables in JOIN</Label>
                  <Input 
                    type="number" 
                    defaultValue={adminSettings.maxJoinTables} 
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Allowed Tables for AI Queries</h4>
              <div className="flex flex-wrap gap-1">
                {adminSettings.allowedTables.map((table) => (
                  <Badge key={table} variant="secondary" className="text-xs">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-destructive">Restricted Tables</h4>
              <div className="flex flex-wrap gap-1">
                {adminSettings.disallowedTables.map((table) => (
                  <Badge key={table} variant="destructive" className="text-xs">
                    {table}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                These tables are blocked from AI-generated queries to prevent scanning large raw data.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAdminSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({ title: "Settings Saved", description: "Admin settings have been updated." });
                setShowAdminSettings(false);
              }}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Preview Results Dialog */}
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
