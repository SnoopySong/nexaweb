import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#services", label: "Services" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between gap-4">
            <motion.a
              href="#accueil"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#accueil");
              }}
              className="flex items-center gap-2 text-xl font-bold"
              whileHover={{ scale: 1.02 }}
              data-testid="link-logo"
            >
              <div className="relative">
                <Sparkles className="w-7 h-7 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/30" />
              </div>
              <span className="text-gradient">NexaWeb</span>
              <span className="text-foreground/80">Studio</span>
            </motion.a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-md hover-elevate"
                  whileHover={{ y: -2 }}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    data-testid="link-admin"
                  >
                    <a href="/admin">Admin</a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    data-testid="button-logout"
                  >
                    <a href="/api/logout">Déconnexion</a>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                  data-testid="button-login"
                >
                  <a href="/api/login">Admin</a>
                </Button>
              )}
              <Button
                onClick={() => scrollToSection("#contact")}
                className="hidden sm:flex glow-purple-sm"
                data-testid="button-cta-header"
              >
                Démarrer un Projet
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden glass border-b border-border/50"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="px-4 py-3 text-left text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  onClick={() => scrollToSection("#contact")}
                  className="mt-2 glow-purple-sm"
                  data-testid="button-cta-mobile"
                >
                  Démarrer un Projet
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
