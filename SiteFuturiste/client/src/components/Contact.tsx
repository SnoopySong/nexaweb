import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const budgetOptions = [
  { value: "moins-150", label: "Moins de 150€" },
  { value: "150-300", label: "150€ - 300€" },
  { value: "300-500", label: "300€ - 500€" },
  { value: "500-1000", label: "500€ - 1 000€" },
  { value: "plus-1000", label: "Plus de 1 000€" },
];

const projectTypes = [
  { value: "site-vitrine", label: "Site Vitrine" },
  { value: "e-commerce", label: "E-commerce" },
  { value: "application-web", label: "Application Web" },
  { value: "refonte", label: "Refonte de Site" },
  { value: "autre", label: "Autre" },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "abok57500@gmail.com" },
  { icon: Phone, label: "Téléphone", value: "06 27 52 46 47" },
  { icon: MapPin, label: "Adresse", value: "Paris, France" },
];

export function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: "",
      projectType: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative bg-card/30">
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
            Contact
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-contact-title">
            Démarrons votre <span className="text-gradient">Projet</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Parlez-nous de votre projet et recevez un devis personnalisé sous 24h. 
            Nous sommes impatients de collaborer avec vous !
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50 glass">
              <CardContent className="p-6 md:p-8">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 glow-cyan">
                      <CheckCircle className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Envoyé !</h3>
                    <p className="text-muted-foreground">
                      Merci pour votre message. Nous vous répondrons dans les 24 heures.
                    </p>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Votre nom" 
                                  {...field} 
                                  data-testid="input-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="votre@email.com" 
                                  {...field}
                                  data-testid="input-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="+33 6 12 34 56 78" 
                                  {...field}
                                  data-testid="input-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de projet</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-project-type">
                                    <SelectValue placeholder="Sélectionner..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {projectTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget estimé</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-budget">
                                  <SelectValue placeholder="Sélectionner votre budget..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {budgetOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre projet, vos objectifs et vos besoins..."
                                className="min-h-[150px] resize-none"
                                {...field}
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full glow-purple-sm"
                        disabled={mutation.isPending}
                        data-testid="button-submit-contact"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le Message
                            <Send className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <Card key={info.label} className="border-border/50 hover-elevate">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Réponse rapide garantie</h3>
                <p className="text-sm text-muted-foreground">
                  Nous répondons à toutes les demandes sous 24 heures ouvrées. 
                  Pour les projets urgents, appelez-nous directement.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
