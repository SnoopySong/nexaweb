import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/data/servicesData";

export function Services() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 md:py-32 relative bg-card/30">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 bg-primary/10">
            Services
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-services-title">
            Nos <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une gamme complète de services digitaux pour répondre à tous vos besoins. 
            De la conception au déploiement, nous vous accompagnons.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card 
                className="h-full group border-border/50 hover-elevate"
                data-testid={`card-service-${service.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:glow-purple-sm transition-shadow">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{service.price}</span>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={scrollToContact}
            className="glow-purple-sm"
            data-testid="button-services-cta"
          >
            Demander un Devis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
