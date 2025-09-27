# 🔐 Guide d'Accès Administration BkShoes

## 🎯 Éléments Masqués

Pour une expérience utilisateur optimisée, les éléments suivants ont été **masqués du site public** :

### 📱 **Navigation Principale**
- ❌ **Ballerines** - Lien retiré du menu de navigation
- ❌ **Administration** - Bouton d'accès masqué
- ❌ **Sync** - Bouton de synchronisation masqué  
- ❌ **Debug** - Bouton de débogage masqué

### 🔗 **Footer**
- ❌ Tous les liens d'administration ont été commentés
- ❌ Boutons de test et outils de développement masqués

## 🚪 Accès à l'Administration

### 🌐 **Méthode 1 : URL Directe**
```
https://votre-site.com/admin
```
ou
```
https://votre-site.com/?admin=true
```
ou
```
https://votre-site.com/#admin
```

### ⌨️ **Méthode 2 : Code Secret**
Sur n'importe quelle page du site, tapez : **`admin`**
- Une popup d'accès apparaîtra automatiquement
- Fonctionne sur toutes les pages (accueil, catégories)

### 🖱️ **Méthode 3 : Zone Invisible**
- Survolez le **coin inférieur droit** du footer
- Une zone invisible de 10x10px devient cliquable
- Cliquez pour accéder à l'administration

### ⌨️ **Méthode 4 : Raccourci Clavier**
Appuyez sur : **`Ctrl + Shift + A`**
- Redirection directe vers la page de connexion

## 📋 Pages d'Administration Disponibles

### 🏠 **Page d'Accès** (`/admin`)
- **Administration Principale** → `admin-login.html`
- **État des Pages** → `status-pages.html`  
- **Réinitialisation** → `reset-all.html`
- **Accès aux éléments masqués** (Ballerines, Debug, etc.)

### 🔐 **Connexion** (`admin-login.html`)
- **Identifiants** : `admin` / `admin`
- **Session** : 2 heures
- **Redirection automatique** si non connecté

### 📊 **Tableau de Bord** (`admin.html`)
- Gestion complète des produits (CRUD)
- Upload de 3 images par produit
- Sélection des pointures (37-41)
- Statistiques en temps réel
- Synchronisation automatique

## 🔧 Outils de Développement

### 📄 **Pages Utilitaires**
- `status-pages.html` - État de toutes les catégories
- `reset-all.html` - Réinitialisation complète
- `test-layout.html` - Test du nouveau layout 3 colonnes

### 🔄 **Scripts de Synchronisation**
- `admin-sync.js` - Synchronisation temps réel
- `admin-router.js` - Gestion des accès discrets
- `force-update.js` - Mise à jour forcée

## 🛡️ Sécurité

### 🔒 **Fichiers Protégés**
- `.htaccess` configuré pour limiter l'accès aux fichiers admin
- Logs d'accès dans la console du navigateur
- Vérification des sessions automatique

### 👁️ **Éléments Masqués mais Accessibles**
- **Ballerines** : Accès direct via `/admin` ou `ballerines.html`
- **Outils Debug** : Console de développement (F12)
- **Scripts Admin** : Fonctions JavaScript disponibles

## 📱 Utilisation Mobile

Tous les accès fonctionnent également sur mobile :
- **Code secret** : Utiliser le clavier virtuel
- **Zone invisible** : Toucher le coin du footer
- **URL directe** : Ajouter `/admin` à l'adresse

## 🚀 Déploiement

### 📁 **Fichiers Requis**
```
/admin                 # Page d'accès principal
/.htaccess            # Configuration serveur (optionnel)
/admin-router.js      # Gestion des accès
/admin-login.html     # Page de connexion
/admin.html           # Interface d'administration
/admin.js             # Logique d'administration
/admin-sync.js        # Synchronisation
/admin-styles.css     # Styles d'administration
```

### 🌐 **Configuration Serveur**
- **Apache** : `.htaccess` inclus
- **Nginx** : Configuration manuelle requise
- **Hébergement statique** : Fonctionne avec les accès JavaScript

## 📞 Support

Pour toute question sur l'administration :
- **WhatsApp** : +212 6 71 81 82 95
- **Console** : Ouvrir F12 pour les logs détaillés
- **Debug** : Utiliser les outils intégrés dans `/admin`

---

**🔐 Accès Administrateur Seulement - Confidentiel**
