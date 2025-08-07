import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground text-center">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span>© 2025 TaskFlow. Made with ❤️ by</span>
            <a 
              href="https://ghassanabukhaled.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Ghassan Abu Khaled
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </a>
          </div>
          <div className="text-xs opacity-75">
            Built with React & TypeScript
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;