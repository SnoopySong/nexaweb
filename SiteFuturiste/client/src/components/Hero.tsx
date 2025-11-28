import { motion } from "framer-motion";
import { ArrowRight, Code2, Palette, Zap, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { averageRating, totalReviews } from "@/data/testimonialsData";

const techBadges = [
  { icon: Code2, label: "React" },
  { icon: Palette, label: "UI/UX" },
  { icon: Zap, label: "Performance" },
  { icon: Globe, label: "SEO" },
];

const floatingElements = [
  { x: "10%", y: "20%", delay: 0, size: 60 },
  { x: "85%", y: "15%", delay: 0.5, size: 40 },
  { x: "75%", y: "70%", delay: 1, size: 50 },
  { x: "15%", y: "75%", delay: 1.5, size: 35 },
  { x: "50%", y: "85%", delay: 2, size: 45 },
];

export function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl"
          style={{
            left: el.x,
            top: el.y,
            width: el.size,
            height: el.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 bg-primary/10">
              <Star className="w-3.5 h-3.5 mr-1.5 fill-yellow-400 text-yellow-400" />
              {averageRating}/5 - {totalReviews}+ clients satisfaits
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            data-testid="text-hero-title"
          >
            Créons ensemble votre{" "}
            <span className="text-gradient">présence digitale</span>{" "}
            du futur
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            data-testid="text-hero-subtitle"
          >
            Agence de création de sites web sur mesure. Design futuriste, 
            performance optimale et solutions digitales innovantes pour propulser votre business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("#contact")}
              className="text-lg px-8 py-6 glow-purple pulse-glow"
              data-testid="button-hero-cta"
            >
              Démarrer un Projet
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("#portfolio")}
              className="text-lg px-8 py-6"
              data-testid="button-hero-portfolio"
            >
              Voir le Portfolio
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {techBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50"
              >
                <badge.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
