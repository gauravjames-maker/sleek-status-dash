import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Release {
  version: string;
  date: string;
  summary: string;
  sections: {
    new?: ChangeItem[];
    improved?: ChangeItem[];
    fixed?: ChangeItem[];
  };
}

interface ChangeItem {
  description: string;
  modules: string[];
}

const currentVersion = "2025.12";
const currentReleaseDate = "December 2025";

const currentReleaseChanges = [
  { text: "Campaign API - Launch and manage campaigns programmatically via API", modules: ["Admin", "Campaigns"] },
  { text: "Enhanced audit logging with detailed before/after views", modules: ["Admin"] },
  { text: "AI-powered SQL audience builder with natural language support", modules: ["People"] },
  { text: "Template preview with dark/light mode and device testing", modules: ["Content"] },
  { text: "Marketing campaign analytics with performance tracking", modules: ["Analytics", "Campaigns"] },
];

const pastReleases: Release[] = [
  {
    version: "2025.11",
    date: "November 2025",
    summary: "Blueprint builder improvements and performance enhancements",
    sections: {
      new: [
        { description: "Canvas-based blueprint builder with drag-and-drop", modules: ["People"] },
        { description: "Split testing by percentage or fixed numbers", modules: ["Campaigns"] },
      ],
      improved: [
        { description: "Dashboard load time reduced by 40%", modules: ["Performance"] },
        { description: "Table filtering with advanced search options", modules: ["All"] },
      ],
      fixed: [
        { description: "Fixed campaign status tooltip not appearing", modules: ["Campaigns"] },
        { description: "Resolved sidebar navigation collapse issues", modules: ["Navigation"] },
      ],
    },
  },
  {
    version: "2025.10",
    date: "October 2025",
    summary: "Audience management and content template updates",
    sections: {
      new: [
        { description: "Multi-table audience selection", modules: ["People"] },
        { description: "Saved audience preference library", modules: ["People"] },
      ],
      improved: [
        { description: "Template editor with real-time preview", modules: ["Content"] },
        { description: "Enhanced campaign scheduling options", modules: ["Campaigns"] },
      ],
      fixed: [
        { description: "Fixed date picker timezone issues", modules: ["Campaigns"] },
        { description: "Corrected metric calculation inconsistencies", modules: ["Analytics"] },
      ],
    },
  },
  {
    version: "2025.09",
    date: "September 2025",
    summary: "Performance dashboard redesign and new metrics",
    sections: {
      new: [
        { description: "Performance over time chart visualization", modules: ["Analytics"] },
        { description: "Recipient metrics dashboard", modules: ["Analytics"] },
      ],
      improved: [
        { description: "Metric cards with trend indicators", modules: ["Dashboard"] },
        { description: "Color-coded status chips", modules: ["Campaigns"] },
      ],
      fixed: [
        { description: "Fixed chart rendering on mobile devices", modules: ["Analytics"] },
        { description: "Resolved export data formatting issues", modules: ["Reports"] },
      ],
    },
  },
];

export const WhatsNewDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [expandedReleases, setExpandedReleases] = useState<string[]>([]);

  const toggleRelease = (version: string) => {
    setExpandedReleases((prev) =>
      prev.includes(version) ? prev.filter((v) => v !== version) : [...prev, version]
    );
  };

  const getModuleColor = (module: string): string => {
    const colors: Record<string, string> = {
      People: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
      Content: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
      Campaigns: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
      Analytics: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
      Admin: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
      Performance: "bg-primary/10 text-primary border-primary/20",
      Navigation: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
      All: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
      Reports: "bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20",
      Dashboard: "bg-primary/10 text-primary border-primary/20",
    };
    return colors[module] || "bg-muted text-muted-foreground";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">What's New</DialogTitle>
        </DialogHeader>

        {/* Current Version Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              You're on version {currentVersion}
            </Badge>
          </div>

          {/* Current Release */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                Release {currentVersion}
              </h3>
              <p className="text-sm text-muted-foreground">{currentReleaseDate}</p>
            </div>

            <div className="space-y-3">
              {currentReleaseChanges.map((change, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{change.text}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {change.modules.map((module) => (
                        <Badge
                          key={module}
                          variant="outline"
                          className={cn("text-xs px-2 py-0.5", getModuleColor(module))}
                        >
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="default" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View documentation
              </Button>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Watch overview video
              </Button>
            </div>
          </div>

          {/* Past Releases */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Previous Releases</h3>

            {pastReleases.map((release) => {
              const isExpanded = expandedReleases.includes(release.version);

              return (
                <div key={release.version} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleRelease(release.version)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="outline" className="text-xs">
                        {release.version}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                      <span className="text-sm text-foreground">· {release.summary}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 bg-muted/20">
                      {release.sections.new && release.sections.new.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">New</h4>
                          <div className="space-y-2">
                            {release.sections.new.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">{item.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.modules.map((module) => (
                                      <Badge
                                        key={module}
                                        variant="outline"
                                        className={cn("text-xs px-1.5 py-0", getModuleColor(module))}
                                      >
                                        {module}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {release.sections.improved && release.sections.improved.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Improved</h4>
                          <div className="space-y-2">
                            {release.sections.improved.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">{item.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.modules.map((module) => (
                                      <Badge
                                        key={module}
                                        variant="outline"
                                        className={cn("text-xs px-1.5 py-0", getModuleColor(module))}
                                      >
                                        {module}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {release.sections.fixed && release.sections.fixed.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Fixed</h4>
                          <div className="space-y-2">
                            {release.sections.fixed.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-foreground">{item.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.modules.map((module) => (
                                      <Badge
                                        key={module}
                                        variant="outline"
                                        className={cn("text-xs px-1.5 py-0", getModuleColor(module))}
                                      >
                                        {module}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};