import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, User, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    try {
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        navigate("/login");
      }
    } catch (err) {
      setError(t('register.errorMessage'));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('register.backToHome')}</span>
          </Link>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-large rounded-3xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="text-3xl font-bold text-primary mb-2">TaskFlow</div>
            <CardTitle className="text-2xl font-semibold">{t('register.createAccount')}</CardTitle>
            <CardDescription className="text-base">
              {t('register.subtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t('register.fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('register.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('register.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('register.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('register.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('register.passwordPlaceholder')}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('register.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12"
                    required
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                {t('register.termsAgreement')}{" "}
                <a href="#" className="text-primary hover:underline">{t('register.termsOfService')}</a>
                {" "}{t('register.and')}{" "}
                <a href="#" className="text-primary hover:underline">{t('register.privacyPolicy')}</a>.
              </div>

              <Button
                type="submit"
                className="w-full rounded-2xl h-12 text-base font-medium shadow-medium hover:shadow-large transition-all duration-300"
                disabled={isLoading}
              >
                <span className="whitespace-nowrap">{isLoading ? t('register.creatingAccount') : t('register.createAccountButton')}</span>
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t('register.alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('register.signIn')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;