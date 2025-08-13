import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 px-2 py-1.5 sm:px-4 sm:py-3 md:px-6 md:py-4 transition-colors duration-300 sticky top-0 z-30">
      <div className="flex items-center justify-between mx-auto">
        <div className={cn(
          "flex items-center",
          isRTL ? "space-x-reverse space-x-1 sm:space-x-2 md:space-x-4" : "space-x-1 sm:space-x-2 md:space-x-4"
        )}>
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

        <div className={cn(
          "flex items-center",
          isRTL ? "space-x-reverse space-x-0.5 sm:space-x-2 md:space-x-4" : "space-x-0.5 sm:space-x-2 md:space-x-4"
        )}>
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* Language switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;