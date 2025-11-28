export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  avatar: string;
}

const firstNames = [
  "Marie", "Jean", "Sophie", "Pierre", "Camille", "Thomas", "Julie", "Nicolas", "Emma", "Lucas",
  "Léa", "Hugo", "Chloé", "Maxime", "Manon", "Alexandre", "Sarah", "Antoine", "Laura", "Julien",
  "Charlotte", "Mathieu", "Alice", "Benjamin", "Pauline", "Florian", "Margot", "Romain", "Clara", "Guillaume",
  "Océane", "Clément", "Zoé", "Valentin", "Inès", "Théo", "Eva", "Louis", "Jade", "Alexis",
  "Lucie", "Victor", "Juliette", "Gabriel", "Anaïs", "Raphaël", "Louise", "David", "Elisa", "Paul",
  "Nathalie", "Michel", "Catherine", "François", "Isabelle", "Philippe", "Anne", "Christophe", "Martine", "Laurent"
];

const lastNames = [
  "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau",
  "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier",
  "Morel", "Girard", "André", "Lefèvre", "Mercier", "Dupont", "Lambert", "Bonnet", "François", "Martinez",
  "Legrand", "Garnier", "Faure", "Rousseau", "Blanc", "Guérin", "Muller", "Henry", "Roussel", "Nicolas",
  "Perrin", "Morin", "Mathieu", "Clément", "Gauthier", "Dumont", "Lopez", "Fontaine", "Chevalier", "Robin"
];

const roles = [
  "Directeur", "Directrice", "CEO", "Fondateur", "Fondatrice", "Gérant", "Gérante",
  "Responsable Marketing", "Responsable Communication", "Chef de Projet", "Entrepreneur",
  "Manager", "Consultant", "Consultante", "Directeur Commercial", "Directrice Commerciale"
];

const companies = [
  "Solutions Tech", "Digital Agency", "StartUp Innovation", "Media Group", "Consulting Pro",
  "E-commerce Plus", "Studio Créatif", "Marketing Expert", "Business Solutions", "Tech Innovate",
  "Digital Lab", "Creative Studio", "Web Solutions", "Smart Business", "Innovation Hub",
  "Growth Partners", "Design Studio", "Strategy Group", "Performance Labs", "Success Team"
];

