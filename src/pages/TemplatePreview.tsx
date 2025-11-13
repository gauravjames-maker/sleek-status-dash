import { useState } from "react";
import { X, Sun, Moon, Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TemplatePreviewProps {
  onClose: () => void;
}

type ViewMode = "light" | "dark";
type DeviceType = "desktop" | "tablet" | "mobile";

const deviceWidths = {
  desktop: 1341,
  tablet: 768,
  mobile: 601,
};

const TemplatePreview = ({ onClose }: TemplatePreviewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("light");
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [customWidth, setCustomWidth] = useState(1341);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDeviceChange = (device: DeviceType) => {
    setDeviceType(device);
    setCustomWidth(deviceWidths[device]);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Preview mode</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-center gap-2">
            {/* Light/Dark mode toggle */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
              <button
                onClick={() => setViewMode("light")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "light"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="w-5 h-5" />
              </button>
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setViewMode("dark")}
                className={`p-2 rounded transition-colors relative ${
                  viewMode === "dark"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="w-5 h-5" />
                {showTooltip && viewMode !== "dark" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg z-50 text-xs text-popover-foreground">
                    Dark mode support varies across email clients and devices. When enabled, the Dark Mode Preview will simulate a generic dark mode color scheme.
                  </div>
                )}
              </button>
            </div>

            {/* Device type selector */}
            <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
              <button
                onClick={() => handleDeviceChange("desktop")}
                className={`p-2 rounded transition-colors ${
                  deviceType === "desktop"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeviceChange("tablet")}
                className={`p-2 rounded transition-colors ${
                  deviceType === "tablet"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeviceChange("mobile")}
                className={`p-2 rounded transition-colors ${
                  deviceType === "mobile"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>

            {/* Width display */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-border rounded-lg bg-card text-sm text-center"
              />
              <button className="p-2 hover:bg-accent rounded-lg">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <input
                type="number"
                value={601}
                readOnly
                className="w-20 px-3 py-2 border border-border rounded-lg bg-card text-sm text-center"
              />
            </div>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-auto p-6 bg-muted/20">
          <div
            className={`mx-auto border border-border rounded-lg overflow-hidden shadow-lg transition-all ${
              viewMode === "dark" ? "bg-gray-900" : "bg-white"
            }`}
            style={{ maxWidth: `${customWidth}px` }}
          >
            <div className="p-8 md:p-12">
              <div className="max-w-2xl mx-auto">
                <h1
                  className={`text-3xl md:text-4xl font-bold mb-6 ${
                    viewMode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  No Sales Yet?
                </h1>

                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg"
                    alt="Person working at desk"
                    className="w-full h-auto"
                  />
                </div>

                <div
                  className={`space-y-4 text-base leading-relaxed mb-8 ${
                    viewMode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p>
                    No sales occurred during this period primarily due to low customer engagement
                    and limited conversion from outreach efforts. The product's value proposition
                    may not have fully aligned with customer needs, and external factors such as
                    market timing and competition also played a role. Additionally, gaps in
                    follow-up and lead nurturing likely reduced conversion opportunities. Steps are
                    being taken to refine messaging, improve outreach, and better align offerings
                    with customer expectations.
                  </p>
                </div>

                <div className="text-center">
                  <button className="px-8 py-3 bg-cyan-500 text-white rounded font-medium hover:bg-cyan-600 transition-colors">
                    Boost your SALES today!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;
