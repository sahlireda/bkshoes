# BkShoes - Boutique de Chaussures Féminines

Un site web vitrine élégant pour une boutique de chaussures féminines avec intégration WhatsApp pour les commandes.

## 🌟 Fonctionnalités

- **Design Responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop)
- **5 Catégories de Produits** :
  - Sandales d'été
  - Bottines tendance
  - Escarpins chics
  - Mocassins confort
  - Baskets modernes
- **Commandes WhatsApp** : Commande directe via WhatsApp avec message pré-rempli
- **Navigation Fluide** : Scroll smooth et navigation mobile
- **Animations** : Effets visuels modernes et élégants
- **SEO Optimisé** : Structure HTML sémantique

## 🚀 Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec Flexbox et Grid
- **JavaScript ES6** : Interactivité et intégration WhatsApp
- **Font Awesome** : Icônes
- **Google Fonts** : Police Poppins

## 📱 Configuration WhatsApp

Pour configurer votre numéro WhatsApp :

1. Ouvrez le fichier `script.js`
2. Modifiez la ligne 2 :
   ```javascript
   const WHATSAPP_NUMBER = "212XXXXXXXXX"; // Remplacez par votre vrai numéro
   ```
3. Remplacez `212XXXXXXXXX` par votre numéro WhatsApp au format international (sans le +)

Exemple : Si votre numéro est +212 6 12 34 56 78, utilisez : `212612345678`

## 🎨 Personnalisation

### Couleurs
Les couleurs principales peuvent être modifiées dans `styles.css` :
- **Rose principal** : `#ff6b9d`
- **Rose foncé** : `#c44569`
- **Or** : `#ffd700`
- **Vert WhatsApp** : `#25d366`

### Produits
Pour ajouter/modifier des produits :
1. Dupliquez une carte produit existante dans `index.html`
2. Modifiez les informations (nom, prix, data-attributes)
3. Ajustez la fonction `orderWhatsApp()` si nécessaire

## 📦 Structure du Projet

```
Bkshoes/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # JavaScript
└── README.md           # Documentation
```

## 🌐 Déploiement

Ce site est prêt pour le déploiement sur :
- **Netlify** (recommandé)
- **Vercel**
- **GitHub Pages**
- **Tout hébergeur web statique**

### Déploiement sur Netlify
1. Créez un compte sur [Netlify](https://netlify.com)
2. Glissez-déposez le dossier du projet
3. Votre site sera automatiquement déployé

## 📱 Responsive Design

Le site s'adapte automatiquement à :
- **Mobile** : < 768px
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

## ✨ Fonctionnalités Avancées

- **Smooth Scrolling** : Navigation fluide entre les sections
- **Menu Mobile** : Hamburger menu pour mobile
- **Animations CSS** : Effets de hover et transitions
- **Lazy Loading** : Optimisation des performances
- **WhatsApp Integration** : Messages pré-formatés

## 🔧 Maintenance

Pour maintenir le site :
1. **Mise à jour des produits** : Modifiez les cartes dans `index.html`
2. **Nouveaux prix** : Changez les prix dans les cartes et les fonctions JS
3. **Nouvelles catégories** : Ajoutez des sections dans `index.html` et `styles.css`

## 📞 Support

Pour toute question ou personnalisation, contactez-nous via WhatsApp en utilisant le bouton sur le site.

## 📄 Licence

Ce projet est libre d'utilisation pour votre boutique personnelle.

---

**BkShoes** - Votre boutique de chaussures féminines en ligne 👠✨
