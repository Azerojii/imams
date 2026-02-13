# 🚀 Démarrage Rapide - MuslimWiki

## ✅ Fichiers de configuration créés

Les fichiers suivants ont été créés :

- ✅ `.env.local` - Credentials admin (déjà configuré)
- ✅ `.env.example` - Template pour d'autres développeurs

## 🔑 Credentials Admin par défaut

```
Username: admin
Password: admin123
```

**⚠️ Changez ces credentials en production !**

## 🏃 Démarrer l'application

### 1. Arrêter le serveur actuel

Si le serveur tourne déjà, arrêtez-le avec `Ctrl+C` dans le terminal.

### 2. Redémarrer le serveur

```bash
npm run dev
```

Le serveur démarrera sur **http://localhost:3001** (ou 3000 si 3001 est occupé)

### 3. Tester l'application

#### 🌐 En tant que visiteur :

1. **Page d'accueil** : http://localhost:3001
2. **Soumettre un article** : Cliquez sur "Soumettre" dans le header
3. **Lire les articles** : Cliquez sur n'importe quel article

#### 👨‍💼 En tant qu'admin :

1. **Se connecter** : Cliquez sur "Admin" → Entrez `admin` / `admin123`
2. **Voir les soumissions** : `/admin/submissions`
3. **Créer un article** : `/wiki/create`
4. **Gérer les articles** : `/admin`

## 🔧 Si vous avez une erreur de serveur

### Problème : "Server configuration error"

**Solution** : Redémarrez le serveur pour charger les variables d'environnement

```bash
# Dans le terminal où tourne le serveur
Ctrl+C

# Puis relancez
npm run dev
```

### Problème : Variables d'environnement non chargées

Vérifiez que `.env.local` existe à la racine du projet :

```bash
# Windows PowerShell
Get-Content .env.local

# Devrait afficher :
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=admin123
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3001
```

### Problème : Port déjà utilisé

Si le port 3001 est occupé, Next.js utilisera automatiquement 3002, 3003, etc.
Vérifiez le message dans le terminal pour voir quel port est utilisé.

## 📋 Workflow complet

### Pour un visiteur :

1. Va sur `/submit`
2. Remplit le formulaire
3. Soumet l'article
4. Article sauvegardé dans `content/pending/`

### Pour l'admin :

1. Se connecte via `/auth/signin`
2. Va sur `/admin/submissions`
3. Clique sur une soumission pour l'examiner
4. Peut **modifier** le contenu si nécessaire
5. **Approuve** → Article publié dans `content/wiki/`
6. **Rejette** → Soumission supprimée

## 🎯 Pages principales

| URL | Description | Accès |
|-----|-------------|-------|
| `/` | Page d'accueil | Public |
| `/wiki/[slug]` | Lire un article | Public |
| `/submit` | Soumettre un article | Public |
| `/auth/signin` | Connexion admin | Public |
| `/admin` | Dashboard admin | Admin uniquement |
| `/admin/submissions` | Gérer les soumissions | Admin uniquement |
| `/wiki/create` | Créer un article | Admin uniquement |
| `/wiki/[slug]/edit` | Modifier un article | Admin uniquement |

## 🔒 Sécurité

- ✅ Credentials dans `.env.local` (jamais dans git)
- ✅ Routes admin protégées par middleware
- ✅ Sessions JWT sécurisées
- ✅ Pas de base de données externe nécessaire

## 📝 Structure des fichiers

```
content/
├── wiki/           # Articles publiés (visibles par tous)
└── pending/        # Soumissions en attente (admin uniquement)

.env.local          # Credentials admin (NE PAS COMMIT)
.env.example        # Template pour autres développeurs
```

## ❓ Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que `.env.local` existe
2. Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)
3. Vérifiez les logs dans le terminal
4. Consultez `README_AUTH.md` pour plus de détails

---

**Bon développement ! 🚀**

