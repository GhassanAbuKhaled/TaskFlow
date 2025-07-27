import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoContext } from "@/contexts/DemoContext";
import { useForm } from "@/hooks/useForm";
import { ValidationRules } from "@/lib/errors";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { setDemoMode } = useDemoContext();

  const form = useForm<LoginForm>({
    initialValues: { email: '', password: '' },
    validation: {
      email: {
        required: true,
        rules: [ValidationRules.email(t)]
      },
      password: {
        required: true,
        rules: [ValidationRules.minLength(6, t)]
      }
    },
    onSubmit: async (values) => {
      const success = await login(values.email, values.password);
      if (success) {
        setDemoMode(false);
        navigate("/dashboard");
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">{t('login.backToHome')}</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-large rounded-3xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="text-3xl font-bold text-primary mb-2">TaskFlow</div>
            <CardTitle className="text-2xl font-semibold">{t('login.welcomeBack')}</CardTitle>
            <CardDescription className="text-base">
              {t('login.signInDescription')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('login.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={form.values.email}
                    onChange={(e) => form.setValue('email', e.target.value)}
                    onBlur={() => form.validateField('email')}
                    className={`pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12 ${
                      form.errors.email ? 'border-destructive' : ''
                    }`}
                    required
                  />
                  {form.errors.email && (
                    <p className="text-sm text-destructive mt-1">{form.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('login.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('login.passwordPlaceholder')}
                    value={form.values.password}
                    onChange={(e) => form.setValue('password', e.target.value)}
                    onBlur={() => form.validateField('password')}
                    className={`pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12 ${
                      form.errors.password ? 'border-destructive' : ''
                    }`}
                    required
                  />
                  {form.errors.password && (
                    <p className="text-sm text-destructive mt-1">{form.errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div> */}

              <Button
                type="submit"
                className="w-full rounded-2xl h-12 text-base font-medium shadow-medium hover:shadow-large transition-all duration-300"
                disabled={form.isSubmitting || !form.isValid}
              >
                <span className="whitespace-nowrap">{form.isSubmitting ? t('login.signingIn') : t('login.signIn')}</span>
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t('login.noAccount')}{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t('login.signUp')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;