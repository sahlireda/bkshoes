// Configuration pour les pages produits
let selectedSize = '';
let selectedColor = 'nude';
let quantity = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des tailles
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            sizeButtons.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            selectedSize = this.dataset.size;
        });
    });

    // Gestion des couleurs (style majisky)
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
        item.addEventListener('click', function() {
            colorItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
        });
    });

    // Gestion de la quantité
    const qtyInput = document.querySelector('.qty-input');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');

    minusBtn.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            qtyInput.value = quantity;
        }
    });

    plusBtn.addEventListener('click', function() {
        if (quantity < 10) {
            quantity++;
            qtyInput.value = quantity;
        }
    });

    qtyInput.addEventListener('change', function() {
        quantity = parseInt(this.value) || 1;
        if (quantity < 1) quantity = 1;
        if (quantity > 10) quantity = 10;
        this.value = quantity;
    });

    // Gestion des onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Retirer les classes actives
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Ajouter les classes actives
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Gestion des miniatures d'images
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // Ici vous pourriez changer l'image principale
        });
    });
});

// Fonction pour commander le produit via WhatsApp
function orderProductWhatsApp() {
    const productName = document.querySelector('.product-title').textContent;
    const price = document.querySelector('.current-price').textContent;
    
    // Vérifier si une taille est sélectionnée
    if (!selectedSize) {
        alert('Veuillez sélectionner une taille avant de commander.');
        return;
    }

    // Calculer le prix total selon la quantité
    let totalPrice = '';
    let specialOffer = '';
    
    if (quantity === 1) {
        totalPrice = price;
    } else if (quantity === 2) {
        totalPrice = '550 DH';
        specialOffer = ' (Offre spéciale 2 articles)';
    } else if (quantity >= 3) {
        totalPrice = '800 DH';
        specialOffer = ' (Offre spéciale 3 articles)';
    }

    // Message personnalisé pour WhatsApp
    const message = `Bonjour ! 👋

Je souhaite commander ce produit de votre boutique BkShoes :

🦶 *${productName}*
💰 Prix : *${totalPrice}*${specialOffer}
📏 Taille : *${selectedSize}*
🎨 Couleur : *${selectedColor}*
📦 Quantité : *${quantity}*

Informations supplémentaires souhaitées :
- Confirmation de la disponibilité
- Délai de livraison
- Modalités de paiement

Merci ! 😊

#BkShoes #ChaussuresCuirVeritable`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Créer l'URL WhatsApp
    const whatsappURL = `https://wa.me/212671818295?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappURL, '_blank');
    
    console.log(`Commande WhatsApp pour: ${productName} - Taille: ${selectedSize} - Couleur: ${selectedColor} - Quantité: ${quantity}`);
}

// Fonction pour partager le produit
function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: document.querySelector('.product-title').textContent,
            text: 'Découvrez ce magnifique produit sur BkShoes',
            url: window.location.href
        });
    } else {
        // Fallback pour copier l'URL
        navigator.clipboard.writeText(window.location.href).then(function() {
            alert('Lien copié dans le presse-papiers !');
        });
    }
}

// Animation au scroll pour les éléments de la page
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les sections de la page produit
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.product-tabs, .related-products');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Fonction pour zoomer sur l'image principale (future fonctionnalité)
function zoomImage() {
    // Implémentation future pour le zoom d'image
    console.log('Zoom sur l\'image');
}

// Gestion du retour à la page précédente
function goBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}
