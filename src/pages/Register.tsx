import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "@/hooks/useForm";
import { ValidationRules } from "@/lib/errors";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const form = useForm<RegisterForm>({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validation: {
      name: {
        required: true,
        rules: [ValidationRules.maxLength(50, t)]
      },
      email: {
        required: true,
        rules: [ValidationRules.email(t), ValidationRules.maxLength(100, t)]
      },
      password: {
        required: true,
        rules: [ValidationRules.password(t)]
      },
      confirmPassword: {
        required: true
      }
    },
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        form.setFieldError('confirmPassword', {
          type: 'VALIDATION',
          severity: 'LOW',
          message: t('register.passwordMismatch'),
          timestamp: new Date()
        });
        return;
      }
      const success = await register(values.name, values.email, values.password);
      if (success) {
        navigate("/login");
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
            <form onSubmit={form.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t('register.fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('register.fullNamePlaceholder')}
                    value={form.values.name}
                    onChange={(e) => form.setValue('name', e.target.value)}
                    onBlur={() => form.validateField('name')}
                    maxLength={50}
                    className={`pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12 ${
                      form.errors.name ? 'border-destructive' : ''
                    }`}
                    required
                  />
                </div>
                {form.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('register.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('register.emailPlaceholder')}
                    value={form.values.email}
                    onChange={(e) => form.setValue('email', e.target.value)}
                    onBlur={() => form.validateField('email')}
                    maxLength={100}
                    className={`pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12 ${
                      form.errors.email ? 'border-destructive' : ''
                    }`}
                    required
                  />
                </div>
                {form.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('register.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('register.passwordPlaceholder')}
                    value={form.values.password}
                    onChange={(e) => form.setValue('password', e.target.value)}
                    onBlur={() => form.validateField('password')}
                    className={`pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12 ${
                      form.errors.password ? 'border-destructive' : ''
                    }`}
                    required
                  />
                </div>
                {form.errors.password && (
                  <p className="text-sm text-destructive mt-1">{form.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('register.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                    value={form.values.confirmPassword}
                    onChange={(e) => form.setValue('confirmPassword', e.target.value)}
                    onBlur={() => form.validateField('confirmPassword')}
                    className={`pl-10 rounded-2xl border-border/50 focus:border-primary/50 h-12 ${
                      form.errors.confirmPassword ? 'border-destructive' : ''
                    }`}
                    required
                  />
                </div>
                {form.errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{form.errors.confirmPassword.message}</p>
                )}
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
                disabled={form.isSubmitting || !form.isValid}
              >
                <span className="whitespace-nowrap">{form.isSubmitting ? t('register.creatingAccount') : t('register.createAccountButton')}</span>
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