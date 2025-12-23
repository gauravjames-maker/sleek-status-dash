import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Key, Edit, Trash2, Link2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ParentModel, RelatedModel } from "@/types/audience-studio";

interface ParentModelCardProps {
  model: ParentModel;
  relatedModels: RelatedModel[];
  onEdit: (model: ParentModel) => void;
  onDelete: (model: ParentModel) => void;
  onViewRelations: (model: ParentModel) => void;
}

export const ParentModelCard = ({
  model,
  relatedModels,
  onEdit,
  onDelete,
  onViewRelations,
}: ParentModelCardProps) => {
  return (
    <Card className="p-5 hover:shadow-md transition-all border-border hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{model.displayName}</h3>
            <p className="text-sm text-muted-foreground">{model.tableName}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={() => onEdit(model)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewRelations(model)}>
              <Link2 className="w-4 h-4 mr-2" />
              View Relations
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(model)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
        {model.description}
      </p>

      <div className="flex items-center gap-2 mt-4">
        <Badge variant="outline" className="text-xs gap-1">
          <Key className="w-3 h-3" />
          {model.primaryKey}
        </Badge>
        <Badge variant="secondary" className="text-xs gap-1">
          <Link2 className="w-3 h-3" />
          {relatedModels.length} related
        </Badge>
      </div>

      {relatedModels.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Related models:</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedModels.slice(0, 4).map((rm) => (
              <Badge key={rm.id} variant="outline" className="text-xs font-normal">
                {rm.displayName}
              </Badge>
            ))}
            {relatedModels.length > 4 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{relatedModels.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
