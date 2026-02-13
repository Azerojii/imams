# 🔐 Système d'Authentification MuslimWiki

## Configuration Admin

### 1. Créer le fichier `.env.local`

Copiez `.env.example` vers `.env.local` et configurez vos credentials :

```bash
cp .env.example .env.local
```

### 2. Configurer les credentials

Éditez `.env.local` :

```env
# Admin Credentials
ADMIN_USERNAME=votre_nom_utilisateur
ADMIN_PASSWORD=votre_mot_de_passe_securise

# NextAuth Configuration
NEXTAUTH_SECRET=votre-cle-secrete-min-32-caracteres
NEXTAUTH_URL=http://localhost:3001
```

**⚠️ IMPORTANT :**
- Changez `ADMIN_USERNAME` et `ADMIN_PASSWORD` pour vos propres credentials
- Générez une clé secrète aléatoire pour `NEXTAUTH_SECRET` (min 32 caractères)
- Pour générer une clé secrète : `openssl rand -base64 32`

## Fonctionnalités

### 🔒 Pages Protégées (Nécessitent connexion admin)

- `/admin` - Panneau d'administration
- `/admin/submissions` - Gestion des soumissions
- `/admin/submissions/[id]` - Examiner une soumission
- `/wiki/[slug]/edit` - Modifier un article
- `/wiki/create` - Créer un article directement

### 🌐 Pages Publiques

- `/` - Page d'accueil
- `/wiki/[slug]` - Lire les articles
- `/submit` - Soumettre un article (sans connexion)
- `/auth/signin` - Page de connexion admin

## Workflow de Soumission Publique

1. **Visiteur soumet un article** (`/submit`)
   - Rempli le formulaire
   - Article sauvegardé dans `content/pending/`

2. **Admin examine** (`/admin/submissions`)
   - Voit toutes les soumissions en attente
   - Clique pour examiner en détail

3. **Admin décide** (`/admin/submissions/[id]`)
   - **Approuver** : Publie l'article dans `content/wiki/`
   - **Modifier puis approuver** : Édite le contenu avant publication
   - **Rejeter** : Supprime la soumission

4. **Article publié**
   - Apparaît sur la page d'accueil
   - Accessible à tous les visiteurs

## Connexion Admin

1. Cliquez sur le bouton "Admin" dans le header
2. Si non connecté, redirigé vers `/auth/signin`
3. Entrez vos credentials configurés dans `.env.local`
4. Accédez au panneau d'administration

## Déconnexion

Pour déconnecter l'admin, vous pouvez :
- Ajouter un bouton de déconnexion dans le header
- Ou effacer les cookies de session dans le navigateur

## Sécurité

✅ Credentials stockés uniquement dans `.env.local` (jamais dans git)
✅ Sessions JWT cryptées
✅ Routes admin protégées par middleware
✅ Pas de base de données externe nécessaire
✅ Un seul compte admin (pas de gestion multi-utilisateurs)

## Production

Pour la production, assurez-vous de :

1. Changer `NEXTAUTH_URL` vers votre domaine de production
2. Utiliser un mot de passe très sécurisé
3. Utiliser une `NEXTAUTH_SECRET` forte et unique
4. Ne JAMAIS commit le fichier `.env.local`

