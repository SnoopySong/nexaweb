import { motion } from "framer-motion";
import { Sparkles, Github, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Sites Web", href: "#services" },
    { label: "E-commerce", href: "#services" },
    { label: "Applications Web", href: "#services" },
    { label: "SEO", href: "#services" },
  ],
  company: [
    { label: "À propos", href: "#" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Témoignages", href: "#temoignages" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "CGV", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative bg-card/50 border-t border-border/50">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <motion.a
                href="#accueil"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#accueil");
                }}
                className="inline-flex items-center gap-2 text-xl font-bold mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <Sparkles className="w-7 h-7 text-primary" />
                  <div className="absolute inset-0 blur-lg bg-primary/30" />
                </div>
                <span className="text-gradient">NexaWeb</span>
                <span className="text-foreground/80">Studio</span>
              </motion.a>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Agence de création de sites web sur mesure. Transformons ensemble 
                votre vision digitale en réalité.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="p-2.5 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    whileHover={{ y: -3 }}
                    aria-label={social.label}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Entreprise
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }
                      }}
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Légal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NexaWeb Studio. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            Fait avec passion à Paris
          </p>
        </div>
      </div>
    </footer>
  );
}
