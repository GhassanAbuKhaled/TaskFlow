import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
      <div className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-large max-w-md w-full">
        <div className="text-6xl font-bold text-primary mb-6">404</div>
        <h1 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button className="rounded-2xl w-[160px] h-10 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default NotFound;