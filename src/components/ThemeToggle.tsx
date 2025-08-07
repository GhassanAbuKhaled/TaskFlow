import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or use light mode as default
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    // Only use dark if explicitly set in localStorage
    const shouldBeDark = stored === "dark";
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-xl hover:bg-muted/60 relative overflow-hidden group border border-border/50"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: isDark ? 90 : 0,
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="absolute"
        >
          <Sun className="h-5 w-5 text-primary" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: isDark ? 0 : -90,
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="absolute"
        >
          <Moon className="h-5 w-5 text-primary" />
        </motion.div>
      </div>
      
      {/* Enhanced background animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`absolute inset-0 rounded-xl ${
          isDark 
            ? 'bg-primary/10' 
            : 'bg-secondary-accent/10'
        }`}
      />
    </Button>
  );
};

export default ThemeToggle;