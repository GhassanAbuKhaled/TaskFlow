import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import SEO from "@/components/SEO";
import { useErrorHandler } from "@/hooks/useErrorHandler";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Import authAPI dynamically to avoid circular imports
      const { authAPI } = await import("@/lib/api");
      
      await authAPI.forgotPassword({ email });
      setIsSuccess(true);
    } catch (err: any) {
      handleError(err, 'forgotPassword');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <SEO 
          title="Password Reset Email Sent - TaskFlow"
          description="Password reset instructions have been sent to your email address."
        />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-xl">{t('forgotPassword.success')}</CardTitle>
            <CardDescription>
              {t('forgotPassword.successMessage')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('forgotPassword.didntReceiveEmail')}
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="w-full"
              >
                {t('forgotPassword.tryDifferentEmail')}
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('forgotPassword.backToLogin')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <SEO 
        title="Forgot Password - TaskFlow"
        description="Reset your TaskFlow account password. Enter your email to receive password reset instructions."
      />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('forgotPassword.title')}</CardTitle>
          <CardDescription>
            {t('forgotPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? t('forgotPassword.sending') : t('forgotPassword.sendResetLink')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;