import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoContext } from "@/contexts/DemoContext";
import { useTranslation } from "react-i18next";

const DemoBanner = () => {
  const { t } = useTranslation();
  const { isDemoMode } = useDemoContext();

  if (!isDemoMode) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
      <div className="flex items-center text-sm">
        <Info className="h-5 w-5 sm:h-4 sm:w-4 mr-2 text-primary flex-shrink-0" />
        <span>
          {t('demo.message')} <strong>{t('demo.demoMode')}</strong>. {t('demo.changesNotSaved')}
        </span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-start mt-1 sm:mt-0">
        <Link to="/register" className="w-full sm:w-auto max-w-[100px]">
          <Button size="sm" variant="outline" className="text-xs h-7 w-full sm:w-auto min-w-[80px] max-w-[100px] px-2">
            {t('demo.signUp')}
          </Button>
        </Link>
        <Link to="/login" className="w-full sm:w-auto max-w-[100px]">
          <Button size="sm" className="text-xs h-7 w-full sm:w-auto min-w-[80px] max-w-[100px] px-2">
            {t('demo.signIn')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DemoBanner;