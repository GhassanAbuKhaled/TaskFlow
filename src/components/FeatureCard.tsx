import { motion } from "framer-motion";
import { memo } from "react";
import { LucideIcon } from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

// Memoized feature card component to prevent unnecessary re-renders
const FeatureCard = memo(({ icon: Icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
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
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;