# NexaWeb Studio - Site Portfolio de Services Web

## Vue d'ensemble

NexaWeb Studio est un site web professionnel pour présenter des services de création de sites web. Le site comprend :

- **Page d'accueil publique** avec design futuriste, animations, portfolio (10 projets), 120+ témoignages (note 4.9/5), services, et formulaire de contact
- **Panel d'administration privé** accessible UNIQUEMENT au propriétaire avec authentification **Email/Mot de passe Supabase** + code secret

## Architecture

### Frontend (React + Vite)
- `client/src/pages/Landing.tsx` - Page d'accueil principale
- `client/src/pages/Admin.tsx` - Tableau de bord admin (protégé)
- `client/src/components/` - Composants UI
- `client/src/data/` - Données statiques

### Backend (Express + PostgreSQL + Supabase)
- `server/routes.ts` - API endpoints (avec protection isAdmin)
- `server/supabaseAuth.ts` - Authentification Supabase + Email/Password
- `server/storage.ts` - Interface base de données
- `server/db.ts` - Connexion PostgreSQL

### Base de données
- **Supabase** (gratuit) pour production
- PostgreSQL Replit pour développement
- Tables : `users`, `sessions`, `messages`, `tags`, `templates`, `page_views`

## Authentification (Nouveau - Supabase)

### Flow Admin (2 étapes)
1. **Email/Mot de passe** (Supabase Auth)
   - Utilisateur entre son email + mot de passe créés dans Supabase
   - Validation via API Supabase
   - Session créée si valide

2. **Code Secret** (Validation locale)
   - Après connexion email, demande le code secret
   - Code: `snoopy`
   - Accès admin granted si correct

### Endpoints Auth
- `POST /api/auth/login` - Connexion Email/Password (Supabase)
- `POST /api/auth/register` - Créer un compte (Supabase)
- `POST /api/auth/verify-admin` - Vérifier code secret
- `GET /api/auth/admin-status` - Vérifier si admin
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/user` - Info utilisateur actuel

### Endpoints Protégés (403 sans auth)
- `GET /api/messages` - Récupérer les messages
- `GET /api/analytics/stats` - Statistiques des visites
- `PATCH /api/messages/:id/read` - Marquer comme lu
- `DELETE /api/messages/:id` - Supprimer un message
- Tous les endpoints tags, templates, etc.

## Déploiement

### Option Actuelle : Replit
- Backend + Frontend sur Replit
- Coûte ~$5-15/mois
- Facile à déployer (1 clic)

### Option Recommandée : Supabase + Vercel (100% Gratuit)
- **Supabase** : Database + Authentification (gratuit illimité)
- **Vercel** : Frontend + Backend (gratuit illimité)
- Voir `DEPLOYMENT_GUIDE.md` pour instructions complètes

## Contact Info Propriétaire
- Email : `abok57500@gmail.com`
- Téléphone : `06 27 52 46 47`

## Variables d'environnement requises

```
# Supabase (pour production)
SUPABASE_URL=https://lzjyjhnpafhvsivicwof.supabase.co
SUPABASE_ANON_KEY=<votre-clé-ici>

# Session
SESSION_SECRET=<clé-aléatoire-min-32-chars>

# Database (Auto-fournie)
DATABASE_URL=postgres://...
```

## Commandes

```bash
npm run dev      # Démarrer en mode développement
npm run db:push  # Synchroniser le schéma de base de données
```

## Design

Le site utilise un thème futuriste avec :
- Palette de couleurs : violet néon (#8B5CF6), cyan (#06B6D4), fond sombre
- Effets glassmorphism sur la navigation et les cartes
- Animations Framer Motion
- Typographie : Space Grotesk (titres), Inter (corps)

## Récent (Nov 28, 2025)

✅ **Migration vers Supabase Auth** :
- Remplacé Replit Auth par Supabase Email/Password
- Créé `server/supabaseAuth.ts` pour gestion nouvelle auth
- Adapté `client/src/pages/Admin.tsx` pour login Email/Password + code secret
- Créé `DEPLOYMENT_GUIDE.md` pour déploiement Supabase + Vercel
- Support 100% gratuit pour production

✅ **Sécurité Admin maintenue** :
- Authentification 2-couches : Email/Password + Code Secret "snoopy"
- Tous les endpoints sensibles protégés (403 Forbidden)
- Sessions sécurisées avec cookies httpOnly

## Prochaines étapes

1. Tester localement : `npm run dev` → `/admin`
2. Créer utilisateur dans Supabase Auth
3. Déployer sur Vercel (voir `DEPLOYMENT_GUIDE.md`)
4. Configurer variables d'environnement Vercel
5. Importer données depuis Replit si nécessaire
