import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, User, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  userName?: string;
  onToggleSidebar?: () => void;
}

const Header = ({ userName, onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const displayName = userName || (user ? user.username : "User");
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 px-2 py-1.5 sm:px-4 sm:py-3 md:px-6 md:py-4 transition-colors duration-300 sticky top-0 z-30">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden rounded-xl hover:bg-muted/50 transition-smooth"
            onClick={onToggleSidebar}
          >
            <Menu className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </Button>
          
          <Link to="/dashboard" className="text-base sm:text-xl md:text-2xl font-bold text-primary transition-colors">
            TaskFlow
          </Link>
        </div>

        <div className="flex items-center space-x-0.5 sm:space-x-2 md:space-x-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          {/* <Button variant="ghost" size="sm" className="relative rounded-xl hover:bg-muted/50 transition-smooth p-0.5 sm:p-2">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 bg-primary rounded-full"></span>
          </Button> */}

          {/* Settings - Hidden on mobile */}
          {/* <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted/50 transition-smooth hidden sm:flex p-1 sm:p-2">
            <Settings className="h-4 w-4 md:h-5 md:w-5" />
          </Button> */}

          {/* User Menu */}
          <div className="flex items-center space-x-0.5 sm:space-x-2 md:space-x-3 pl-1 sm:pl-2 md:pl-4 border-l border-border/50">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center transition-colors">
                <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground hidden sm:block">
                {displayName}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth p-0.5 sm:p-2"
            >
              <LogOut className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;