const messages = [
  "Une équipe exceptionnelle qui a su comprendre nos besoins et les transformer en un site web remarquable. Le résultat dépasse toutes nos attentes !",
  "Professionnalisme et créativité au rendez-vous. Notre nouveau site a augmenté notre trafic de 200% en seulement 3 mois.",
  "Je recommande vivement ! Un travail de qualité, des délais respectés et une communication parfaite tout au long du projet.",
  "Le meilleur investissement que nous ayons fait pour notre entreprise. Le ROI a été visible dès le premier mois.",
  "Un design moderne et une expérience utilisateur fluide. Nos clients adorent notre nouveau site !",
  "Réactivité et expertise technique impressionnantes. Ils ont résolu des problèmes complexes avec une facilité déconcertante.",
  "Notre e-commerce a vu ses ventes tripler depuis la refonte. Un partenaire de confiance pour notre croissance digitale.",
  "Une approche sur-mesure qui fait toute la différence. Chaque détail a été pensé pour notre marque.",
  "Excellente collaboration du début à la fin. L'équipe est à l'écoute et force de proposition.",
  "Le site est non seulement beau mais aussi performant. Les temps de chargement sont exceptionnels.",
  "Un accompagnement de qualité même après la livraison. Le support est réactif et efficace.",
  "Notre taux de conversion a explosé grâce à l'optimisation UX. Merci pour ce travail remarquable !",
  "Ils ont su capturer l'essence de notre marque et la traduire en une expérience digitale unique.",
  "Un partenaire stratégique qui comprend les enjeux business. Pas juste des développeurs, de vrais consultants.",
  "La qualité du code est irréprochable. Notre équipe tech interne est impressionnée par le travail fourni.",
  "Notre présence en ligne a été transformée. Nous recevons des compliments de nos clients chaque jour.",
  "Rapport qualité/prix imbattable. Le résultat vaut largement l'investissement.",
  "Une refonte qui a repositionné notre marque sur le marché. Nous sommes désormais perçus comme des leaders.",
  "Délais tenus, budget respecté et résultat au-delà des attentes. Que demander de plus ?",
  "L'intégration des fonctionnalités avancées s'est faite sans accroc. Une expertise technique rare.",
  "Notre site est maintenant notre meilleur commercial. Il travaille pour nous 24h/24.",
  "La formation fournie nous permet d'être autonomes. Un vrai transfert de compétences.",
  "Chaque page est une œuvre d'art. Le design est à couper le souffle.",
  "SEO optimisé dès le départ. Nous sommes premiers sur nos mots-clés principaux.",
  "Une équipe passionnée qui met le même soin dans chaque projet, petit ou grand.",
  "Le dashboard admin est un plaisir à utiliser. Tout est intuitif et bien pensé.",
  "Notre communauté a doublé depuis le lancement du nouveau site. L'engagement est au rendez-vous.",
  "La version mobile est parfaite. Une expérience fluide sur tous les appareils.",
  "Ils ont su anticiper nos besoins futurs. Le site est évolutif et flexible.",
  "Un investissement qui s'est rentabilisé en quelques semaines. Impressionnant !",
  "La gestion de projet était impeccable. Points réguliers, transparence totale.",
  "Notre image de marque a été complètement revalorisée. Nous paraissons 10 fois plus professionnels.",
  "Les animations et interactions sont subtiles mais font toute la différence.",
  "Un site qui nous ressemble enfin ! Ils ont parfaitement compris notre ADN.",
  "La performance du site est exceptionnelle. Même en pics de trafic, tout reste fluide.",
  "Merci pour cette collaboration enrichissante. C'était un vrai plaisir de travailler ensemble.",
  "Notre équipe commerciale est ravie. Le site génère des leads qualifiés chaque jour.",
  "L'accessibilité a été prise en compte dès le départ. Un site inclusif et moderne.",
  "La sécurité du site nous rassure. Toutes les bonnes pratiques ont été respectées.",
  "Un travail d'orfèvre sur chaque détail. On sent la passion pour le métier.",
  "Notre boutique en ligne fonctionne parfaitement. Zéro bug depuis le lancement.",
  "L'équipe a su s'adapter à nos contraintes spécifiques. Une flexibilité appréciable.",
  "Le blog intégré nous permet de communiquer efficacement. Le CMS est un bonheur.",
  "Notre concurrent principal nous envie maintenant notre site. Mission accomplie !",
  "La stratégie digitale proposée était pertinente. Des conseils précieux au-delà du dev.",
  "Chaque euro investi a été rentabilisé. Un partenaire qui pense business.",
  "L'intégration avec nos outils existants s'est faite sans problème. Bravo !",
  "Notre NPS a augmenté de 40 points. Les clients adorent l'expérience.",
  "Un site multilingue parfaitement géré. L'expansion internationale est facilitée.",
  "La documentation fournie est complète. Nous pouvons tout gérer en autonomie.",
  "Réactivité exceptionnelle même pour les petites modifications post-lancement.",
  "Notre taux de rebond a chuté de 60%. Les visiteurs restent et convertissent.",
  "L'hébergement et la maintenance sont gérés avec professionnalisme.",
  "Une vraie transformation digitale pour notre entreprise. Merci infiniment !",
  "Le formulaire de contact génère 5x plus de demandes qu'avant.",
  "Notre newsletter intégrée au site performe excellemment. +300% d'inscriptions.",
  "L'analytics est bien configuré. Nous avons une vision claire de nos performances.",
  "Un site éco-responsable comme promis. L'empreinte carbone a été optimisée.",
  "La galerie portfolio est sublime. Nos réalisations sont enfin mises en valeur.",
  "Chaque page raconte une histoire. Le storytelling est maîtrisé.",
  "Les micro-interactions rendent la navigation plaisante. C'est du grand art !",
];

function generateTestimonials(): Testimonial[] {
  const testimonials: Testimonial[] = [];
  
  const ratings = [5, 5, 5, 5, 5, 5, 5, 5, 4, 5];
  
  for (let i = 0; i < 124; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const message = messages[i % messages.length];
    const rating = ratings[Math.floor(Math.random() * ratings.length)];
    const avatarSeed = `${firstName}${lastName}${i}`;
    
    testimonials.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      role,
      company,
      message,
      rating,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    });
  }
  
  return testimonials;
}

export const testimonials = generateTestimonials();

export function calculateAverageRating(): number {
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
  return Math.round((total / testimonials.length) * 10) / 10;
}

export const averageRating = calculateAverageRating();
export const totalReviews = testimonials.length;
