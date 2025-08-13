import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useErrorHandler } from "@/hooks/useErrorHandler";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const { handleError } = useErrorHandler();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "de");

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
    } catch (error) {
      handleError(error as Error, 'changeLanguage');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl transition-colors duration-300 hover:bg-muted/60 relative overflow-hidden group border border-border/50"
          aria-label={t("language.switchLanguage")}
        >
          <Globe className="h-5 w-5 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={currentLanguage === "en" ? "bg-muted" : ""}
        >
          {t("language.en")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("de")}
          className={currentLanguage === "de" ? "bg-muted" : ""}
        >
          {t("language.de")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("ar")}
          className={currentLanguage === "ar" ? "bg-muted" : ""}
        >
          {t("language.ar")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;