# Guide d'Administration BkShoes

## 🔐 Accès à l'Administration

### Identifiants de Connexion
- **Login :** `admin`
- **Mot de passe :** `admin`

### Accès
1. **Depuis le site :** Cliquez sur "Administration" dans le footer
2. **Direct :** Ouvrez `admin-login.html` dans votre navigateur
3. **URL :** `votre-site.com/admin-login.html`

## 📊 Tableau de Bord

Le tableau de bord vous donne une vue d'ensemble :
- **Nombre total de produits**
- **Produits actifs** (visibles sur le site)
- **Produits "Coming Soon"**
- **Activité récente** de l'administration

## 🛍️ Gestion des Produits

### Ajouter un Produit
1. Cliquez sur **"Ajouter un produit"**
2. Remplissez les informations :
   - **Nom du produit** (obligatoire)
   - **Catégorie** (Mocassins, Ballerines, Mules, Sandales, Bottes)
   - **Prix en DH** (obligatoire)
   - **Statut** :
     - `Actif` : Visible sur le site avec bouton commander
     - `Coming Soon` : Affiché avec message "Coming Soon"
     - `Inactif` : Masqué du site
   - **Image** (optionnelle)
   - **Description** (optionnelle)

### Modifier un Produit
1. Dans la liste des produits, cliquez sur l'icône **crayon** (✏️)
2. Modifiez les informations souhaitées
3. Cliquez sur **"Enregistrer"**

### Supprimer un Produit
1. Dans la liste des produits, cliquez sur l'icône **poubelle** (🗑️)
2. Confirmez la suppression

### Filtrer les Produits
- **Par catégorie** : Utilisez le menu déroulant
- **Par recherche** : Tapez dans la barre de recherche (nom ou catégorie)

## 🏷️ Gestion des Catégories

La page **Catégories** affiche :
- Le nombre de produits par catégorie
- Les descriptions de chaque catégorie
- Les statistiques en temps réel

### Catégories Disponibles
1. **Mocassins** - "Confort décontracté chic"
2. **Ballerines** - "Élégance et féminité"
3. **Mules** - "Style décontracté moderne"
4. **Sandales** - "Élégance estivale en cuir authentique"
5. **Bottes** - "Style et protection pour toutes saisons"

## ⚙️ Paramètres

### Informations Générales
- Nom de la boutique : BkShoes
- Contact WhatsApp : +212 6 71 81 82 95

### Sécurité
- **Dernière connexion** : Affichage automatique
- **Réinitialiser les données** : Supprime TOUS les produits (irréversible)

## 🔄 Synchronisation avec le Site

### Produits Actifs
- Apparaissent automatiquement sur le site principal
- Bouton "Commander" via WhatsApp fonctionnel
- Images affichées si disponibles

### Produits "Coming Soon"
- Affichent le message "Coming Soon" sur le site
- Pas de bouton de commande
- Créent de l'anticipation chez les clients

### Produits Inactifs
- Complètement masqués du site
- Utile pour les produits en rupture ou en préparation

## 💾 Stockage des Données

### Local Storage
- Les données sont stockées localement dans le navigateur
- **Avantage** : Pas besoin de serveur
- **Inconvénient** : Données perdues si cache effacé

### Sauvegarde Recommandée
1. Notez régulièrement vos produits
2. Sauvegardez les images séparément
3. Exportez les données importantes

## 🔒 Sécurité

### Session
- **Durée** : 2 heures d'inactivité
- **Déconnexion automatique** après expiration
- **Vérification** à chaque page

### Recommandations
1. **Changez les identifiants** dans le code source
2. **Fermez la session** après utilisation
3. **Utilisez HTTPS** en production

## 📱 Responsive

L'interface d'administration s'adapte :
- **Desktop** : Interface complète avec sidebar
- **Mobile** : Interface simplifiée et tactile
- **Tablette** : Mise en page adaptée

## 🚀 Déploiement

### Fichiers Nécessaires
```
Bkshoes/
├── admin-login.html     # Page de connexion
├── admin.html          # Interface d'administration
├── admin.js            # Logique JavaScript
├── admin-styles.css    # Styles de l'admin
└── index.html          # Site principal (modifié)
```

### Mise en Production
1. **Uploadez tous les fichiers** sur votre serveur
2. **Testez la connexion** admin/admin
3. **Changez les identifiants** dans le code
4. **Configurez HTTPS** pour la sécurité

## 🆘 Dépannage

### Problèmes Courants

**"Page non trouvée"**
- Vérifiez que tous les fichiers sont uploadés
- Vérifiez les noms de fichiers (sensible à la casse)

**"Données perdues"**
- Le cache du navigateur a été effacé
- Réajoutez vos produits manuellement

**"Session expirée"**
- Reconnectez-vous avec admin/admin
- La session dure 2 heures maximum

**"Images ne s'affichent pas"**
- Vérifiez que les images sont dans le dossier `images/`
- Vérifiez les noms de fichiers

## 📞 Support

Pour toute question technique :
1. Vérifiez ce guide d'abord
2. Consultez la console du navigateur (F12)
3. Vérifiez les fichiers et leurs emplacements

---

**🎯 Bonne gestion de votre boutique BkShoes !**
