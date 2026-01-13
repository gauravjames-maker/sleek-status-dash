// DBT Studio Types - Hightouch Customer Studio Style

// ============ Parent Model Types (Schema Setup) ============

export interface DBTParentModel {
  id: string;
  name: string;
  displayName: string;
  tableName: string;
  schema: string;
  primaryKey: string;
  description?: string;
  columns: ColumnInfo[];
  relationships: DBTRelationship[];
  status: 'draft' | 'active';
  createdAt: string;
  updatedAt: string;
}

export interface DBTRelationship {
  id: string;
  name: string;
  displayName: string;
  relatedTable: string;
  relatedSchema: string;
  joinType: 'one_to_one' | 'one_to_many' | 'many_to_one';
  foreignKey: string;
  relatedKey: string;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  description?: string;
}

// ============ Audience Builder Types ============

export interface DBTAudience {
  id: string;
  name: string;
  description?: string;
  parentModelId: string;
  parentModelName: string;
  filterGroups: FilterGroup[];
  estimatedSize: number;
  status: 'draft' | 'active' | 'running' | 'error';
  dbtModelName?: string;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = 'property' | 'relation' | 'event';
export type LogicOperator = 'AND' | 'OR';

export interface FilterGroup {
  id: string;
  logic: LogicOperator;
  filters: AudienceFilter[];
  groups?: FilterGroup[];
}

export interface AudienceFilter {
  id: string;
  type: FilterType;
  // Property filter
  column?: string;
  operator?: FilterOperator;
  value?: string | number | string[];
  // Relation filter
  relationId?: string;
  relationName?: string;
  relationOperator?: 'has' | 'has_not' | 'count_gt' | 'count_lt' | 'count_eq';
  relationFilters?: AudienceFilter[];
  // Event filter
  eventName?: string;
  timeWindow?: { value: number; unit: 'days' | 'weeks' | 'months' };
  eventCount?: { operator: 'at_least' | 'at_most' | 'exactly'; value: number };
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'less_than' 
  | 'greater_or_equal' 
  | 'less_or_equal'
  | 'in' 
  | 'not_in'
  | 'is_set' 
  | 'is_not_set';

// ============ Connection Types ============

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

// ============ Preview Types ============

export interface AudiencePreview {
  count: number;
  totalInParent: number;
  percentage: number;
  sampleData: Record<string, unknown>[];
  breakdowns: { field: string; values: { label: string; count: number; percentage: number }[] }[];
  overlaps?: { audienceId: string; audienceName: string; overlap: number }[];
}

// ============ Mock Data ============

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
    name: 'sessions',
    schema: 'analytics',
    columns: [
      { name: 'session_id', type: 'varchar', isPrimaryKey: true },
      { name: 'customer_id', type: 'varchar', isForeignKey: true },
      { name: 'start_time', type: 'timestamp' },
      { name: 'end_time', type: 'timestamp' },
      { name: 'page_views', type: 'integer' },
      { name: 'device_type', type: 'varchar' },
      { name: 'referrer', type: 'varchar' },
    ],
    rowCount: 3500000,
  },
  {
    id: 'wh-6',
    name: 'events',
    schema: 'analytics',
    columns: [
      { name: 'event_id', type: 'varchar', isPrimaryKey: true },
      { name: 'customer_id', type: 'varchar', isForeignKey: true },
      { name: 'event_name', type: 'varchar' },
      { name: 'event_timestamp', type: 'timestamp' },
      { name: 'properties', type: 'json' },
    ],
    rowCount: 8000000,
  },
];

export const mockParentModels: DBTParentModel[] = [
  {
    id: 'pm-1',
    name: 'users',
    displayName: 'Users',
    tableName: 'customers',
    schema: 'ecommerce',
    primaryKey: 'customer_id',
    description: 'Primary customer model for audience segmentation',
    columns: mockWarehouseTables[0].columns,
    relationships: [
      {
        id: 'rel-1',
        name: 'orders',
        displayName: 'Orders',
        relatedTable: 'orders',
        relatedSchema: 'ecommerce',
        joinType: 'one_to_many',
        foreignKey: 'customer_id',
        relatedKey: 'customer_id',
        columns: mockWarehouseTables[1].columns,
      },
      {
        id: 'rel-2',
        name: 'sessions',
        displayName: 'Sessions',
        relatedTable: 'sessions',
        relatedSchema: 'analytics',
        joinType: 'one_to_many',
        foreignKey: 'customer_id',
        relatedKey: 'customer_id',
        columns: mockWarehouseTables[4].columns,
      },
    ],
    status: 'active',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'pm-2',
    name: 'accounts',
    displayName: 'Accounts',
    tableName: 'customers',
    schema: 'ecommerce',
    primaryKey: 'customer_id',
    description: 'B2B account model',
    columns: mockWarehouseTables[0].columns,
    relationships: [],
    status: 'draft',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
  },
];

export const mockAudiences: DBTAudience[] = [
  {
    id: 'aud-1',
    name: 'High Value Customers',
    description: 'Customers with lifetime value > $1000',
    parentModelId: 'pm-1',
    parentModelName: 'Users',
    filterGroups: [{
      id: 'fg-1',
      logic: 'AND',
      filters: [
        { id: 'f-1', type: 'property', column: 'lifetime_value', operator: 'greater_than', value: 1000 },
      ],
    }],
    estimatedSize: 12450,
    status: 'active',
    dbtModelName: 'high_value_customers',
    lastRun: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'aud-2',
    name: 'Recent Purchasers',
    description: 'Users who purchased in last 30 days',
    parentModelId: 'pm-1',
    parentModelName: 'Users',
    filterGroups: [{
      id: 'fg-2',
      logic: 'AND',
      filters: [
        { id: 'f-2', type: 'relation', relationId: 'rel-1', relationName: 'Orders', relationOperator: 'has', relationFilters: [
          { id: 'f-2-1', type: 'property', column: 'order_date', operator: 'greater_than', value: '2024-01-01' }
        ]},
      ],
    }],
    estimatedSize: 8920,
    status: 'active',
    dbtModelName: 'recent_purchasers',
    lastRun: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'aud-3',
    name: 'Gmail Users',
    description: 'Users with Gmail email addresses',
    parentModelId: 'pm-1',
    parentModelName: 'Users',
    filterGroups: [{
      id: 'fg-3',
      logic: 'AND',
      filters: [
        { id: 'f-3', type: 'property', column: 'email', operator: 'contains', value: '@gmail.com' },
      ],
    }],
    estimatedSize: 45230,
    status: 'draft',
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
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

// ============ Audience Templates ============

export const audienceTemplates = [
  { id: 't-1', name: 'High-value customers', description: 'Lifetime value > $1000', icon: 'crown' },
  { id: 't-2', name: 'Recent purchasers', description: 'Purchased in last 30 days', icon: 'shopping-cart' },
  { id: 't-3', name: 'At-risk churners', description: 'No activity in 60+ days', icon: 'alert-triangle' },
  { id: 't-4', name: 'Email subscribers', description: 'Users with valid email', icon: 'mail' },
  { id: 't-5', name: 'Mobile users', description: 'Primary device is mobile', icon: 'smartphone' },
];
