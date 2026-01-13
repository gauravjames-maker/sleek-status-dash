import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Sparkles,
  Code,
  Eye,
  Settings,
  Loader2
} from "lucide-react";
import { CampaignSidebar } from "@/components/CampaignSidebar";
import { DBTSourcesSidebar } from "@/components/dbt-studio/DBTSourcesSidebar";
import { DBTNodeProperties } from "@/components/dbt-studio/DBTNodeProperties";
import { DBTPreviewPanel } from "@/components/dbt-studio/DBTPreviewPanel";
import { DBTAICopilot } from "@/components/dbt-studio/DBTAICopilot";
import { SourceNode } from "@/components/dbt-studio/nodes/SourceNode";
import { JoinNode } from "@/components/dbt-studio/nodes/JoinNode";
import { FilterNode } from "@/components/dbt-studio/nodes/FilterNode";
import { AggregateNode } from "@/components/dbt-studio/nodes/AggregateNode";
import { OutputNode } from "@/components/dbt-studio/nodes/OutputNode";
import { mockWarehouseTables } from "@/types/dbt-studio";

const nodeTypes = {
  source: SourceNode,
  join: JoinNode,
  filter: FilterNode,
  aggregate: AggregateNode,
  output: OutputNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const DBTBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modelId = searchParams.get('id');
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [modelName, setModelName] = useState(modelId ? "High Value Customers" : "New DBT Model");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showAICopilot, setShowAICopilot] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow-type");
      const tableData = event.dataTransfer.getData("application/reactflow-table");

      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      let newNode: Node;

      if (type === "source" && tableData) {
        const table = JSON.parse(tableData);
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: { 
            label: table.name,
            tableName: table.name,
            schema: table.schema,
            columns: table.columns,
          },
        };
      } else {
        const labels: Record<string, string> = {
          join: "Join",
          filter: "Filter",
          aggregate: "Aggregate",
          output: "Output Model",
        };
        newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: { label: labels[type] || type },
        };
      }

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRunning(false);
  };

  const handleAIGenerate = (prompt: string) => {
    // Simulate AI generating nodes
    const newNodes: Node[] = [
      {
        id: "source-customers",
        type: "source",
        position: { x: 100, y: 100 },
        data: {
          label: "customers",
          tableName: "customers",
          schema: "ecommerce",
          columns: mockWarehouseTables[0].columns,
        },
      },
      {
        id: "source-orders",
        type: "source",
        position: { x: 100, y: 300 },
        data: {
          label: "orders",
          tableName: "orders",
          schema: "ecommerce",
          columns: mockWarehouseTables[1].columns,
        },
      },
      {
        id: "join-1",
        type: "join",
        position: { x: 350, y: 200 },
        data: {
          label: "Join",
          joinType: "inner",
          joinOn: [{ left: "customer_id", right: "customer_id" }],
        },
      },
      {
        id: "filter-1",
        type: "filter",
        position: { x: 550, y: 200 },
        data: {
          label: "Filter",
          filters: [{ column: "total_amount", operator: "greater_than", value: 100 }],
        },
      },
      {
        id: "output-1",
        type: "output",
        position: { x: 750, y: 200 },
        data: {
          label: "Output Model",
          outputName: "high_value_customers",
          materializationType: "table",
        },
      },
    ];

    const newEdges: Edge[] = [
      { id: "e1", source: "source-customers", target: "join-1" },
      { id: "e2", source: "source-orders", target: "join-1" },
      { id: "e3", source: "join-1", target: "filter-1" },
      { id: "e4", source: "filter-1", target: "output-1" },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setShowAICopilot(false);
  };

  const updateNodeData = useCallback((nodeId: string, data: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...data } } : null);
    }
  }, [setNodes, selectedNode]);

  const generatedSQL = useMemo(() => {
    if (nodes.length === 0) return "";
    
    // Simple SQL generation based on nodes
    let sql = "-- Generated DBT Model SQL\n\n";
    
    const sourceNodes = nodes.filter(n => n.type === "source");
    const joinNodes = nodes.filter(n => n.type === "join");
    const filterNodes = nodes.filter(n => n.type === "filter");
    const outputNode = nodes.find(n => n.type === "output");

    if (outputNode?.data.outputName) {
      sql += `-- Model: ${outputNode.data.outputName}\n`;
      sql += `{{ config(materialized='${outputNode.data.materializationType || 'table'}') }}\n\n`;
    }

    if (sourceNodes.length > 0) {
      sourceNodes.forEach((node, index) => {
        sql += `WITH source_${index + 1} AS (\n`;
        sql += `  SELECT *\n`;
        sql += `  FROM {{ ref('${node.data.schema}.${node.data.tableName}') }}\n`;
        sql += `),\n\n`;
      });
    }

    if (joinNodes.length > 0 && sourceNodes.length >= 2) {
      const joinNode = joinNodes[0];
      sql += `joined_data AS (\n`;
      sql += `  SELECT s1.*, s2.*\n`;
      sql += `  FROM source_1 s1\n`;
      sql += `  ${joinNode.data.joinType?.toUpperCase() || 'INNER'} JOIN source_2 s2\n`;
      if (joinNode.data.joinOn?.[0]) {
        sql += `    ON s1.${joinNode.data.joinOn[0].left} = s2.${joinNode.data.joinOn[0].right}\n`;
      }
      sql += `),\n\n`;
    }

    if (filterNodes.length > 0) {
      const filterNode = filterNodes[0];
      sql += `filtered_data AS (\n`;
      sql += `  SELECT *\n`;
      sql += `  FROM ${joinNodes.length > 0 ? 'joined_data' : 'source_1'}\n`;
      if (filterNode.data.filters?.[0]) {
        const f = filterNode.data.filters[0];
        sql += `  WHERE ${f.column} ${f.operator === 'greater_than' ? '>' : f.operator === 'less_than' ? '<' : '='} ${f.value}\n`;
      }
      sql += `)\n\n`;
    }

    sql += `SELECT * FROM ${filterNodes.length > 0 ? 'filtered_data' : joinNodes.length > 0 ? 'joined_data' : 'source_1'}`;

    return sql;
  }, [nodes]);

  return (
    <div className="flex h-screen bg-background">
      <CampaignSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/people/audience-studio-dbt")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Input
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-64 font-semibold"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAICopilot(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Copilot
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <Code className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'SQL' : 'Preview'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
              <Button 
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                Run
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sources Sidebar */}
          <DBTSourcesSidebar tables={mockWarehouseTables} />

          {/* Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-muted/30"
            >
              <Background />
              <Controls />
              <MiniMap className="!bg-card !border-border" />
              
              {nodes.length === 0 && (
                <Panel position="top-center" className="mt-20">
                  <div className="text-center p-8 bg-card rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground mb-2">
                      Drag tables from the sidebar or use AI Copilot to get started
                    </p>
                    <Button variant="outline" onClick={() => setShowAICopilot(true)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate with AI
                    </Button>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>

          {/* Right Panel */}
          {selectedNode ? (
            <DBTNodeProperties 
              node={selectedNode} 
              onUpdate={(data) => updateNodeData(selectedNode.id, data)}
              onClose={() => setSelectedNode(null)}
            />
          ) : showPreview ? (
            <DBTPreviewPanel nodes={nodes} edges={edges} sql={generatedSQL} />
          ) : null}
        </div>
      </div>

      {/* AI Copilot Dialog */}
      <DBTAICopilot 
        open={showAICopilot} 
        onOpenChange={setShowAICopilot}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
};

export default DBTBuilder;
