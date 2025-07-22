import { motion, LazyMotion, domAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import heroImage from "@/assets/hero-image.jpg";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Animation variants with smoother transitions
const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

// Default transition for text elements
const textTransition = { 
  type: "tween", 
  ease: "easeOut", 
  duration: 0.4 
};

// Optimized Welcome component
const Welcome = () => {
  const { t } = useTranslation();
  // Memoize features to prevent unnecessary re-renders
  const features = useMemo(() => [
    {
      icon: CheckCircle,
      title: t('welcome.features.taskManagement.title'),
      description: t('welcome.features.taskManagement.description')
    },
    {
      icon: Calendar,
      title: t('welcome.features.deadlineTracking.title'),
      description: t('welcome.features.deadlineTracking.description')
    },
    {
      icon: Tag,
      title: t('welcome.features.smartTags.title'),
      description: t('welcome.features.smartTags.description')
    }
  ], [t]);

  // Memoize feature cards for better performance
  const featureCards = useMemo(() => {
    return features.map((feature, index) => {
      const Icon = feature.icon;
      const featureKey = `${feature.title}-${index}`;
      
      return (
        <motion.div
          key={featureKey}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="bg-card rounded-3xl p-5 sm:p-6 md:p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50"
        >
          <motion.div 
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary mb-4 sm:mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      );
    });
  }, [features]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-soft transition-colors duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="relative z-10 flex flex-wrap items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="text-xl md:text-2xl font-bold text-primary">TaskFlow</div>
          <div className="flex items-center gap-1 xs:gap-2 md:gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="ghost" className="font-medium text-xs sm:text-sm md:text-base w-[70px] sm:w-[100px] h-8 sm:h-10">
                <span className="whitespace-nowrap">{t('navbar.login')}</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div 
                className="space-y-8"
                variants={fadeInLeft}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
              >
                <div className="space-y-4">
                  <motion.h1 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight will-change-transform"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.1 }}
                  >
                    {t('welcome.title')}
                    <span className="block text-primary dark:text-primary">{t('welcome.subtitle')}</span>
                  </motion.h1>
                  <motion.p 
                    className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed will-change-transform"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.2 }}
                  >
                    {t('welcome.description')}
                  </motion.p>
                </div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 will-change-transform"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-[200px] h-[50px] sm:h-[60px] rounded-2xl text-base sm:text-lg font-medium shadow-medium hover:shadow-large transition-colors large-button-stable">
                        <span className="whitespace-nowrap">{t('welcome.getStarted')}</span>
                        <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/demo">
                      <Button variant="outline" size="lg" className="w-full sm:w-[160px] h-[50px] sm:h-[60px] rounded-2xl text-base sm:text-lg font-medium bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors large-button-stable">
                        <span className="whitespace-nowrap">{t('welcome.viewDemo')}</span>
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Image */}
              <motion.div 
                className="relative"
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", ease: "easeOut", duration: 0.4, delay: 0.2 }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-large">
                  <motion.img 
                    src={heroImage}
                    alt="Task Management Interface"
                    className="w-full h-auto"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent dark:from-primary/20"></div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-24">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                {t('welcome.features.title')}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('welcome.features.subtitle')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {featureCards}
            </div>
          </div>
        </main>
      </div>
    </LazyMotion>
  );
};

export default Welcome;