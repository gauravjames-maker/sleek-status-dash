import { ChevronDown, ChevronUp, Gauge, ClipboardList, Users, ImageIcon, Send, BarChart3, Settings, Bell, HelpCircle, Layers } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

interface SidebarNavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  expandable?: boolean;
  badge?: string;
  href?: string;
  children?: SidebarNavItem[];
  iconColor?: string;
}

const navItems: SidebarNavItem[] = [
  {
    label: "Dashboard",
    icon: <Gauge className="w-5 h-5" />,
    expandable: true,
    active: true,
    children: [
      { label: "Performance", active: true, href: "/", icon: null },
      { label: "Operational", href: "/operational", icon: null },
    ],
  },
  {
    label: "Tasks running",
    icon: <ClipboardList className="w-5 h-5" />,
    href: "/tasks",
  },
  {
    label: "People",
    icon: <Users className="w-5 h-5" />,
    expandable: true,
    iconColor: "text-[#10B981]",
    children: [
      { label: "Audience", href: "/people/audience", icon: null },
      { label: "Blueprints", href: "/people/blueprints", icon: null },
      { label: "Profile lookup", href: "/people/profile-lookup", icon: null },
    ],
  },
  {
    label: "Content",
    icon: <ImageIcon className="w-5 h-5" />,
    expandable: true,
    iconColor: "text-[#EF4444]",
    children: [
      { label: "Templates", href: "/content/templates", icon: null },
      { label: "Global snippets", href: "/content/global-snippets", icon: null },
    ],
  },
  {
    label: "Campaigns",
    icon: <Send className="w-5 h-5" />,
    expandable: true,
    iconColor: "text-[#3B82F6]",
    children: [
      { label: "Marketing", href: "/campaigns/marketing", icon: null },
      { label: "Experiments", href: "/campaigns/experiments", icon: null },
      { label: "Transactional", href: "/campaigns/transactional", icon: null },
      { label: "External", href: "/campaigns/external", icon: null },
      { label: "Orchestration", href: "/campaigns/orchestration", icon: null },
    ],
  },
  {
    label: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    expandable: true,
    href: "/analytics",
    iconColor: "text-[#F59E0B]",
  },
  {
    label: "Admin",
    icon: <Settings className="w-5 h-5" />,
    expandable: true,
    iconColor: "text-[#8B5CF6]",
    children: [
      { label: "System Configuration", href: "/admin/system-configuration", icon: null },
      { label: "Campaign API", href: "/admin/campaign-api", icon: null },
    ],
  },
];

export const CampaignSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard", "Campaigns"]);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-[#C1554D] rounded-[1px]" />
            <div className="w-2 h-6 bg-[#C1554D] rounded-[1px]" />
            <div className="w-2 h-6 bg-[#C1554D] rounded-[1px]" />
            <div className="w-2 h-6 bg-[#C1554D] rounded-[1px]" />
          </div>
          <div>
            <div className="font-bold text-[13px] leading-tight tracking-tight">MESSAGE</div>
            <div className="font-bold text-[13px] leading-tight tracking-tight">GEARS</div>
          </div>
        </div>
        <button className="p-1 hover:bg-sidebar-accent rounded text-muted-foreground">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6L16 6M4 10L16 10M4 14L16 14" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Brand workspace selector */}
      <div className="p-4 pb-3">
        <div className="text-xs text-muted-foreground mb-2">Brand workspace</div>
        <button className="w-full flex items-center justify-between px-3 py-2.5 bg-card border border-border rounded-lg text-sm hover:bg-sidebar-accent transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground rounded flex items-center justify-center">
              <Layers className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold">All selected</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <ChevronUp className="h-3 w-3 text-primary" />
            <ChevronDown className="h-3 w-3 text-primary" />
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3">
        {navItems.map((item) => (
          <div key={item.label} className="mb-1">
            <button
              onClick={() => item.expandable && toggleItem(item.label)}
              className={cn(
                "w-full px-3 py-2.5 flex items-center justify-between text-[15px] font-semibold transition-colors rounded-lg border border-transparent",
                item.active && !item.children
                  ? "bg-card border-border"
                  : "text-foreground hover:bg-sidebar-accent"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={item.iconColor || ""}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.expandable && (
                <ChevronUp 
                  className={cn(
                    "h-4 w-4 text-primary transition-transform",
                    !expandedItems.includes(item.label) && "rotate-180"
                  )}
                />
              )}
            </button>

            {/* Children */}
            {item.children && expandedItems.includes(item.label) && (
              <div className="mt-1 ml-3 border-l-2 border-border">
                {item.children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.href || "#"}
                    className={cn(
                      "block pl-11 pr-3 py-2.5 text-[15px] text-left transition-colors text-foreground hover:bg-sidebar-accent rounded-r-lg"
                    )}
                    activeClassName="bg-primary/10 text-primary font-medium"
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-sidebar-border px-3 pt-4">
        <button className="w-full px-3 py-2.5 flex items-center gap-3 text-[15px] font-semibold text-foreground hover:bg-sidebar-accent transition-colors rounded-lg">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </button>
        <button className="w-full px-3 py-2.5 flex items-center gap-3 text-[15px] font-semibold text-foreground hover:bg-sidebar-accent transition-colors rounded-lg">
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>
        <button className="w-full px-3 py-2.5 flex items-center gap-3 text-[15px] font-semibold text-foreground hover:bg-sidebar-accent transition-colors rounded-lg mb-3">
          <div className="w-9 h-9 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold text-sm">
            GJ
          </div>
          <span>Guarav James</span>
        </button>
      </div>
    </aside>
  );
};
