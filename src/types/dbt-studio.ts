// DBT Studio Types

export interface DBTModel {
  id: string;
  name: string;
  description?: string;
  type: 'source' | 'transform' | 'output';
  tableName?: string;
  audienceCount?: number;
  status: 'draft' | 'active' | 'running' | 'error';
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBTNode {
  id: string;
  type: 'source' | 'join' | 'filter' | 'aggregate' | 'output';
  position: { x: number; y: number };
  data: DBTNodeData;
}

export interface DBTNodeData {
  label: string;
  tableName?: string;
  schema?: string;
  columns?: ColumnInfo[];
  // Join config
  joinType?: 'inner' | 'left' | 'right' | 'full';
  joinOn?: { left: string; right: string }[];
  // Filter config
  filters?: FilterCondition[];
  // Aggregate config
  groupBy?: string[];
  aggregations?: AggregateConfig[];
  // Output config
  outputName?: string;
  materializationType?: 'table' | 'view' | 'incremental';
}

export interface ColumnInfo {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  selected?: boolean;
}

export interface FilterCondition {
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between' | 'is_null' | 'is_not_null';
  value: string | number | string[];
}

export interface AggregateConfig {
  column: string;
  function: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'count_distinct';
  alias: string;
}

export interface DBTEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface DBTConnection {
  id: string;
  name: string;
  type: 'dbt_cloud' | 'dbt_core';
  projectId?: string;
  accountId?: string;
  status: 'connected' | 'disconnected' | 'error';
  warehouseType: 'snowflake' | 'bigquery' | 'postgres' | 'redshift';
  lastSync?: string;
}

export interface WarehouseTable {
  id: string;
  name: string;
  schema: string;
  columns: ColumnInfo[];
  rowCount?: number;
}

// Mock Data

export const mockDBTModels: DBTModel[] = [
  {
    id: 'dbt-1',
    name: 'High Value Customers',
    description: 'Customers with lifetime value > $1000',
    type: 'output',
    tableName: 'high_value_customers',
    audienceCount: 12450,
    status: 'active',
    lastRun: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'dbt-2',
    name: 'Recent Purchasers',
    description: 'Users who purchased in last 30 days',
    type: 'output',
    tableName: 'recent_purchasers',
    audienceCount: 8920,
    status: 'active',
    lastRun: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'dbt-3',
    name: 'Churn Risk Segment',
    description: 'Users inactive for 60+ days with previous purchases',
    type: 'output',
    tableName: 'churn_risk_users',
    audienceCount: 3210,
    status: 'running',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'dbt-4',
    name: 'VIP Tier Members',
    description: 'Users in Gold or Platinum loyalty tier',
    type: 'output',
    tableName: 'vip_tier_members',
    audienceCount: 5680,
    status: 'draft',
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
  },
  {
    id: 'dbt-5',
    name: 'Cart Abandoners',
    description: 'Users with abandoned carts in last 7 days',
    type: 'output',
    tableName: 'cart_abandoners',
    audienceCount: 1890,
    status: 'error',
    lastRun: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
];

export const mockWarehouseTables: WarehouseTable[] = [
  {
    id: 'wh-1',
    name: 'customers',
    schema: 'ecommerce',
    columns: [
      { name: 'customer_id', type: 'varchar', isPrimaryKey: true },
      { name: 'email', type: 'varchar' },
      { name: 'first_name', type: 'varchar' },
      { name: 'last_name', type: 'varchar' },
      { name: 'loyalty_tier', type: 'varchar' },
      { name: 'lifetime_value', type: 'decimal' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'state', type: 'varchar' },
      { name: 'country', type: 'varchar' },
    ],
    rowCount: 150000,
  },
  {
    id: 'wh-2',
    name: 'orders',
    schema: 'ecommerce',
    columns: [
      { name: 'order_id', type: 'varchar', isPrimaryKey: true },
      { name: 'customer_id', type: 'varchar', isForeignKey: true },
      { name: 'order_date', type: 'date' },
      { name: 'total_amount', type: 'decimal' },
      { name: 'status', type: 'varchar' },
      { name: 'shipping_method', type: 'varchar' },
      { name: 'discount_code', type: 'varchar' },
    ],
    rowCount: 450000,
  },
  {
    id: 'wh-3',
    name: 'products',
    schema: 'ecommerce',
    columns: [
      { name: 'product_id', type: 'varchar', isPrimaryKey: true },
      { name: 'product_name', type: 'varchar' },
      { name: 'category', type: 'varchar' },
      { name: 'price', type: 'decimal' },
      { name: 'sku', type: 'varchar' },
      { name: 'inventory_count', type: 'integer' },
    ],
    rowCount: 5000,
  },
  {
    id: 'wh-4',
    name: 'order_items',
    schema: 'ecommerce',
    columns: [
      { name: 'item_id', type: 'varchar', isPrimaryKey: true },
      { name: 'order_id', type: 'varchar', isForeignKey: true },
      { name: 'product_id', type: 'varchar', isForeignKey: true },
      { name: 'quantity', type: 'integer' },
      { name: 'unit_price', type: 'decimal' },
      { name: 'total_price', type: 'decimal' },
    ],
    rowCount: 1200000,
  },
  {
    id: 'wh-5',
    name: 'cart_events',
    schema: 'ecommerce',
    columns: [
      { name: 'event_id', type: 'varchar', isPrimaryKey: true },
      { name: 'customer_id', type: 'varchar', isForeignKey: true },
      { name: 'product_id', type: 'varchar', isForeignKey: true },
      { name: 'event_type', type: 'varchar' },
      { name: 'event_timestamp', type: 'timestamp' },
      { name: 'session_id', type: 'varchar' },
    ],
    rowCount: 3500000,
  },
  {
    id: 'wh-6',
    name: 'page_views',
    schema: 'analytics',
    columns: [
      { name: 'view_id', type: 'varchar', isPrimaryKey: true },
      { name: 'customer_id', type: 'varchar', isForeignKey: true },
      { name: 'page_url', type: 'varchar' },
      { name: 'page_title', type: 'varchar' },
      { name: 'view_timestamp', type: 'timestamp' },
      { name: 'duration_seconds', type: 'integer' },
      { name: 'device_type', type: 'varchar' },
    ],
    rowCount: 8000000,
  },
];

export const mockDBTConnection: DBTConnection = {
  id: 'conn-1',
  name: 'Production Warehouse',
  type: 'dbt_cloud',
  projectId: 'proj_12345',
  accountId: 'acc_67890',
  status: 'connected',
  warehouseType: 'snowflake',
  lastSync: '2024-01-15T10:00:00Z',
};
