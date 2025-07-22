import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Plus, 
  Calendar,
  Settings,
  Archive,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: always show sidebar, allow collapse
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Create Task",
      href: "/create-task",
      icon: Plus,
    },
    // {
    //   name: "Calendar",
    //   href: "/calendar",
    //   icon: Calendar,
    // },
    // {
    //   name: "Archive",
    //   href: "/archive",
    //   icon: Archive,
    // },
    // {
    //   name: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    // },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen lg:h-full bg-sidebar transition-all duration-300 ease-in-out",
          // Mobile: slide in/out from left
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop: collapse/expand
          isCollapsed ? "lg:w-16" : "w-64 lg:w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-sidebar-border">
            {!isCollapsed && (
              <h1 className="text-base md:text-lg font-semibold text-sidebar-foreground">
                Menu
              </h1>
            )}
            <div className="flex items-center space-x-2">
              {/* Desktop collapse toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
              >
                <div className={cn(
                  "transition-transform duration-300",
                  isCollapsed ? "rotate-180" : "rotate-0"
                )}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 8l4-4v3h8v2H6v3l-4-4z"/>
                  </svg>
                </div>
              </Button>
              
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.name} to={item.href} onClick={handleLinkClick}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={cn(
                      "w-full rounded-2xl transition-smooth",
                      isCollapsed ? "p-5 flex justify-center" : "px-4 justify-start text-left",
                      active 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-medium hover:shadow-large" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 md:h-5 md:w-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && (
                      <span className="font-medium text-sm md:text-base">{item.name}</span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Spacer to push content to the top */}
          <div className="flex-grow"></div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;