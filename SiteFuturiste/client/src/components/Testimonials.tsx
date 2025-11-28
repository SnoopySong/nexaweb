import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { testimonials, averageRating, totalReviews } from "@/data/testimonialsData";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const displayedTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const goToPage = (page: number) => {
    setIsAutoPlaying(false);
    setCurrentPage(page);
  };

  const prevPage = () => {
    setIsAutoPlaying(false);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const nextPage = () => {
    setIsAutoPlaying(false);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section id="temoignages" className="py-24 md:py-32 relative overflow-hidden">
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
            Témoignages
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-testimonials-title">
            Ce que nos <span className="text-gradient">Clients</span> disent
          </h2>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-primary/20">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-2xl font-bold ml-2">{averageRating}</span>
              <span className="text-muted-foreground">/5</span>
            </div>
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totalReviews}+</span> avis clients
            </div>
          </div>
        </motion.div>

        <div className="relative" ref={containerRef}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="h-full border-border/50 hover-elevate"
                  data-testid={`card-testimonial-${testimonial.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>
                            {testimonial.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <Quote className="w-8 h-8 text-primary/20" />
                    </div>
                    
                    <StarRating rating={testimonial.rating} />
                    
                    <p className="text-sm text-foreground/80 mt-4 line-clamp-4">
                      "{testimonial.message}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              className="rounded-full"
              data-testid="button-testimonials-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentPage
                      ? "bg-primary w-8"
                      : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`button-testimonials-page-${i}`}
                />
              ))}
              {totalPages > 10 && (
                <span className="text-sm text-muted-foreground ml-2">
                  +{totalPages - 10}
                </span>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              className="rounded-full"
              data-testid="button-testimonials-next"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Page {currentPage + 1} sur {totalPages} ({totalReviews} avis au total)
          </p>
        </div>
      </div>
    </section>
  );
}
