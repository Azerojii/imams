# Déploiement sur Vercel

## Variables d'environnement requises

Pour que l'admin panel fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement suivantes :

### 1. Accéder aux paramètres Vercel

1. Allez sur votre projet Vercel
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Environment Variables** (Variables d'environnement)

### 2. Ajouter les variables suivantes

#### ADMIN_USERNAME
- **Key**: `ADMIN_USERNAME`
- **Value**: Votre nom d'utilisateur admin (ex: `admin`)
- **Environment**: Production, Preview, Development (cochez toutes)

#### ADMIN_PASSWORD
- **Key**: `ADMIN_PASSWORD`
- **Value**: Votre mot de passe sécurisé
- **Environment**: Production, Preview, Development (cochez toutes)

#### NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: Une clé secrète aléatoire d'au moins 32 caractères
- **Environment**: Production, Preview, Development (cochez toutes)

**Générer une clé secrète sécurisée:**
```bash
# Sur Linux/Mac:
openssl rand -base64 32

# Sur Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou utilisez un générateur en ligne:
# https://generate-secret.vercel.app/32
```

#### NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: L'URL complète de votre site Vercel
  - Production: `https://votre-site.vercel.app`
  - Preview: `https://votre-site-git-branch.vercel.app` (optionnel)
- **Environment**: Production (et Preview si vous voulez tester)

### 3. Redéployer

Après avoir ajouté toutes les variables d'environnement:

1. Allez dans l'onglet **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur le menu **•••** (trois points)
4. Sélectionnez **Redeploy**
5. Confirmez avec **Redeploy**

### 4. Tester l'accès admin

Une fois le redéploiement terminé:

1. Allez sur `https://votre-site.vercel.app/admin`
2. Vous devriez être redirigé vers la page de connexion
3. Connectez-vous avec les identifiants que vous avez configurés

## Dépannage

### Erreur "Server error" sur /admin

**Cause**: Les variables d'environnement ne sont pas configurées correctement.

**Solution**:
1. Vérifiez que TOUTES les variables sont définies dans Vercel
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Pour `NEXTAUTH_SECRET`, assurez-vous qu'elle fait au moins 32 caractères
4. Pour `NEXTAUTH_URL`, assurez-vous d'utiliser l'URL exacte sans "/" à la fin
5. Redéployez après avoir modifié les variables

### Erreur "Invalid credentials"

**Cause**: Le nom d'utilisateur ou mot de passe ne correspond pas.

**Solution**:
1. Vérifiez `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans les variables d'environnement Vercel
2. Assurez-vous qu'il n'y a pas d'espaces supplémentaires
3. Redéployez si vous avez modifié les variables

### La page de connexion ne charge pas

**Cause**: Problème avec `NEXTAUTH_SECRET` ou `NEXTAUTH_URL`.

**Solution**:
1. Régénérez `NEXTAUTH_SECRET` avec au moins 32 caractères
2. Vérifiez que `NEXTAUTH_URL` correspond exactement à votre URL Vercel
3. Redéployez

## Vérification rapide

Créez un script de vérification en local avant de déployer:

```bash
# .env.local
ADMIN_USERNAME=votre_admin
ADMIN_PASSWORD=votre_password_secure
NEXTAUTH_SECRET=votre_secret_de_32_caracteres_minimum
NEXTAUTH_URL=http://localhost:3000
```

Puis testez localement:
```bash
npm run dev
```

Si ça fonctionne localement, copiez exactement les mêmes valeurs (sauf `NEXTAUTH_URL`) dans Vercel.

## Sécurité

⚠️ **Important**:
- Ne commitez JAMAIS le fichier `.env.local` dans Git
- Utilisez des mots de passe forts pour `ADMIN_PASSWORD`
- Générez une nouvelle clé aléatoire pour `NEXTAUTH_SECRET`
- Ne partagez jamais vos variables d'environnement publiquement
