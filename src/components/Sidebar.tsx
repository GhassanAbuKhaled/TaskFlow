import { useState, useEffect, useMemo, ElementType } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CheckSquare, Plus, X, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoContext } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: ElementType;
  isProfile?: boolean;
  showAtBottom?: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userName?: string;
}

const Sidebar = ({ isOpen, onToggle, userName }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isDemoMode } = useDemoContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const displayName = userName || (user ? user.username : "User");
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => window.innerWidth >= 1024 && setIsCollapsed(false);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigation = useMemo(() => [
    {
      name: t('navbar.dashboard'),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t('navbar.tasks'),
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: t('navbar.createTask'),
      href: "/create-task",
      icon: Plus,
    },
    // Only add profile and logout when not in demo mode
    ...(!isDemoMode ? [
      {
        name: displayName,
        href: "#",
        icon: User,
        isProfile: true,
        showAtBottom: true
      },
      {
        name: t('navbar.logout'),
        href: "#",
        icon: LogOut,
        onClick: handleLogout,
        showAtBottom: true,
        isDanger: true
      }
    ] : [])
  ], [t, isDemoMode, displayName, handleLogout]);

  const isActive = (href: string) => location.pathname === href;
  const handleLinkClick = () => window.innerWidth < 1024 && onToggle();
  
  // Render a standard navigation item
  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link key={item.name} to={item.href} onClick={item.onClick || handleLinkClick}>
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
  };
  
  // Render a bottom navigation item (profile or logout)
  const renderBottomNavItem = (item: NavItem) => {
    const Icon = item.icon;
    
    return (
      <Link key={item.name} to={item.href} onClick={item.onClick || handleLinkClick}>
        {item.isProfile && !isCollapsed ? (
          <div className="flex items-center space-x-3 mb-3 px-2">
            <div className="w-10 h-10 bg-sidebar-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-sidebar-primary" />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[150px]" title={item.name}>
              {item.name}
            </span>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={item.onClick}
            className={cn(
              "rounded-xl transition-smooth",
              isCollapsed ? "p-2 flex justify-center w-full" : "w-full justify-start px-4",
              item.isDanger 
                ? "text-sidebar-foreground hover:text-destructive hover:bg-destructive/10" 
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className={cn("h-4 w-4 md:h-5 md:w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && !item.isProfile && (
              <span className="font-medium text-sm">{item.name}</span>
            )}
          </Button>
        )}
      </Link>
    );
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
                {t('navbar.menu')}
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
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                  className={cn("transition-transform duration-300", isCollapsed ? "rotate-180" : "rotate-0")}
                >
                  <path d="M2 8l4-4v3h8v2H6v3l-4-4z"/>
                </svg>
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

          {/* Main Navigation */}
          <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-hidden">
            {navigation.filter(item => !item.showAtBottom).map(renderNavItem)}
          </nav>

          {/* Spacer to push content to the top */}
          <div className="flex-grow"></div>
          
          {/* Bottom Navigation (User Profile & Logout) */}
          {navigation.some(item => item.showAtBottom) && (
            <nav className="p-3 md:p-4 space-y-2 border-t border-sidebar-border">
              {navigation.filter(item => item.showAtBottom).map(renderBottomNavItem)}
            </nav>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;