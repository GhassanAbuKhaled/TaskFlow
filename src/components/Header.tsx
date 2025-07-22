import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { t } = useTranslation();

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
          
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          {/* <Button variant="ghost" size="sm" className="relative rounded-xl hover:bg-muted/50 transition-smooth p-0.5 sm:p-2">
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 bg-primary rounded-full"></span>
          </Button> */}

          {/* Settings - Hidden on mobile */}
          {/* <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted/50 transition-smooth hidden sm:flex p-1 sm:p-2">
            <Settings className="h-4 w-4 md:h-5 md:w-5" />
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;