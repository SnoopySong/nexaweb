export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  tags: string[];
  imageUrl: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "LuxeShop E-commerce",
    client: "LuxeShop Paris",
    category: "E-commerce",
    description: "Plateforme e-commerce haut de gamme avec plus de 5000 produits, paiement sécurisé et gestion des stocks en temps réel. Design épuré et expérience utilisateur optimisée.",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
    imageUrl: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80",
    year: "2024"
  },
  {
    id: "2", 
    title: "Dashboard Analytics Pro",
    client: "DataViz Corp",
    category: "SaaS",
    description: "Tableau de bord analytique avancé avec visualisations temps réel, rapports automatisés et intégrations multiples. Interface moderne et intuitive.",
    tags: ["Vue.js", "D3.js", "Python", "AWS"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    year: "2024"
  },
  {
    id: "3",
    title: "Restaurant Le Gourmet",
    client: "Le Gourmet Paris",
    category: "Restaurant",
    description: "Site vitrine élégant avec réservation en ligne, menu interactif et galerie photos. Optimisé SEO pour une visibilité locale maximale.",
    tags: ["Next.js", "Tailwind", "Sanity CMS"],
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    year: "2024"
  },
  {
    id: "4",
    title: "ImmoVision Platform",
    client: "ImmoVision Group",
    category: "Immobilier",
    description: "Portail immobilier avec recherche avancée, visites virtuelles 360°, estimation automatique et gestion des agents. Plus de 10,000 biens listés.",
    tags: ["React", "Three.js", "Node.js", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    year: "2023"
  },
  {
    id: "5",
    title: "Fashion Brand Identity",
    client: "Élégance Mode",
    category: "Mode",
    description: "Site e-commerce mode avec lookbook interactif, personnalisation produits et programme de fidélité. Design haute couture et animations fluides.",
    tags: ["Shopify", "React", "GSAP", "Contentful"],
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    year: "2023"
  },
  {
    id: "6",
    title: "TechStart Landing",
    client: "TechStart Innovation",
    category: "Startup",
    description: "Landing page conversion-optimisée pour startup tech. A/B testing intégré, analytics avancés et taux de conversion augmenté de 340%.",
    tags: ["Next.js", "Framer Motion", "Vercel"],
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    year: "2023"
  },
  {
    id: "7",
    title: "FitLife Application",
    client: "FitLife Studio",
    category: "Fitness",
    description: "Application web fitness avec suivi d'entraînements, nutrition personnalisée et communauté active. Plus de 50,000 utilisateurs actifs.",
    tags: ["React Native", "Firebase", "Node.js"],
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    year: "2023"
  },
  {
    id: "8",
    title: "CreativeAgency Portfolio",
    client: "Creative Minds Agency",
    category: "Agence",
    description: "Portfolio agence créative avec animations spectaculaires, galerie projets et formulaire devis interactif. Design primé et UX innovante.",
    tags: ["Gatsby", "Three.js", "GSAP", "Prismic"],
    imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
    year: "2024"
  },
  {
    id: "9",
    title: "EduLearn Platform",
    client: "EduLearn Academy",
    category: "Education",
    description: "Plateforme e-learning complète avec cours vidéo, quiz interactifs, certifications et suivi de progression. Plus de 200 cours disponibles.",
    tags: ["React", "Node.js", "MongoDB", "WebRTC"],
    imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
    year: "2024"
  },
  {
    id: "10",
    title: "MediCare Health Portal",
    client: "MediCare Clinics",
    category: "Santé",
    description: "Portail santé sécurisé avec prise de rendez-vous, téléconsultation et dossier médical électronique. Conforme RGPD et HDS.",
    tags: ["React", "Node.js", "PostgreSQL", "WebRTC"],
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    year: "2024"
  }
];

export const categories = [
  "Tous",
  "E-commerce", 
  "SaaS",
  "Restaurant",
  "Immobilier",
  "Mode",
  "Startup",
  "Fitness",
  "Agence",
  "Education",
  "Santé"
];
