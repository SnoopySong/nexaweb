import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocation } from "wouter";
import { 
  Mail, 
  MailOpen, 
  LogOut, 
  Inbox, 
  Clock, 
  Phone, 
  DollarSign,
  FileText,
  Sparkles,
  Trash2,
  CheckCircle,
  Loader2,
  Download,
  Tag,
  Plus,
  X,
  BarChart3,
  Eye,
  TrendingUp,
  FileDown,
  MessageSquare,
  Palette,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Message, Tag as TagType, Template } from "@shared/schema";

const TAG_COLORS = [
  "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#6366F1", "#14B8A6"
];

function MessageSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TagBadge({ tag, onRemove }: { tag: TagType; onRemove?: () => void }) {
  return (
    <Badge 
      variant="outline" 
      className="text-xs gap-1 border-transparent" 
      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
    >
      {tag.name}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-70">
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
}

function MessageCard({ 
  message, 
  allTags,
  onMarkRead, 
  onDelete,
  onAddTag,
  onRemoveTag,
  templates
}: { 
  message: Message & { tags?: TagType[] }; 
  allTags: TagType[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTag: (messageId: string, tagId: string) => void;
  onRemoveTag: (messageId: string, tagId: string) => void;
  templates: Template[];
}) {
  const [showTemplates, setShowTemplates] = useState(false);
  
  const projectTypeLabels: Record<string, string> = {
    "site-vitrine": "Site Vitrine",
    "e-commerce": "E-commerce",
    "application-web": "Application Web",
    "refonte": "Refonte",
    "autre": "Autre",
  };

  const budgetLabels: Record<string, string> = {
    "moins-150": "< 150€",
    "150-300": "150 - 300€",
    "300-500": "300 - 500€",
    "500-1000": "500 - 1K€",
    "plus-1000": "> 1 000€",
  };

  const messageTags = message.tags || [];
  const availableTags = allTags.filter(t => !messageTags.find(mt => mt.id === t.id));

  const handleSendEmail = (template?: Template) => {
    const subject = template ? encodeURIComponent(template.subject) : "";
    const body = template ? encodeURIComponent(template.content) : "";
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, "_blank");
    setShowTemplates(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card 
        className={`border-border/50 hover-elevate transition-all ${
          !message.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
        }`}
        data-testid={`card-message-${message.id}`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-full ${
                message.isRead ? "bg-muted" : "bg-primary/10"
              }`}>
                {message.isRead ? (
                  <MailOpen className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Mail className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {message.name}
                  {!message.isRead && (
                    <Badge variant="default" className="text-xs">Nouveau</Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {message.createdAt && format(new Date(message.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {message.phone && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Phone className="w-3 h-3" />
                {message.phone}
              </Badge>
            )}
            {message.projectType && (
              <Badge variant="outline" className="text-xs gap-1">
                <FileText className="w-3 h-3" />
                {projectTypeLabels[message.projectType] || message.projectType}
              </Badge>
            )}
            {message.budget && (
              <Badge variant="outline" className="text-xs gap-1 border-accent/30 text-accent">
                <DollarSign className="w-3 h-3" />
                {budgetLabels[message.budget] || message.budget}
              </Badge>
            )}
          </div>

          {messageTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {messageTags.map(tag => (
                <TagBadge 
                  key={tag.id} 
                  tag={tag} 
                  onRemove={() => onRemoveTag(message.id, tag.id)}
                />
              ))}
            </div>
          )}

          <p className="text-sm text-foreground/80 mb-4 whitespace-pre-wrap">
            {message.message}
          </p>

          <div className="flex items-center gap-2 pt-3 border-t border-border/50 flex-wrap">
            {!message.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkRead(message.id)}
                data-testid={`button-mark-read-${message.id}`}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Marquer lu
              </Button>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Tag className="w-4 h-4 mr-1.5" />
                  Tags
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  {availableTags.length > 0 ? (
                    availableTags.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => onAddTag(message.id, tag.id)}
                        className="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted flex items-center gap-2"
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground px-2 py-1">Tous les tags assignés</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(message.id)}
              data-testid={`button-delete-${message.id}`}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Supprimer
            </Button>
            
            <div className="ml-auto flex gap-2">
              {templates.length > 0 && (
                <Popover open={showTemplates} onOpenChange={setShowTemplates}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Réponse rapide
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="space-y-1">
                      {templates.map(template => (
                        <button
                          key={template.id}
                          onClick={() => handleSendEmail(template)}
                          className="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted"
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Button variant="outline" size="sm" onClick={() => handleSendEmail()}>
                <Mail className="w-4 h-4 mr-1.5" />
                Répondre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TagsManager({ tags, onCreateTag, onDeleteTag }: {
  tags: TagType[];
  onCreateTag: (name: string, color: string) => void;
  onDeleteTag: (id: string) => void;
}) {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  const handleCreate = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor);
      setNewTagName("");
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="w-5 h-5" />
          Gérer les Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nouveau tag..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1"
            data-testid="input-new-tag"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: newTagColor }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="flex gap-1">
                {TAG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewTagColor(color)}
                    className={`w-6 h-6 rounded-full ${newTagColor === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleCreate} disabled={!newTagName.trim()} data-testid="button-create-tag">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge 
              key={tag.id}
              variant="outline" 
              className="text-sm gap-1.5 py-1 px-2 border-transparent" 
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
              <button 
                onClick={() => onDeleteTag(tag.id)} 
                className="hover:opacity-70"
                data-testid={`button-delete-tag-${tag.id}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun tag créé</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TemplatesManager({ templates, onCreateTemplate, onDeleteTemplate }: {
  templates: Template[];
  onCreateTemplate: (name: string, subject: string, content: string) => void;
  onDeleteTemplate: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = () => {
    if (name.trim() && subject.trim() && content.trim()) {
      onCreateTemplate(name.trim(), subject.trim(), content.trim());
      setName("");
      setSubject("");
      setContent("");
      setIsOpen(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Templates de Réponse
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-new-template">
              <Plus className="w-4 h-4 mr-1" />
              Nouveau
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Nom du template</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Accusé de réception"
                  data-testid="input-template-name"
                />
              </div>
              <div>
                <Label>Objet de l'email</Label>
                <Input 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="Ex: Merci pour votre message"
                  data-testid="input-template-subject"
                />
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Bonjour,&#10;&#10;Merci pour votre message..."
                  className="min-h-[150px]"
                  data-testid="input-template-content"
                />
              </div>
              <Button onClick={handleCreate} className="w-full" data-testid="button-save-template">
                Créer le template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {templates.map(template => (
            <div 
              key={template.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
            >
              <div>
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.subject}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDeleteTemplate(template.id)}
                className="text-destructive hover:text-destructive"
                data-testid={`button-delete-template-${template.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun template créé. Créez des templates pour répondre rapidement aux messages.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboard({ stats }: { 
  stats: { total: number; today: number; thisWeek: number; thisMonth: number; byPath: { path: string; count: number }[] } | undefined 
}) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Aujourd'hui</span>
            </div>
            <p className="text-2xl font-bold text-primary">{stats.today}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Cette semaine</span>
            </div>
            <p className="text-2xl font-bold">{stats.thisWeek}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Ce mois</span>
            </div>
            <p className="text-2xl font-bold">{stats.thisMonth}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Pages les plus visitées</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.byPath.length > 0 ? (
            <div className="space-y-2">
              {stats.byPath.slice(0, 10).map((item, i) => (
                <div key={item.path} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {item.path === "/" ? "Accueil" : item.path}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 rounded-full bg-primary" 
                      style={{ width: `${Math.max(20, (item.count / stats.byPath[0].count) * 100)}px` }}
                    />
                    <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune donnée de visite encore
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminLoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [step, setStep] = useState<"email" | "secret">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      setStep("secret");
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleSecretVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiRequest("POST", "/api/auth/verify-admin", { secret });
      const response = await res.json() as { isAdmin: boolean };
      if (response.isAdmin) {
        toast({ title: "Accès admin autorisé!", description: "Bienvenue." });
        onSuccess();
      } else {
        setError("Code secret incorrect");
      }
    } catch (err) {
      setError("Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Panel Admin</CardTitle>
            <p className="text-sm text-muted-foreground">
              {step === "email" ? "Connectez-vous avec Supabase" : "Entrez le code secret"}
            </p>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    data-testid="input-admin-email"
                    className="border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    data-testid="input-admin-password"
                    className="border-border/50"
                  />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  data-testid="button-admin-email-login"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Continuer"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSecretVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="secret" className="text-sm">Code Secret</Label>
                  <Input
                    id="secret"
                    type="password"
                    placeholder="••••••"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    disabled={loading}
                    data-testid="input-admin-secret"
                    className="border-border/50"
                  />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  data-testid="button-verify-secret"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Accéder au Panel"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    // Check admin status if authenticated
    if (isAuthenticated && !isAdmin) {
      (async () => {
        try {
          const res = await apiRequest("GET", "/api/auth/admin-status", null);
          const response = await res.json() as { isAdmin: boolean };
          setIsAdmin(response.isAdmin || false);
        } catch (err) {
          setIsAdmin(false);
        }
      })();
    }
  }, [isAuthenticated, isAdmin]);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });

  const { data: tags = [] } = useQuery<TagType[]>({
    queryKey: ["/api/tags"],
    enabled: isAuthenticated,
  });

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    enabled: isAuthenticated,
  });

  const { data: analytics } = useQuery<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byPath: { path: string; count: number }[];
  }>({
    queryKey: ["/api/analytics/stats"],
    enabled: isAuthenticated,
  });

  const { data: messageTagsMap = {} } = useQuery<Record<string, TagType[]>>({
    queryKey: ["/api/messages/tags/all"],
    enabled: isAuthenticated && (messages?.length ?? 0) > 0,
    queryFn: async () => {
      if (!messages) return {};
      const map: Record<string, TagType[]> = {};
      for (const message of messages) {
        try {
          const res = await fetch(`/api/messages/${message.id}/tags`, { credentials: "include" });
          if (res.ok) {
            map[message.id] = await res.json();
          }
        } catch (e) {
          map[message.id] = [];
        }
      }
      return map;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expirée", description: "Reconnexion en cours...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ title: "Message supprimé", description: "Le message a été supprimé avec succès." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expirée", description: "Reconnexion en cours...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
      }
    },
  });

  const createTagMutation = useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      return apiRequest("POST", "/api/tags", { name, color });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      toast({ title: "Tag créé" });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/tags/all"] });
      toast({ title: "Tag supprimé" });
    },
  });

  const addTagToMessageMutation = useMutation({
    mutationFn: async ({ messageId, tagId }: { messageId: string; tagId: string }) => {
      return apiRequest("POST", `/api/messages/${messageId}/tags`, { tagId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/tags/all"] });
    },
  });

  const removeTagFromMessageMutation = useMutation({
    mutationFn: async ({ messageId, tagId }: { messageId: string; tagId: string }) => {
      return apiRequest("DELETE", `/api/messages/${messageId}/tags/${tagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/tags/all"] });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async ({ name, subject, content }: { name: string; subject: string; content: string }) => {
      return apiRequest("POST", "/api/templates", { name, subject, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template créé" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template supprimé" });
    },
  });

  const handleExportCSV = () => {
    window.open("/api/messages/export/csv", "_blank");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login page if not authenticated or not verified as admin
  if (!isAuthenticated || (isAuthenticated && !isAdmin)) {
    return <AdminLoginPage onSuccess={() => setIsAdmin(true)} />;
  }

  const messagesWithTags = messages?.map(m => ({
    ...m,
    tags: messageTagsMap[m.id] || [],
  })) || [];

  const filteredMessages = filterTag 
    ? messagesWithTags.filter(m => m.tags?.some(t => t.id === filterTag))
    : messagesWithTags;

  const unreadCount = messages?.filter(m => !m.isRead).length || 0;
  const totalCount = messages?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 text-xl font-bold">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <div className="absolute inset-0 blur-lg bg-primary/30" />
                </div>
                <span className="text-gradient">NexaWeb</span>
              </a>
              <Badge variant="secondary">Admin</Badge>
            </div>
            <div className="flex items-center gap-4">
              <a href="/">
                <Button variant="ghost" size="sm">
                  Voir le site
                </Button>
              </a>
              <a href="/api/logout">
                <Button variant="outline" size="sm" data-testid="button-logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-admin-title">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Gérez vos messages, analytics et réponses automatiques.
          </p>
        </div>

        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="messages" data-testid="tab-messages">
              <Mail className="w-4 h-4 mr-2" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Palette className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Messages
                  </CardTitle>
                  <Inbox className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="text-total-messages">
                    {totalCount}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Non lus
                  </CardTitle>
                  <Mail className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary" data-testid="text-unread-messages">
                    {unreadCount}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Dernière activité
                  </CardTitle>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">
                    {messages?.[0]?.createdAt
                      ? format(new Date(messages[0].createdAt), "dd MMM HH:mm", { locale: fr })
                      : "Aucune"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant={filterTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTag(null)}
              >
                Tous
              </Button>
              {tags.map(tag => (
                <Button
                  key={tag.id}
                  variant={filterTag === tag.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
                  style={filterTag === tag.id ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                </Button>
              ))}
              <div className="ml-auto">
                <Button variant="outline" size="sm" onClick={handleExportCSV} data-testid="button-export-csv">
                  <FileDown className="w-4 h-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Messages
                  {unreadCount > 0 && (
                    <Badge variant="default">{unreadCount} nouveau{unreadCount > 1 ? "x" : ""}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <MessageSkeleton />
                      <MessageSkeleton />
                      <MessageSkeleton />
                    </div>
                  ) : filteredMessages.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {filteredMessages.map((message) => (
                          <MessageCard
                            key={message.id}
                            message={message}
                            allTags={tags}
                            templates={templates}
                            onMarkRead={(id) => markReadMutation.mutate(id)}
                            onDelete={(id) => deleteMutation.mutate(id)}
                            onAddTag={(messageId, tagId) => addTagToMessageMutation.mutate({ messageId, tagId })}
                            onRemoveTag={(messageId, tagId) => removeTagFromMessageMutation.mutate({ messageId, tagId })}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Inbox className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">Aucun message</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {filterTag 
                          ? "Aucun message avec ce tag."
                          : "Les messages envoyés depuis le formulaire de contact apparaîtront ici."}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard stats={analytics} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TagsManager
                tags={tags}
                onCreateTag={(name, color) => createTagMutation.mutate({ name, color })}
                onDeleteTag={(id) => deleteTagMutation.mutate(id)}
              />
              <TemplatesManager
                templates={templates}
                onCreateTemplate={(name, subject, content) => createTemplateMutation.mutate({ name, subject, content })}
                onDeleteTemplate={(id) => deleteTemplateMutation.mutate(id)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
