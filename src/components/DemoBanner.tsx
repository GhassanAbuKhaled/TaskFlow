import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoContext } from "@/contexts/DemoContext";

const DemoBanner = () => {
  const { isDemoMode } = useDemoContext();

  if (!isDemoMode) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center text-sm">
        <Info className="h-4 w-4 mr-2 text-primary" />
        <span>
          You're in <strong>Demo Mode</strong>. Changes won't be saved permanently.
        </span>
      </div>
      <div className="flex gap-2">
        <Link to="/register">
          <Button size="sm" variant="outline" className="text-xs h-7 w-[70px] px-0">
            Sign Up
          </Button>
        </Link>
        <Link to="/login">
          <Button size="sm" className="text-xs h-7 w-[70px] px-0">
            Log In
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DemoBanner;