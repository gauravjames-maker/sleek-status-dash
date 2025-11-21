import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Key } from "lucide-react";

interface GPTTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GPTTokenDialog = ({ open, onOpenChange }: GPTTokenDialogProps) => {
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!token.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter your GPT API token.",
        variant: "destructive",
      });
      return;
    }

    sessionStorage.setItem("gpt_token", token);
    
    toast({
      title: "Token Saved",
      description: "Your GPT token has been saved for this session.",
    });
    
    setToken("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            GPT API Token Required
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI GPT API token to use AI-powered SQL generation. Your token will be stored securely for this session only.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token">API Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="sk-..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your API token from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GPTTokenDialog;
