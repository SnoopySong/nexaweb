# Guide: Déployer NexaWeb Studio gratuitement (Supabase + Vercel)

## Vue d'ensemble
- **Supabase** (gratuit) = Base de données + Authentification Email
- **Vercel** (gratuit) = Hébergement du frontend
- **Backend** = Express sur votre machine ou Supabase Functions

---

## ÉTAPE 1 : Configuration Supabase

### 1.1 Créer un projet Supabase
1. Allez à https://supabase.com
2. Connectez-vous avec votre compte existant
3. Créez un nouveau projet (gratuit)
4. Notez les credentials :
   - `SUPABASE_URL` (ex: https://xxx.supabase.co)
   - `SUPABASE_ANON_KEY` (clé publique)
   - `SUPABASE_SERVICE_KEY` (clé privée, à garder secrète)

### 1.2 Créer les tables Supabase
Dans l'éditeur SQL Supabase, exécutez :

```sql
-- Sessions table (pour express-session)
CREATE TABLE sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);
CREATE INDEX IDX_session_expire ON sessions (expire);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(50),
  budget varchar(100),
  project_type varchar(100),
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Tags table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL UNIQUE,
  color varchar(20) NOT NULL DEFAULT '#8B5CF6',
  created_at timestamp DEFAULT now()
);

-- Message-Tags join table
CREATE TABLE message_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

-- Templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  subject varchar(200) NOT NULL,
  content text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Page views analytics
CREATE TABLE page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path varchar(255) NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamp DEFAULT now()
);
```

---

## ÉTAPE 2 : Adapter le code du projet

### 2.1 Installer Supabase client
```bash
npm install @supabase/supabase-js
```

### 2.2 Remplacer l'authentification Replit
1. **Supprimer** `server/replitAuth.ts`
2. **Garder** `server/supabaseAuth.ts` (déjà créé)
3. **Adapter** `server/routes.ts` :
   - Changer l'import : `import { setupAuth, isAuthenticated, isAdmin } from "./supabaseAuth";`
   - Supprimer l'import Replit : `import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";`

### 2.3 Adapter le frontend (Admin login)
Remplacer `client/src/pages/Admin.tsx` Login component pour utiliser Email/Mot de passe au lieu du bouton Replit.

**Nouveau Login component** :
```typescript
// client/src/pages/Admin.tsx - Remplacer la partie login

function AdminLoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'auth' | 'secret'>('auth');
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      setStep('secret');
    } catch (error) {
      toast({ title: 'Erreur', description: 'Email ou mot de passe incorrect' });
    }
    setIsLoading(false);
  };

  const handleVerifySecret = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });
      if (!res.ok) throw new Error('Wrong secret');
      onLoginSuccess();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Code secret incorrect' });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 'auth' ? 'Connexion Admin' : 'Code Secret'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'auth' ? (
            <>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                Connexion
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Entrez le code secret pour accéder au panel admin
              </p>
              <Input
                type="password"
                placeholder="Code secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
              <Button onClick={handleVerifySecret} disabled={isLoading} className="w-full">
                Vérifier
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ÉTAPE 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel
1. Allez à https://vercel.com
2. Connectez-vous avec GitHub (plus facile)
3. Importez votre repo

### 3.2 Configurer les variables d'environnement dans Vercel
Allez dans Settings → Environment Variables et ajoutez :
- `DATABASE_URL` = URL PostgreSQL (ne pas changer)
- `SUPABASE_URL` = Votre URL Supabase
- `SUPABASE_ANON_KEY` = Clé publique Supabase
- `SESSION_SECRET` = Clé secrète (générez-en une)

### 3.3 Déployer
```bash
# Sur votre machine
git push  # Pousse vers GitHub

# Vercel détecte automatiquement les changements et déploie
```

---

## ÉTAPE 4 : Utiliser le site en production

### Admin Login
1. Allez à `https://votre-domaine.vercel.app/admin`
2. Connectez-vous avec Email + Mot de passe Supabase
3. Entrez le code secret `snoopy`
4. Accédez au panel admin

### Ajouter des utilisateurs admin (optionnel)
Dans Supabase Auth → Users, créez manuellement des comptes email/password pour d'autres administrateurs.

---

## 🚨 IMPORTANT : Migration depuis Replit

### Avant de déployer sur Vercel :

**1. Exporter les données Replit**
```bash
# Depuis votre terminal Replit
pg_dump $DATABASE_URL > backup.sql
```

**2. Importer dans Supabase**
- Téléchargez le fichier `backup.sql`
- Dans Supabase SQL Editor, collez le contenu
- Exécutez

**3. Vérifier les données**
- Allez dans Supabase → Messages table
- Vérifiez que les messages importés sont là

---

## 📝 Résumé des changements de code

| Fichier | Action |
|---------|--------|
| `server/replitAuth.ts` | ❌ Supprimer |
| `server/supabaseAuth.ts` | ✅ Garder (déjà créé) |
| `server/routes.ts` | ✏️ Adapter import auth |
| `client/src/pages/Admin.tsx` | ✏️ Adapter login component |
| `.env` | ✏️ Ajouter SUPABASE_URL, SUPABASE_ANON_KEY |

---

## ⚙️ Variables d'environnement (.env)

```
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx (optionnel, gardez secrète)

# Session
SESSION_SECRET=votre-clé-aléatoire-ici

# Database (ne pas toucher)
DATABASE_URL=postgres://...
```

---

## ✅ Checklist avant lancement

- [ ] Tables Supabase créées
- [ ] Code adapté (replitAuth → supabaseAuth)
- [ ] Admin login component mis à jour
- [ ] Variables d'environnement ajoutées
- [ ] Données migrées depuis Replit
- [ ] Test local : `npm run dev`
- [ ] Déploiement Vercel réussi
- [ ] Admin accessible : `/admin` → Email/Mot de passe + "snoopy"

---

**Besoin d'aide?** Dites-moi à quelle étape vous êtes bloqué ! 🚀
