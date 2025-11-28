import { 
  Globe, 
  ShoppingCart, 
  Smartphone, 
  Search, 
  Wrench, 
  MessageSquare,
  Palette,
  Rocket,
  Shield
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: typeof Globe;
  price: string;
}

export const services: Service[] = [
  {
    id: "website",
    title: "Sites Web Sur Mesure",
    description: "Création de sites web uniques et performants qui reflètent parfaitement votre marque et captivent vos visiteurs.",
    features: [
      "Design personnalisé et moderne",
      "Responsive tous appareils",
      "Optimisé pour la performance",
      "CMS intuitif"
    ],
    icon: Globe,
    price: "À partir de 150€"
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Boutiques en ligne complètes avec gestion des stocks, paiements sécurisés et tableau de bord analytique.",
    features: [
      "Catalogue produits illimité",
      "Paiements Stripe/PayPal",
      "Gestion des commandes",
      "Intégration livraison"
    ],
    icon: ShoppingCart,
    price: "À partir de 300€"
  },
  {
    id: "webapp",
    title: "Applications Web",
    description: "Applications web sur mesure avec fonctionnalités avancées, API robustes et interfaces utilisateur innovantes.",
    features: [
      "Architecture scalable",
      "Base de données sécurisée",
      "API REST / GraphQL",
      "Temps réel WebSocket"
    ],
    icon: Smartphone,
    price: "Sur devis"
  },
  {
    id: "seo",
    title: "SEO & Référencement",
    description: "Optimisation complète pour les moteurs de recherche. Augmentez votre visibilité et attirez plus de clients.",
    features: [
      "Audit SEO complet",
      "Optimisation technique",
      "Stratégie de contenu",
      "Suivi et rapports"
    ],
    icon: Search,
    price: "À partir de 50€/mois"
  },
  {
    id: "maintenance",
    title: "Maintenance & Support",
    description: "Service de maintenance continue pour garder votre site sécurisé, rapide et à jour.",
    features: [
      "Mises à jour régulières",
      "Sauvegardes automatiques",
      "Monitoring 24/7",
      "Support prioritaire"
    ],
    icon: Wrench,
    price: "À partir de 20€/mois"
  },
  {
    id: "consulting",
    title: "Conseil & Stratégie",
    description: "Accompagnement stratégique pour définir votre présence digitale et atteindre vos objectifs business.",
    features: [
      "Analyse de marché",
      "Stratégie digitale",
      "Roadmap technologique",
      "Formation équipes"
    ],
    icon: MessageSquare,
    price: "À partir de 80€"
  },
  {
    id: "design",
    title: "Design UI/UX",
    description: "Conception d'interfaces utilisateur élégantes et d'expériences utilisateur mémorables.",
    features: [
      "Wireframes & Prototypes",
      "Design system complet",
      "Tests utilisateurs",
      "Accessibilité WCAG"
    ],
    icon: Palette,
    price: "À partir de 60€"
  },
  {
    id: "performance",
    title: "Optimisation Performance",
    description: "Accélérez votre site pour une meilleure expérience utilisateur et un meilleur référencement.",
    features: [
      "Audit Core Web Vitals",
      "Optimisation images",
      "Cache et CDN",
      "Code splitting"
    ],
    icon: Rocket,
    price: "À partir de 40€"
  },
  {
    id: "security",
    title: "Sécurité Web",
    description: "Protection complète de votre site contre les menaces et conformité aux normes de sécurité.",
    features: [
      "Audit sécurité",
      "Certificats SSL",
      "Protection DDoS",
      "Conformité RGPD"
    ],
    icon: Shield,
    price: "À partir de 30€"
  }
];
