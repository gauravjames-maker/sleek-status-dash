import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

interface SidebarNavItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  expandable?: boolean;
  badge?: string;
  href?: string;
  children?: SidebarNavItem[];
}

const navItems: SidebarNavItem[] = [
  {
    label: "Dashboard",
    expandable: true,
    active: true,
    children: [
      { label: "Performance", active: true, href: "/" },
      { label: "Operational", href: "/operational" },
    ],
  },
  {
    label: "Tasks running",
    href: "/tasks",
  },
  {
    label: "People",
    expandable: true,
    href: "/people",
  },
  {
    label: "Content",
    expandable: true,
    href: "/content",
  },
  {
    label: "Campaigns",
    expandable: true,
    href: "/campaigns",
  },
  {
    label: "Analytics",
    expandable: true,
    href: "/analytics",
  },
  {
    label: "Admin",
    expandable: true,
    href: "/admin",
  },
];

export const CampaignSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"]);

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
          <div className="flex gap-0.5">
            <div className="w-3 h-6 bg-primary" />
            <div className="w-3 h-6 bg-primary" />
          </div>
          <div>
            <div className="font-bold text-sm leading-none">MESSAGE</div>
            <div className="font-bold text-sm leading-none">GEARS</div>
          </div>
        </div>
        <button className="p-1 hover:bg-sidebar-accent rounded">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-sidebar-foreground">
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Brand workspace selector */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="text-xs text-muted-foreground mb-1.5">Brand workspace</div>
        <button className="w-full flex items-center justify-between px-3 py-2 bg-sidebar-accent rounded text-sm hover:bg-sidebar-accent/80 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-foreground rounded flex items-center justify-center">
              <span className="text-background text-xs font-bold">A</span>
            </div>
            <span className="font-medium">All selected</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={() => item.expandable && toggleItem(item.label)}
              className={cn(
                "w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium transition-colors",
                item.active && !item.children
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <span>{item.label}</span>
              {item.expandable && (
                expandedItems.includes(item.label) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )
              )}
            </button>

            {/* Children */}
            {item.children && expandedItems.includes(item.label) && (
              <div className="bg-sidebar-accent/50">
                {item.children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.href || "#"}
                    className={cn(
                      "block w-full px-8 py-2 text-sm text-left transition-colors text-sidebar-foreground hover:bg-sidebar-accent"
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
      <div className="border-t border-sidebar-border">
        <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <span>🔔</span>
          <span>Notifications</span>
        </button>
        <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <span>❓</span>
          <span>Help</span>
        </button>
        <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-xs">
            GJ
          </div>
          <span className="font-medium">Gaurav James</span>
        </button>
      </div>
    </aside>
  );
};
