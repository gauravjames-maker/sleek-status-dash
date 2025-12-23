// Audience Studio Types

export interface ParentModel {
  id: string;
  name: string;
  displayName: string;
  tableName: string;
  primaryKey: string;
  displayLabel: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RelatedModel {
  id: string;
  parentModelId: string;
  name: string;
  displayName: string;
  tableName: string;
  joinType: "1:1" | "1:many" | "many:many";
  joinColumn: string;
  parentJoinColumn: string;
  timestampColumn?: string;
  description: string;
}

export interface PropertyFilter {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
  valueType: "text" | "number" | "date" | "boolean";
}

export interface EventFilter {
  id: string;
  relatedModelId: string;
  relatedModelName: string;
  hasEvent: boolean;
  timeWindow: {
    type: "last_days" | "between" | "all_time";
    days?: number;
    startDate?: string;
    endDate?: string;
  };
  properties: PropertyFilter[];
  aggregation?: {
    type: "count" | "sum" | "avg" | "min" | "max";
    field?: string;
    operator: ">=" | "<=" | ">" | "<" | "=";
    value: number;
  };
}

export interface FilterGroup {
  id: string;
  logic: "AND" | "OR";
  propertyFilters: PropertyFilter[];
  eventFilters: EventFilter[];
  nestedGroups: FilterGroup[];
}

export interface AudienceDefinition {
  id: string;
  name: string;
  description: string;
  parentModelId: string;
  parentModelName: string;
  status: "draft" | "active" | "archived";
  filterMode: "manual" | "ai" | "hybrid";
  filters: FilterGroup;
  aiPrompt?: string;
  generatedSql?: string;
  estimatedSize: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PreviewResult {
  count: number;
  totalInParent: number;
  sampleData: Record<string, unknown>[];
  breakdowns: {
    field: string;
    values: { label: string; count: number; percentage: number }[];
  }[];
}

// Mock data for the warehouse
export const mockWarehouseTables = [
  {
    name: "users",
    columns: [
      { name: "user_id", type: "uuid", isPrimaryKey: true },
      { name: "email", type: "varchar" },
      { name: "first_name", type: "varchar" },
      { name: "last_name", type: "varchar" },
      { name: "state", type: "varchar" },
      { name: "country", type: "varchar" },
      { name: "created_at", type: "timestamp" },
      { name: "status", type: "varchar" },
      { name: "plan_type", type: "varchar" },
      { name: "lifetime_value", type: "decimal" },
    ],
  },
  {
    name: "purchases",
    columns: [
      { name: "purchase_id", type: "uuid", isPrimaryKey: true },
      { name: "user_id", type: "uuid", isForeignKey: true },
      { name: "amount", type: "decimal" },
      { name: "currency", type: "varchar" },
      { name: "product_category", type: "varchar" },
      { name: "product_name", type: "varchar" },
      { name: "purchased_at", type: "timestamp" },
      { name: "status", type: "varchar" },
    ],
  },
  {
    name: "add_to_cart",
    columns: [
      { name: "event_id", type: "uuid", isPrimaryKey: true },
      { name: "user_id", type: "uuid", isForeignKey: true },
      { name: "product_id", type: "uuid" },
      { name: "product_name", type: "varchar" },
      { name: "product_category", type: "varchar" },
      { name: "quantity", type: "integer" },
      { name: "price", type: "decimal" },
      { name: "added_at", type: "timestamp" },
    ],
  },
  {
    name: "product_viewed",
    columns: [
      { name: "event_id", type: "uuid", isPrimaryKey: true },
      { name: "user_id", type: "uuid", isForeignKey: true },
      { name: "product_id", type: "uuid" },
      { name: "product_name", type: "varchar" },
      { name: "product_category", type: "varchar" },
      { name: "viewed_at", type: "timestamp" },
      { name: "source", type: "varchar" },
    ],
  },
  {
    name: "email_events",
    columns: [
      { name: "event_id", type: "uuid", isPrimaryKey: true },
      { name: "user_id", type: "uuid", isForeignKey: true },
      { name: "campaign_id", type: "uuid" },
      { name: "event_type", type: "varchar" },
      { name: "occurred_at", type: "timestamp" },
    ],
  },
];

// Sample parent models
export const sampleParentModels: ParentModel[] = [
  {
    id: "pm-1",
    name: "users",
    displayName: "Users",
    tableName: "users",
    primaryKey: "user_id",
    displayLabel: "email",
    description: "All registered users in the system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

// Sample related models
export const sampleRelatedModels: RelatedModel[] = [
  {
    id: "rm-1",
    parentModelId: "pm-1",
    name: "purchases",
    displayName: "Purchases",
    tableName: "purchases",
    joinType: "1:many",
    joinColumn: "user_id",
    parentJoinColumn: "user_id",
    timestampColumn: "purchased_at",
    description: "User purchase transactions",
  },
  {
    id: "rm-2",
    parentModelId: "pm-1",
    name: "add_to_cart",
    displayName: "Add to Cart",
    tableName: "add_to_cart",
    joinType: "1:many",
    joinColumn: "user_id",
    parentJoinColumn: "user_id",
    timestampColumn: "added_at",
    description: "Cart addition events",
  },
  {
    id: "rm-3",
    parentModelId: "pm-1",
    name: "product_viewed",
    displayName: "Product Viewed",
    tableName: "product_viewed",
    joinType: "1:many",
    joinColumn: "user_id",
    parentJoinColumn: "user_id",
    timestampColumn: "viewed_at",
    description: "Product view events",
  },
];

// Sample audiences
export const sampleAudiences: AudienceDefinition[] = [
  {
    id: "aud-1",
    name: "High Value Customers",
    description: "Users with lifetime value > $1000",
    parentModelId: "pm-1",
    parentModelName: "Users",
    status: "active",
    filterMode: "manual",
    filters: {
      id: "fg-1",
      logic: "AND",
      propertyFilters: [
        { id: "pf-1", field: "lifetime_value", operator: ">", value: 1000, valueType: "number" },
        { id: "pf-2", field: "status", operator: "=", value: "active", valueType: "text" },
      ],
      eventFilters: [],
      nestedGroups: [],
    },
    estimatedSize: 12543,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    createdBy: "admin@company.com",
  },
  {
    id: "aud-2",
    name: "Cart Abandoners",
    description: "Users who added to cart but didn't purchase in last 30 days",
    parentModelId: "pm-1",
    parentModelName: "Users",
    status: "active",
    filterMode: "ai",
    aiPrompt: "Users who added to cart in last 30 days but no purchase in 7 days",
    filters: {
      id: "fg-2",
      logic: "AND",
      propertyFilters: [],
      eventFilters: [
        {
          id: "ef-1",
          relatedModelId: "rm-2",
          relatedModelName: "Add to Cart",
          hasEvent: true,
          timeWindow: { type: "last_days", days: 30 },
          properties: [],
        },
        {
          id: "ef-2",
          relatedModelId: "rm-1",
          relatedModelName: "Purchases",
          hasEvent: false,
          timeWindow: { type: "last_days", days: 7 },
          properties: [],
        },
      ],
      nestedGroups: [],
    },
    estimatedSize: 8234,
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    createdBy: "marketing@company.com",
  },
];

// Generate sample user data
export const generateSampleUsers = (count: number = 10): Record<string, unknown>[] => {
  const states = ["CA", "NY", "TX", "FL", "WA", "IL", "PA", "OH", "GA", "NC"];
  const plans = ["free", "starter", "pro", "enterprise"];
  const statuses = ["active", "inactive", "pending"];
  
  return Array.from({ length: count }, (_, i) => ({
    user_id: `usr-${1000 + i}`,
    email: `user${1000 + i}@example.com`,
    first_name: ["John", "Jane", "Mike", "Sarah", "Chris"][i % 5],
    last_name: ["Smith", "Johnson", "Williams", "Brown", "Jones"][i % 5],
    state: states[i % states.length],
    country: "US",
    created_at: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
    status: statuses[i % statuses.length],
    plan_type: plans[i % plans.length],
    lifetime_value: Math.floor(Math.random() * 5000),
  }));
};
