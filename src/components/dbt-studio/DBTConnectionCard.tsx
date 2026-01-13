import { Cloud, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type DBTConnection } from "@/types/dbt-studio";
import { formatDistanceToNow } from "date-fns";

interface DBTConnectionCardProps {
  connection: DBTConnection | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const DBTConnectionCard = ({ connection, onConnect, onDisconnect }: DBTConnectionCardProps) => {
  if (!connection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            dbt Cloud
          </CardTitle>
          <CardDescription>
            Connect your dbt Cloud account to sync models and run jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onConnect} className="w-full">
            Connect dbt Cloud
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              dbt Cloud
              {connection.status === 'connected' ? (
                <Badge className="bg-status-completed-bg text-green-700 border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {connection.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Project ID</p>
            <p className="font-medium">{connection.projectId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Account ID</p>
            <p className="font-medium">{connection.accountId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Warehouse</p>
            <p className="font-medium capitalize">{connection.warehouseType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Sync</p>
            <p className="font-medium">
              {connection.lastSync 
                ? formatDistanceToNow(new Date(connection.lastSync), { addSuffix: true })
                : 'Never'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Sync Now
          </Button>
          <Button variant="outline" size="sm" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
