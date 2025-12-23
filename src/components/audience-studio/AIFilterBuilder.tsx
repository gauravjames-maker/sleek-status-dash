import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Sparkles, 
  Loader2, 
  Check, 
  Edit, 
  Lightbulb,
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  FilterGroup, 
  ParentModel, 
  RelatedModel 
} from "@/types/audience-studio";

interface AIFilterBuilderProps {
  parentModel: ParentModel;
  relatedModels: RelatedModel[];
  filters: FilterGroup;
  onFiltersChange: (filters: FilterGroup) => void;
  aiPrompt: string;
  onAiPromptChange: (prompt: string) => void;
  onSwitchToManual: () => void;
}

const EXAMPLE_PROMPTS = [
  {
    label: "Cart abandoners",
    prompt: "Users who added to cart in the last 30 days but didn't make a purchase in the last 7 days",
  },
  {
    label: "High-value customers",
    prompt: "Active users with lifetime value greater than $1000 who made a purchase this year",
  },
  {
    label: "At-risk customers",
    prompt: "Users who purchased in the last 6 months but haven't purchased in the last 60 days",
  },
  {
    label: "New engaged users",
    prompt: "Users who signed up in the last 30 days and have viewed more than 5 products",
  },
];

export const AIFilterBuilder = ({
  parentModel,
  relatedModels,
  filters,
  onFiltersChange,
  aiPrompt,
  onAiPromptChange,
  onSwitchToManual,
}: AIFilterBuilderProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFilters, setGeneratedFilters] = useState<FilterGroup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Mock AI generation (would call real API in production)
  const generateFilters = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Parse the prompt and generate mock filters
      // In production, this would call OpenAI or similar
      const mockGeneratedFilters: FilterGroup = {
        id: generateId(),
        logic: "AND",
        propertyFilters: [],
        eventFilters: [],
        nestedGroups: [],
      };

      // Simple parsing logic for demo
      const promptLower = aiPrompt.toLowerCase();

      // Check for property filters
      if (promptLower.includes("lifetime value") || promptLower.includes("ltv")) {
        const match = aiPrompt.match(/(\d+)/);
        mockGeneratedFilters.propertyFilters.push({
          id: generateId(),
          field: "lifetime_value",
          operator: ">",
          value: match ? parseInt(match[1]) : 1000,
          valueType: "number",
        });
      }

      if (promptLower.includes("active")) {
        mockGeneratedFilters.propertyFilters.push({
          id: generateId(),
          field: "status",
          operator: "=",
          value: "active",
          valueType: "text",
        });
      }

      // Check for event filters
      if (promptLower.includes("added to cart") || promptLower.includes("cart")) {
        const daysMatch = aiPrompt.match(/last (\d+) days/);
        const addToCartModel = relatedModels.find(rm => 
          rm.name.includes("cart") || rm.displayName.toLowerCase().includes("cart")
        );
        if (addToCartModel) {
          mockGeneratedFilters.eventFilters.push({
            id: generateId(),
            relatedModelId: addToCartModel.id,
            relatedModelName: addToCartModel.displayName,
            hasEvent: true,
            timeWindow: { 
              type: "last_days", 
              days: daysMatch ? parseInt(daysMatch[1]) : 30 
            },
            properties: [],
          });
        }
      }

      if (promptLower.includes("didn't purchase") || promptLower.includes("no purchase") || promptLower.includes("not purchase")) {
        const purchaseModel = relatedModels.find(rm => 
          rm.name.includes("purchase") || rm.displayName.toLowerCase().includes("purchase")
        );
        if (purchaseModel) {
          mockGeneratedFilters.eventFilters.push({
            id: generateId(),
            relatedModelId: purchaseModel.id,
            relatedModelName: purchaseModel.displayName,
            hasEvent: false,
            timeWindow: { type: "last_days", days: 7 },
            properties: [],
          });
        }
      }

      if (promptLower.includes("purchased") || promptLower.includes("made a purchase")) {
        const purchaseModel = relatedModels.find(rm => 
          rm.name.includes("purchase") || rm.displayName.toLowerCase().includes("purchase")
        );
        if (purchaseModel) {
          mockGeneratedFilters.eventFilters.push({
            id: generateId(),
            relatedModelId: purchaseModel.id,
            relatedModelName: purchaseModel.displayName,
            hasEvent: true,
            timeWindow: { type: "last_days", days: 365 },
            properties: [],
          });
        }
      }

      setGeneratedFilters(mockGeneratedFilters);
      
    } catch (err) {
      setError("Failed to generate filters. Please try again or use manual mode.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedFilters = () => {
    if (generatedFilters) {
      onFiltersChange(generatedFilters);
    }
  };

  const hasFiltersApplied = filters.propertyFilters.length > 0 || filters.eventFilters.length > 0;

  return (
    <div className="space-y-4">
      {/* Prompt Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Describe your audience</span>
        </div>
        
        <Textarea
          value={aiPrompt}
          onChange={(e) => onAiPromptChange(e.target.value)}
          placeholder="e.g., Users who added to cart in last 30 days but didn't purchase in 7 days..."
          className="min-h-24 resize-none"
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Using: {parentModel.displayName} + {relatedModels.map(rm => rm.displayName).join(", ")}
          </p>
          <Button 
            onClick={generateFilters}
            disabled={!aiPrompt.trim() || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Filters
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Try an example:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example.label}
              onClick={() => onAiPromptChange(example.prompt)}
              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Generated Filters Preview */}
      {generatedFilters && !hasFiltersApplied && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm text-foreground">AI Generated Filters</span>
          </div>

          <div className="space-y-2 mb-4">
            {generatedFilters.propertyFilters.map((f) => (
              <div key={f.id} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {f.field}
                </span>
                <span className="text-muted-foreground">{f.operator}</span>
                <span>{String(f.value)}</span>
              </div>
            ))}
            {generatedFilters.eventFilters.map((f) => (
              <div key={f.id} className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{f.hasEvent ? "Has" : "Has NOT"}</span>
                <Badge variant="secondary" className="text-xs">{f.relatedModelName}</Badge>
                <span className="text-muted-foreground">
                  in last {f.timeWindow.days} days
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={applyGeneratedFilters} className="gap-2">
              <Check className="w-4 h-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={onSwitchToManual} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Manually
            </Button>
          </div>
        </Card>
      )}

      {/* Applied Filters Info */}
      {hasFiltersApplied && (
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                AI generated these filters
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can edit them in Manual Mode or regenerate with a new prompt.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 gap-1"
                onClick={onSwitchToManual}
              >
                <Edit className="w-3.5 h-3.5" />
                Edit in Manual Mode
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
