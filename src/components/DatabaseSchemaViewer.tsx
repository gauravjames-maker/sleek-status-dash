import { useState } from "react";
import { Database, Table, ChevronDown, ChevronRight, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Comprehensive dummy database schema
export const databaseSchema = {
  tables: [
    {
      name: "users",
      schema: "public",
      description: "Core user accounts table",
      columns: [
        { name: "id", type: "SERIAL", primary: true, description: "Unique identifier" },
        { name: "email", type: "VARCHAR(255)", nullable: false, description: "User email address" },
        { name: "first_name", type: "VARCHAR(100)", nullable: true, description: "First name" },
        { name: "last_name", type: "VARCHAR(100)", nullable: true, description: "Last name" },
        { name: "date_of_birth", type: "DATE", nullable: true, description: "Birth date" },
        { name: "status", type: "VARCHAR(20)", nullable: false, description: "Account status (active, inactive, suspended)" },
        { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Account creation date" },
        { name: "updated_at", type: "TIMESTAMP", nullable: true, description: "Last update timestamp" },
      ],
      sampleData: [
        { id: 1, email: "john.anderson@example.com", first_name: "John", last_name: "Anderson", date_of_birth: "1990-05-15", status: "active", created_at: "2024-01-15 10:30:00" },
        { id: 2, email: "sarah.mitchell@example.com", first_name: "Sarah", last_name: "Mitchell", date_of_birth: "1996-08-22", status: "active", created_at: "2024-02-20 14:15:00" },
        { id: 3, email: "michael.chen@example.com", first_name: "Michael", last_name: "Chen", date_of_birth: "1982-11-30", status: "inactive", created_at: "2023-06-10 09:00:00" },
        { id: 4, email: "emma.wilson@example.com", first_name: "Emma", last_name: "Wilson", date_of_birth: "1994-03-08", status: "active", created_at: "2024-03-05 16:45:00" },
        { id: 5, email: "david.brown@example.com", first_name: "David", last_name: "Brown", date_of_birth: "1988-12-01", status: "suspended", created_at: "2023-09-18 11:20:00" },
      ],
    },
    {
      name: "orders",
      schema: "public",
      description: "Customer orders and transactions",
      columns: [
        { name: "id", type: "SERIAL", primary: true, description: "Order ID" },
        { name: "user_id", type: "INTEGER", nullable: false, foreign: "users.id", description: "Reference to user" },
        { name: "order_date", type: "TIMESTAMP", nullable: false, description: "When order was placed" },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false, description: "Order subtotal" },
        { name: "tax", type: "DECIMAL(10,2)", nullable: true, description: "Tax amount" },
        { name: "shipping", type: "DECIMAL(10,2)", nullable: true, description: "Shipping cost" },
        { name: "total_amount", type: "DECIMAL(10,2)", nullable: false, description: "Total with tax & shipping" },
        { name: "status", type: "VARCHAR(20)", nullable: false, description: "Order status (pending, completed, cancelled, refunded)" },
      ],
      sampleData: [
        { id: 101, user_id: 1, order_date: "2024-06-15 14:30:00", amount: 150.00, tax: 12.00, shipping: 5.99, total_amount: 167.99, status: "completed" },
        { id: 102, user_id: 1, order_date: "2024-07-20 09:15:00", amount: 89.50, tax: 7.16, shipping: 0.00, total_amount: 96.66, status: "completed" },
        { id: 103, user_id: 2, order_date: "2024-08-05 16:45:00", amount: 245.00, tax: 19.60, shipping: 10.00, total_amount: 274.60, status: "completed" },
        { id: 104, user_id: 3, order_date: "2024-03-10 11:00:00", amount: 67.99, tax: 5.44, shipping: 5.99, total_amount: 79.42, status: "completed" },
        { id: 105, user_id: 4, order_date: "2024-09-01 13:20:00", amount: 320.00, tax: 25.60, shipping: 0.00, total_amount: 345.60, status: "pending" },
      ],
    },
    {
      name: "subscriptions",
      schema: "public",
      description: "User subscription plans",
      columns: [
        { name: "id", type: "SERIAL", primary: true, description: "Subscription ID" },
        { name: "user_id", type: "INTEGER", nullable: false, foreign: "users.id", description: "Reference to user" },
        { name: "plan_type", type: "VARCHAR(50)", nullable: false, description: "Plan name (Basic, Standard, Premium, Enterprise)" },
        { name: "start_date", type: "DATE", nullable: false, description: "Subscription start" },
        { name: "end_date", type: "DATE", nullable: true, description: "Subscription end (null if active)" },
        { name: "monthly_price", type: "DECIMAL(10,2)", nullable: false, description: "Monthly subscription cost" },
        { name: "status", type: "VARCHAR(20)", nullable: false, description: "Status (active, cancelled, expired)" },
      ],
      sampleData: [
        { id: 1, user_id: 1, plan_type: "Premium", start_date: "2024-01-01", end_date: null, monthly_price: 29.99, status: "active" },
        { id: 2, user_id: 2, plan_type: "Standard", start_date: "2024-03-15", end_date: null, monthly_price: 14.99, status: "active" },
        { id: 3, user_id: 3, plan_type: "Basic", start_date: "2023-06-01", end_date: "2024-01-01", monthly_price: 9.99, status: "expired" },
        { id: 4, user_id: 4, plan_type: "Enterprise", start_date: "2024-04-01", end_date: null, monthly_price: 99.99, status: "active" },
        { id: 5, user_id: 5, plan_type: "Premium", start_date: "2023-09-01", end_date: "2024-03-01", monthly_price: 29.99, status: "cancelled" },
      ],
    },
    {
      name: "products",
      schema: "public",
      description: "Product catalog",
      columns: [
        { name: "id", type: "SERIAL", primary: true, description: "Product ID" },
        { name: "name", type: "VARCHAR(255)", nullable: false, description: "Product name" },
        { name: "category", type: "VARCHAR(100)", nullable: false, description: "Product category" },
        { name: "price", type: "DECIMAL(10,2)", nullable: false, description: "Unit price" },
        { name: "stock_quantity", type: "INTEGER", nullable: false, description: "Available inventory" },
        { name: "created_at", type: "TIMESTAMP", nullable: false, description: "When product was added" },
      ],
      sampleData: [
        { id: 1, name: "Wireless Headphones Pro", category: "Electronics", price: 149.99, stock_quantity: 250, created_at: "2024-01-10" },
        { id: 2, name: "Organic Cotton T-Shirt", category: "Apparel", price: 34.99, stock_quantity: 500, created_at: "2024-02-15" },
        { id: 3, name: "Smart Watch Series 5", category: "Electronics", price: 299.99, stock_quantity: 120, created_at: "2024-01-20" },
        { id: 4, name: "Premium Yoga Mat", category: "Fitness", price: 79.99, stock_quantity: 300, created_at: "2024-03-01" },
        { id: 5, name: "Stainless Steel Water Bottle", category: "Accessories", price: 24.99, stock_quantity: 800, created_at: "2024-02-28" },
      ],
    },
    {
      name: "customer_metrics",
      schema: "analytics",
      description: "Aggregated customer analytics",
      columns: [
        { name: "user_id", type: "INTEGER", primary: true, foreign: "users.id", description: "Reference to user" },
        { name: "total_orders", type: "INTEGER", nullable: false, description: "Lifetime order count" },
        { name: "total_spent", type: "DECIMAL(12,2)", nullable: false, description: "Lifetime spend" },
        { name: "avg_order_value", type: "DECIMAL(10,2)", nullable: false, description: "Average order amount" },
        { name: "customer_ltv", type: "DECIMAL(12,2)", nullable: false, description: "Customer lifetime value" },
        { name: "loyalty_points", type: "INTEGER", nullable: false, description: "Accumulated points" },
        { name: "customer_segment", type: "VARCHAR(50)", nullable: false, description: "Segment (VIP, Regular, New, At-Risk)" },
        { name: "last_order_date", type: "DATE", nullable: true, description: "Most recent purchase" },
        { name: "first_order_date", type: "DATE", nullable: true, description: "First purchase date" },
      ],
      sampleData: [
        { user_id: 1, total_orders: 12, total_spent: 1567.89, avg_order_value: 130.66, customer_ltv: 2450.00, loyalty_points: 3200, customer_segment: "VIP", last_order_date: "2024-09-15", first_order_date: "2024-01-20" },
        { user_id: 2, total_orders: 5, total_spent: 542.30, avg_order_value: 108.46, customer_ltv: 890.00, loyalty_points: 1100, customer_segment: "Regular", last_order_date: "2024-08-20", first_order_date: "2024-03-10" },
        { user_id: 3, total_orders: 3, total_spent: 189.50, avg_order_value: 63.17, customer_ltv: 320.00, loyalty_points: 450, customer_segment: "At-Risk", last_order_date: "2024-03-10", first_order_date: "2023-08-15" },
        { user_id: 4, total_orders: 8, total_spent: 1245.60, avg_order_value: 155.70, customer_ltv: 1980.00, loyalty_points: 2800, customer_segment: "VIP", last_order_date: "2024-09-01", first_order_date: "2024-04-05" },
        { user_id: 5, total_orders: 2, total_spent: 98.50, avg_order_value: 49.25, customer_ltv: 150.00, loyalty_points: 200, customer_segment: "At-Risk", last_order_date: "2023-11-20", first_order_date: "2023-10-01" },
      ],
    },
    {
      name: "payment_methods",
      schema: "public",
      description: "User payment methods",
      columns: [
        { name: "id", type: "SERIAL", primary: true, description: "Payment method ID" },
        { name: "user_id", type: "INTEGER", nullable: false, foreign: "users.id", description: "Reference to user" },
        { name: "type", type: "VARCHAR(50)", nullable: false, description: "Payment type (credit_card, debit_card, paypal, apple_pay)" },
        { name: "is_default", type: "BOOLEAN", nullable: false, description: "Is primary payment method" },
        { name: "last_four", type: "VARCHAR(4)", nullable: true, description: "Last 4 digits of card" },
        { name: "created_at", type: "TIMESTAMP", nullable: false, description: "When method was added" },
      ],
      sampleData: [
        { id: 1, user_id: 1, type: "credit_card", is_default: true, last_four: "4242", created_at: "2024-01-15" },
        { id: 2, user_id: 1, type: "paypal", is_default: false, last_four: null, created_at: "2024-02-10" },
        { id: 3, user_id: 2, type: "debit_card", is_default: true, last_four: "1234", created_at: "2024-03-15" },
        { id: 4, user_id: 3, type: "credit_card", is_default: true, last_four: "5678", created_at: "2023-06-10" },
        { id: 5, user_id: 4, type: "apple_pay", is_default: true, last_four: null, created_at: "2024-04-01" },
      ],
    },
    {
      name: "addresses",
      schema: "public",
      description: "User billing and shipping addresses",
      columns: [
        { name: "id", type: "SERIAL", primary: true, description: "Address ID" },
        { name: "user_id", type: "INTEGER", nullable: false, foreign: "users.id", description: "Reference to user" },
        { name: "type", type: "VARCHAR(20)", nullable: false, description: "Address type (billing, shipping)" },
        { name: "street", type: "VARCHAR(255)", nullable: false, description: "Street address" },
        { name: "city", type: "VARCHAR(100)", nullable: false, description: "City name" },
        { name: "state", type: "VARCHAR(100)", nullable: false, description: "State/Province" },
        { name: "postal_code", type: "VARCHAR(20)", nullable: false, description: "ZIP/Postal code" },
        { name: "country", type: "VARCHAR(100)", nullable: false, description: "Country" },
      ],
      sampleData: [
        { id: 1, user_id: 1, type: "billing", street: "123 Main St", city: "New York", state: "NY", postal_code: "10001", country: "USA" },
        { id: 2, user_id: 1, type: "shipping", street: "456 Oak Ave", city: "Brooklyn", state: "NY", postal_code: "11201", country: "USA" },
        { id: 3, user_id: 2, type: "billing", street: "789 Pine Rd", city: "Los Angeles", state: "CA", postal_code: "90001", country: "USA" },
        { id: 4, user_id: 3, type: "billing", street: "321 Elm St", city: "Chicago", state: "IL", postal_code: "60601", country: "USA" },
        { id: 5, user_id: 4, type: "shipping", street: "654 Maple Dr", city: "Austin", state: "TX", postal_code: "78701", country: "USA" },
      ],
    },
  ],
};

// Get all available table names
export const getAvailableTables = () => databaseSchema.tables.map(t => t.name);

// Get columns for a specific table
export const getTableColumns = (tableName: string) => {
  const table = databaseSchema.tables.find(t => t.name === tableName);
  return table?.columns.map(c => c.name) || [];
};

interface DatabaseSchemaViewerProps {
  trigger?: React.ReactNode;
}

const DatabaseSchemaViewer = ({ trigger }: DatabaseSchemaViewerProps) => {
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const viewSampleData = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const selectedTableData = databaseSchema.tables.find(t => t.name === selectedTable);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Database className="h-4 w-4" />
            View Database Schema
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema Reference
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="schema" className="mt-4">
          <TabsList>
            <TabsTrigger value="schema">Schema Structure</TabsTrigger>
            <TabsTrigger value="data">Sample Data</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema" className="mt-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {databaseSchema.tables.map((table) => (
                  <Collapsible
                    key={table.name}
                    open={expandedTables.includes(table.name)}
                    onOpenChange={() => toggleTable(table.name)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          {expandedTables.includes(table.name) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Table className="h-4 w-4 text-primary" />
                          <span className="font-medium">{table.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {table.schema}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {table.columns.length} columns
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewSampleData(table.name);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Data
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-8 mt-2 mb-4 border-l-2 border-primary/20 pl-4">
                        <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                        <div className="space-y-1">
                          {table.columns.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center gap-2 text-sm py-1"
                            >
                              <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
                                {col.name}
                              </code>
                              <span className="text-muted-foreground text-xs">{col.type}</span>
                              {col.primary && (
                                <Badge className="text-[10px] h-4 px-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
                                  PK
                                </Badge>
                              )}
                              {col.foreign && (
                                <Badge className="text-[10px] h-4 px-1 bg-blue-500/20 text-blue-600 border-blue-500/30">
                                  FK → {col.foreign}
                                </Badge>
                              )}
                              {!col.nullable && !col.primary && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1">
                                  NOT NULL
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="data" className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {databaseSchema.tables.map((table) => (
                  <Button
                    key={table.name}
                    variant={selectedTable === table.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTable(table.name)}
                  >
                    {table.name}
                  </Button>
                ))}
              </div>
              
              {selectedTableData && (
                <ScrollArea className="h-[400px]">
                  <div className="border rounded-lg">
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          {selectedTableData.columns.map((col) => (
                            <TableHead key={col.name} className="text-xs font-medium whitespace-nowrap">
                              {col.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTableData.sampleData.map((row, idx) => (
                          <TableRow key={idx}>
                            {selectedTableData.columns.map((col) => (
                              <TableCell key={col.name} className="text-xs whitespace-nowrap">
                                {String(row[col.name as keyof typeof row] ?? "NULL")}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing {selectedTableData.sampleData.length} sample rows from <code>{selectedTableData.name}</code>
                  </p>
                </ScrollArea>
              )}
              
              {!selectedTableData && (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Select a table above to view sample data
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="relationships" className="mt-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-4">Table Relationships (Foreign Keys)</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded">orders.user_id</code>
                  <span className="text-muted-foreground">→</span>
                  <code className="bg-muted px-2 py-1 rounded">users.id</code>
                  <span className="text-xs text-muted-foreground ml-2">One user has many orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded">subscriptions.user_id</code>
                  <span className="text-muted-foreground">→</span>
                  <code className="bg-muted px-2 py-1 rounded">users.id</code>
                  <span className="text-xs text-muted-foreground ml-2">One user has many subscriptions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded">customer_metrics.user_id</code>
                  <span className="text-muted-foreground">→</span>
                  <code className="bg-muted px-2 py-1 rounded">users.id</code>
                  <span className="text-xs text-muted-foreground ml-2">One user has one metrics record</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded">payment_methods.user_id</code>
                  <span className="text-muted-foreground">→</span>
                  <code className="bg-muted px-2 py-1 rounded">users.id</code>
                  <span className="text-xs text-muted-foreground ml-2">One user has many payment methods</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <code className="bg-muted px-2 py-1 rounded">addresses.user_id</code>
                  <span className="text-muted-foreground">→</span>
                  <code className="bg-muted px-2 py-1 rounded">users.id</code>
                  <span className="text-xs text-muted-foreground ml-2">One user has many addresses</span>
                </div>
              </div>
              
              <h4 className="font-medium mt-6 mb-3">Common Join Patterns</h4>
              <div className="space-y-2 text-xs font-mono bg-muted p-3 rounded">
                <p className="text-muted-foreground">-- Get user with their orders</p>
                <p>SELECT * FROM users u JOIN orders o ON u.id = o.user_id</p>
                <p className="text-muted-foreground mt-3">-- Get user with subscription and metrics</p>
                <p>SELECT * FROM users u</p>
                <p>  JOIN subscriptions s ON u.id = s.user_id</p>
                <p>  JOIN customer_metrics cm ON u.id = cm.user_id</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseSchemaViewer;
