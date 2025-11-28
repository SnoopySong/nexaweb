# NexaWeb Studio - Guide Déploiement Gratuit (Supabase + Vercel)

## 🎯 Objectif Final
Votre site NexaWeb Studio **100% gratuit** en production.

---

## ✅ ÉTAPE 1 : Configuration Supabase (Déjà commencée)

### 1.1 Créer les tables SQL
Dans Supabase Editor SQL : https://supabase.com/dashboard/project/lzjyjhnpafhvsivicwof/sql/new

Collez et exécutez le fichier `SUPABASE_TABLES.sql` inclus dans le projet.

### 1.2 Créer votre compte admin
- Allez à : https://supabase.com/dashboard/project/lzjyjhnpafhvsivicwof/auth/users
- Cliquez "Add user"
- Email : `abok57500@gmail.com`
- Mot de passe : Quelque chose de fort
- Confirmez

**Vous êtes maintenant configuré !**

---

## 🔧 ÉTAPE 2 : Tester Localement

### 2.1 Vérifier les variables d'environnement
Vérifiez que `.env` contient :
```
SUPABASE_URL=https://lzjyjhnpafhvsivicwof.supabase.co
SUPABASE_ANON_KEY=<votre-clé-ici>
SESSION_SECRET=<clé-aléatoire>
DATABASE_URL=<fournie-par-Replit>
```

### 2.2 Redémarrer le serveur
```bash
npm run dev
```

### 2.3 Tester le login admin
1. Allez à http://localhost:5000/admin
2. Connectez-vous avec :
   - Email: `abok57500@gmail.com`
   - Mot de passe: Celui créé dans Supabase
3. Entrez le code secret : `snoopy`
4. Vous devriez voir le panel admin !

---

## 🚀 ÉTAPE 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel
- Allez à https://vercel.com
- Connectez-vous avec GitHub

### 3.2 Importer le projet
- Allez à "Add New..." → "Project"
- Importez votre repo GitHub
- Vercel détecte automatiquement npm + Node.js

### 3.3 Configurer les variables d'environnement
1. Dans Vercel → Settings → Environment Variables
2. Ajoutez :
   - `SUPABASE_URL` = `https://lzjyjhnpafhvsivicwof.supabase.co`
   - `SUPABASE_ANON_KEY` = Votre clé API Supabase
   - `SESSION_SECRET` = Clé secrète (min 32 caractères)
   - `DATABASE_URL` = URL PostgreSQL Replit (copiez de votre `.env`)

### 3.4 Déployer
```bash
git push origin main
```

Vercel détecte le changement et déploie automatiquement ! ✨

---

## 📊 Flux Complet d'Authentification

```
1. Utilisateur va à /admin
   ↓
2. Affiche formulaire Email/Mot de passe
   ↓
3. Utilisateur entre credentials Supabase
   ↓
4. Serveur valide via API Supabase
   ↓
5. Si OK → Affiche formulaire Code Secret
   ↓
6. Utilisateur entre "snoopy"
   ↓
7. Serveur valide le secret
   ↓
8. ✅ Accès au panel admin !
```

---

## 🔐 Sécurité

### Endpoints Protégés (403 sans auth)
- `GET /api/messages` - Liste des messages
- `GET /api/analytics/stats` - Statistiques
- `PATCH /api/messages/:id/read` - Marquer comme lu
- `DELETE /api/messages/:id` - Supprimer

### Authentification en 2 couches
1. **Email/Mot de passe** : Valide via Supabase Auth
2. **Code secret** : Validation locale du code "snoopy"

---

## 💾 Migration de Données depuis Replit

### Avant de déployer sur Vercel :

**1. Exporter la base Replit**
```bash
# Dans le terminal Replit
pg_dump $DATABASE_URL > backup.sql
# Téléchargez backup.sql
```

**2. Importer dans Supabase**
- Allez à SQL Editor dans Supabase
- Téléchargez backup.sql
- Exécutez

**3. Vérifier les données**
- Allez à https://supabase.com/dashboard/project/lzjyjhnpafhvsivicwof/editor
- Vérifiez que les messages, tags, etc. sont importés

---

## ✨ Résumé Finale

| Service | Prix | Rôle |
|---------|------|------|
| Supabase | **Gratuit** | Database + Auth |
| Vercel | **Gratuit** | Hosting Frontend + Backend |
| Votre site | **$0/mois** | NexaWeb Studio en production |

---

## 🎉 Vous êtes Prêt !

Votre site est maintenant :
- ✅ Authentifié (Email/Password Supabase)
- ✅ Sécurisé (Code secret admin)
- ✅ Gratuit (Supabase + Vercel)
- ✅ Scalable (Infrastructure moderne)

**URL de production** : `https://votre-app.vercel.app`

---

## 📞 Support

Si vous avez des questions :
1. Vérifiez les logs Vercel
2. Testez localement d'abord
3. Vérifiez les variables d'environnement

**Bon déploiement !** 🚀
