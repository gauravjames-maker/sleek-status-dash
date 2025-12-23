import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, ArrowRight, Link2 } from "lucide-react";
import type { ParentModel, RelatedModel } from "@/types/audience-studio";

interface SchemaGraphProps {
  parentModel: ParentModel;
  relatedModels: RelatedModel[];
}

export const SchemaGraph = ({ parentModel, relatedModels }: SchemaGraphProps) => {
  return (
    <div className="p-6 bg-muted/30 rounded-lg border border-border">
      <div className="flex items-start gap-8">
        {/* Parent Model */}
        <Card className="p-4 bg-primary/5 border-primary/30 min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{parentModel.displayName}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{parentModel.tableName}</p>
          <Badge variant="outline" className="text-xs">
            PK: {parentModel.primaryKey}
          </Badge>
        </Card>

        {/* Connections */}
        {relatedModels.length > 0 && (
          <div className="flex flex-col gap-4 pt-4">
            {relatedModels.map((rm, index) => (
              <div key={rm.id} className="flex items-center gap-4">
                {/* Connection Line */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-px bg-border" />
                  <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                    <Link2 className="w-3 h-3" />
                    {rm.joinType}
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Related Model */}
                <Card className="p-3 min-w-40">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm text-foreground">{rm.displayName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {rm.joinColumn} → {rm.parentJoinColumn}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        )}

        {relatedModels.length === 0 && (
          <div className="flex items-center gap-4 text-muted-foreground">
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">No related models configured</span>
          </div>
        )}
      </div>
    </div>
  );
};
