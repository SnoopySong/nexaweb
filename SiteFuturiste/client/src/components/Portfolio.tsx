import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { projects, categories, type Project } from "@/data/portfolioData";

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === "Tous"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 border-accent/30 bg-accent/10 text-accent-foreground">
            Portfolio
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-portfolio-title">
            Nos <span className="text-gradient">Réalisations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez une sélection de projets réalisés pour nos clients. 
            Chaque site est unique et conçu sur mesure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.slice(0, 7).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "glow-purple-sm" : ""}
              data-testid={`button-category-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="group cursor-pointer overflow-visible border-border/50 hover-elevate"
                  onClick={() => setSelectedProject(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-md">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Button size="sm" variant="secondary" className="gap-2">
                          Voir le projet <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                        <span className="text-xs text-muted-foreground font-mono">{project.year}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-3xl glass">
            {selectedProject && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between gap-4">
                    <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                    <Badge>{selectedProject.category}</Badge>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold mb-2">Client</h4>
                    <p className="text-muted-foreground">{selectedProject.client}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
