// ===== SYSTÈME DE SÉLECTION DE POINTURE =====
console.log('🚀 Chargement du système de sélection de pointure...');

// Attendre que le DOM soit chargé ET un délai supplémentaire
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, initialisation...');
    setTimeout(function() {
        initializeSizeSelection();
    }, 500); // Délai de 500ms pour s'assurer que tout est chargé
});

// Aussi essayer d'initialiser quand la fenêtre est complètement chargée
window.addEventListener('load', function() {
    console.log('🌐 Fenêtre complètement chargée, réinitialisation...');
    setTimeout(function() {
        initializeSizeSelection();
        initializeImageGalleries(); // Initialiser les galeries d'images
        addImageGalleriesToAll(); // Ajouter automatiquement les galeries
    }, 100);
});

function initializeSizeSelection() {
    console.log('🔍 Initialisation de la sélection de pointure...');
    
    // Ajouter les événements de clic sur tous les boutons de pointure
    const sizeButtons = document.querySelectorAll('.size-btn');
    console.log(`📊 Trouvé ${sizeButtons.length} boutons de pointure`);
    
    if (sizeButtons.length === 0) {
        console.warn('⚠️ Aucun bouton de pointure trouvé sur cette page');
        return;
    }
    
    sizeButtons.forEach((button, index) => {
        console.log(`🔘 Initialisation bouton ${index + 1}: pointure ${button.dataset.size}`);
        
        // S'assurer que le bouton est cliquable avec des styles CSS
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
        button.style.userSelect = 'none';
        button.style.position = 'relative';
        button.style.zIndex = '10';
        
        // Supprimer tous les anciens événements
        button.replaceWith(button.cloneNode(true));
        const newButton = document.querySelectorAll('.size-btn')[index];
        
        // Ajouter l'événement de clic
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('👆 Clic sur pointure:', this.dataset.size);
            
            const productCard = this.closest('.product-card');
            if (!productCard) {
                console.error('❌ Carte produit non trouvée');
                return;
            }
            
            const cardSizeButtons = productCard.querySelectorAll('.size-btn');
            const orderBtn = productCard.querySelector('.order-btn');
            
            if (!orderBtn) {
                console.error('❌ Bouton de commande non trouvé');
                return;
            }
            
            // Retirer la sélection précédente
            cardSizeButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.backgroundColor = '#f8f6f3';
                btn.style.color = '#8b7355';
                btn.style.border = '2px solid #e8e4e0';
                btn.style.transform = 'none';
            });
            
            // Ajouter la sélection actuelle
            this.classList.add('selected');
            this.style.backgroundColor = '#d4af37 !important';
            this.style.color = 'white !important';
            this.style.border = '2px solid #d4af37 !important';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            
            // Activer le bouton de commande
            orderBtn.disabled = false;
            orderBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander cette pointure';
            orderBtn.classList.add('enabled');
            orderBtn.style.backgroundColor = '#d4af37';
            orderBtn.style.color = 'white';
            orderBtn.style.cursor = 'pointer';
            orderBtn.style.opacity = '1';
            
            // Supprimer et recréer l'événement de clic pour ce bouton spécifique
            const newOrderBtn = orderBtn.cloneNode(true);
            orderBtn.parentNode.replaceChild(newOrderBtn, orderBtn);
            
            // Ajouter l'événement de clic au nouveau bouton
            newOrderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🛒 Clic sur bouton de commande après sélection !');
                selectProductAndSize(this);
            });
            
            console.log('🔄 Événement de clic réattaché au bouton de commande');
            
            console.log('✅ Pointure sélectionnée:', this.dataset.size);
            console.log('✅ Bouton de commande activé');
        });
        
        // Ajouter aussi un événement mousedown pour plus de compatibilité
        newButton.addEventListener('mousedown', function(e) {
            console.log('🖱️ Mousedown sur pointure:', this.dataset.size);
        });
        
        // Ajouter un événement tactile pour mobile
        newButton.addEventListener('touchstart', function(e) {
            console.log('📱 Touch sur pointure:', this.dataset.size);
            this.click();
        });
    });
    
    // Initialiser les boutons de commande avec la méthode qui fonctionne
    const orderButtons = document.querySelectorAll('.order-btn');
    console.log(`🛒 Trouvé ${orderButtons.length} boutons de commande`);
    
    orderButtons.forEach((button, index) => {
        console.log(`🛒 Initialisation bouton commande ${index + 1}`);
        
        // S'assurer que le bouton est cliquable
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
        
        // Supprimer tous les anciens événements et recréer le bouton
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        
        // Attacher l'événement avec capture (la méthode qui fonctionne)
        newBtn.addEventListener('click', function(e) {
            console.log('🛒 CLIC DÉTECTÉ !', e);
            e.stopImmediatePropagation();
            
            if (!this.disabled) {
                console.log('🛒 Appel de selectProductAndSize...');
                selectProductAndSize(this);
            } else {
                console.warn('⚠️ Bouton de commande désactivé');
                const productCard = this.closest('.product-card');
                if (productCard) {
                    const firstSize = productCard.querySelector('.size-btn');
                    if (firstSize) {
                        console.log('🔄 Auto-sélection de la pointure:', firstSize.dataset.size);
                        firstSize.click(); // Déclencher la sélection
                        // Puis réessayer la commande
                        setTimeout(() => {
                            selectProductAndSize(this);
                        }, 100);
                        return;
                    } else {
                        console.warn('⚠️ Aucune pointure trouvée, tentative de création...');
                        const sizeButtonsHTML = `
                            <button class="size-btn" data-size="37">37</button>
                            <button class="size-btn" data-size="38">38</button>
                            <button class="size-btn" data-size="39">39</button>
                            <button class="size-btn" data-size="40">40</button>
                            <button class="size-btn" data-size="41">41</button>
                        `;
                        productCard.insertAdjacentHTML('beforeend', sizeButtonsHTML);
                        console.log('✅ Pointures créées avec succès !');
                    }
                }
                alert('Veuillez d\'abord sélectionner une pointure.');
            }
        }, true); // true = capture phase
        
        console.log(`✅ Événement attaché avec capture pour bouton ${index + 1}`);
    });
    
    console.log('✅ Initialisation terminée');
}

function selectProductAndSize(button) {
    console.log('🛒 Tentative de commande...');
    console.log('🛒 Bouton cliqué:', button);
    
    const productCard = button.closest('.product-card');
    if (!productCard) {
        console.error('❌ Carte produit non trouvée');
        alert('Erreur: Carte produit non trouvée');
        return;
    }
    
    console.log('📦 Carte produit trouvée:', productCard);
    
    const selectedSizeBtn = productCard.querySelector('.size-btn.selected');
    
    if (!selectedSizeBtn) {
        console.warn('⚠️ Aucune pointure sélectionnée');
        alert('Veuillez sélectionner une pointure avant de continuer.');
        return;
    }
    
    console.log('👟 Pointure sélectionnée:', selectedSizeBtn.dataset.size);
    console.log('📦 Récupération des données produit...');
    
    // Récupérer les informations du produit
    const productData = {
        name: productCard.dataset.name || productCard.querySelector('h3')?.textContent || 'Produit',
        price: productCard.dataset.price || productCard.querySelector('.price')?.textContent || 'Prix non défini',
        size: selectedSizeBtn.dataset.size,
        category: productCard.dataset.category || 'Chaussures',
        image: productCard.dataset.image || productCard.querySelector('.product-img')?.src || '',
        description: productCard.querySelector('.product-description')?.textContent || 'Chaussures en cuir véritable'
    };
    
    console.log('📦 Données produit récupérées:', productData);
    
    // Vérifier que les données sont valides
    if (!productData.name || productData.name === 'Produit') {
        console.warn('⚠️ Nom du produit manquant, tentative de récupération...');
        const h3 = productCard.querySelector('h3');
        if (h3) {
            productData.name = h3.textContent.trim();
            console.log('✅ Nom récupéré:', productData.name);
        }
    }
    
    if (!productData.price || productData.price === 'Prix non défini') {
        console.warn('⚠️ Prix du produit manquant, tentative de récupération...');
        const priceElement = productCard.querySelector('.price');
        if (priceElement) {
            productData.price = priceElement.textContent.trim();
            console.log('✅ Prix récupéré:', productData.price);
        }
    }
    
    // Collecter toutes les images du produit
    const productImages = [];
    
    // Ajouter l'image principale
    if (productData.image) {
        productImages.push(productData.image);
    }
    
    // Chercher d'autres images dans la carte produit
    const allImages = productCard.querySelectorAll('img');
    allImages.forEach(img => {
        if (img.src && !img.src.includes('placeholder') && !productImages.includes(img.src)) {
            productImages.push(img.src);
        }
    });
    
    // Si pas d'images trouvées, utiliser des images par défaut
    if (productImages.length === 0) {
        const defaultImages = getDefaultImagesForCategory(productData.category);
        productImages.push(...defaultImages);
    }
    
    console.log('🖼️ Images collectées:', productImages);
    
    // Stocker les données dans localStorage
    try {
        const selectedProduct = {
            name: productData.name,
            price: productData.price,
            size: productData.size,
            category: productData.category,
            image: productData.image,
            images: productImages,
            description: productData.description
        };
        
        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
        
        // Garder aussi l'ancien format pour compatibilité
        localStorage.setItem('selectedProductName', productData.name);
        localStorage.setItem('selectedProductPrice', productData.price);
        localStorage.setItem('selectedProductSize', productData.size);
        localStorage.setItem('selectedProductCategory', productData.category);
        localStorage.setItem('selectedProductImage', productData.image);
        localStorage.setItem('selectedProductDescription', productData.description);
        
        console.log('💾 Données sauvegardées dans localStorage:');
        console.log('   - Nom:', localStorage.getItem('selectedProductName'));
        console.log('   - Prix:', localStorage.getItem('selectedProductPrice'));
        console.log('   - Pointure:', localStorage.getItem('selectedProductSize'));
        console.log('   - Catégorie:', localStorage.getItem('selectedProductCategory'));
        
        // Rediriger vers la page de confirmation
        console.log('🔄 Redirection vers la page de confirmation...');
        
        // Essayer plusieurs méthodes de redirection
        try {
            window.location.href = 'confirmation-commande.html';
        } catch (redirectError) {
            console.error('❌ Erreur de redirection avec href, essai avec assign...');
            try {
                window.location.assign('confirmation-commande.html');
            } catch (assignError) {
                console.error('❌ Erreur de redirection avec assign, essai avec replace...');
                window.location.replace('confirmation-commande.html');
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde des données. Veuillez réessayer.');
    }
}

// Fonction pour la compatibilité avec l'ancien système
function orderWhatsApp(productName, price, size = null) {
    console.log('📱 Commande WhatsApp directe:', productName, price, size);
    
    if (size) {
        // Si une pointure est spécifiée, utiliser directement WhatsApp
        const message = `🛍️ *Nouvelle Commande BkShoes*\n\n👠 *Produit:* ${productName}\n💰 *Prix:* ${price}\n👟 *Pointure:* ${size}\n\n✨ Merci de me confirmer la disponibilité et les détails de livraison.`;
        const whatsappUrl = `https://wa.me/212671818295?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        // Sinon, rediriger vers la sélection de pointure
        alert('Veuillez sélectionner une pointure avant de commander.');
    }
}

// Ajouter des styles CSS pour s'assurer que les boutons sont cliquables
function addSizeButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .size-btn {
            cursor: pointer !important;
            pointer-events: auto !important;
            user-select: none !important;
            position: relative !important;
            z-index: 10 !important;
            transition: all 0.3s ease !important;
        }
        
        .size-btn:hover {
            background-color: #d4af37 !important;
            color: white !important;
            transform: translateY(-2px) !important;
        }
        
        .size-btn.selected {
            background-color: #d4af37 !important;
            color: white !important;
            border-color: #d4af37 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3) !important;
        }
        
        .order-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }
        
        .order-btn.enabled {
            background-color: #d4af37 !important;
            color: white !important;
            cursor: pointer !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 999 !important;
        }
        
        .product-card {
            position: relative !important;
        }
        
        .product-info {
            position: relative !important;
        }
        
        /* S'assurer qu'aucun overlay ne bloque les clics */
        .product-card::before,
        .product-card::after,
        .product-info::before,
        .product-info::after {
            pointer-events: none !important;
        }
        
        /* Styles pour la galerie d'images */
        .image-gallery {
            position: relative !important;
            width: 100% !important;
            height: 250px !important;
            overflow: hidden !important;
        }
        
        .image-gallery .product-img {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
        }
        
        .image-gallery .product-img.active {
            opacity: 1 !important;
        }
        
        .image-dots {
            display: flex !important;
            justify-content: center !important;
            gap: 8px !important;
            margin-top: 10px !important;
        }
        
        .dot {
            width: 12px !important;
            height: 12px !important;
            border-radius: 50% !important;
            background-color: #ddd !important;
            cursor: pointer !important;
            transition: background-color 0.3s ease !important;
        }
        
        .dot.active,
        .dot:hover {
            background-color: #d4af37 !important;
        }
    `;
    document.head.appendChild(style);
    console.log('🎨 Styles CSS ajoutés');
}

// Ajouter les styles dès le chargement
addSizeButtonStyles();

// Rendre la fonction globalement accessible
window.selectProductAndSize = selectProductAndSize;

// Fonction de test pour vérifier que tout fonctionne
function testSizeSelection() {
    console.log('🧪 Test du système de sélection...');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const orderButtons = document.querySelectorAll('.order-btn');
    
    console.log(`🔍 Éléments trouvés:`);
    console.log(`   - Boutons de pointure: ${sizeButtons.length}`);
    console.log(`   - Boutons de commande: ${orderButtons.length}`);
    
    if (sizeButtons.length > 0) {
        console.log('✅ Boutons de pointure détectés');
        sizeButtons.forEach((btn, i) => {
            console.log(`   Bouton ${i+1}: pointure ${btn.dataset.size}, cliquable: ${btn.style.cursor === 'pointer'}`);
        });
    } else {
        console.warn('⚠️ Aucun bouton de pointure trouvé');
    }
    
    if (orderButtons.length > 0) {
        console.log('✅ Boutons de commande détectés');
    } else {
        console.warn('⚠️ Aucun bouton de commande trouvé');
    }
}

// Lancer le test après un délai
setTimeout(testSizeSelection, 1000);

// Fonction utilitaire pour activer tous les boutons (pour debug si nécessaire)
function activateAllOrderButtons() {
    console.log('🔧 Activation de tous les boutons de commande...');
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach((btn, index) => {
        btn.disabled = false;
        btn.classList.add('enabled');
        btn.style.backgroundColor = '#d4af37';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander cette pointure';
        console.log(`✅ Bouton ${index + 1} activé`);
    });
}

// Rendre cette fonction accessible pour debug
window.activateAllOrderButtons = activateAllOrderButtons;

// Fonction pour changer d'image dans la galerie
function showImage(dotElement, imageIndex) {
    console.log('🖼️ Changement d\'image:', imageIndex);
    
    const productCard = dotElement.closest('.product-card');
    if (!productCard) {
        console.error('❌ Carte produit non trouvée');
        return;
    }
    
    const gallery = productCard.querySelector('.image-gallery');
    const dots = productCard.querySelectorAll('.dot');
    const images = gallery.querySelectorAll('.product-img');
    
    // Retirer la classe active de toutes les images et dots
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Ajouter la classe active à l'image et au dot sélectionnés
    if (images[imageIndex]) {
        images[imageIndex].classList.add('active');
    }
    dotElement.classList.add('active');
    
    console.log('✅ Image changée avec succès');
}

// Fonction pour initialiser les galeries d'images avec les images existantes
function initializeImageGalleries() {
    console.log('🖼️ Initialisation des galeries d\'images...');
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const productImage = card.querySelector('.product-image');
        const existingImg = card.querySelector('.product-img');
        
        // Si il n'y a pas de galerie mais une image existante
        if (existingImg && !card.querySelector('.image-gallery')) {
            const imgSrc = existingImg.src;
            const imgAlt = existingImg.alt;
            
            // Créer la galerie avec la même image 3 fois (pour l'instant)
            const galleryHTML = `
                <div class="image-gallery">
                    <img src="${imgSrc}" alt="${imgAlt} Vue 1" class="product-img active" onerror="this.style.display='none';">
                    <img src="${imgSrc}" alt="${imgAlt} Vue 2" class="product-img" onerror="this.style.display='none';">
                    <img src="${imgSrc}" alt="${imgAlt} Vue 3" class="product-img" onerror="this.style.display='none';">
                </div>
                <div class="image-dots">
                    <span class="dot active" onclick="showImage(this, 0)"></span>
                    <span class="dot" onclick="showImage(this, 1)"></span>
                    <span class="dot" onclick="showImage(this, 2)"></span>
                </div>
            `;
            
            // Sauvegarder le placeholder s'il existe
            const placeholder = productImage.querySelector('.placeholder-image');
            
            // Remplacer le contenu
            productImage.innerHTML = galleryHTML;
            
            // Remettre le placeholder
            if (placeholder) {
                productImage.appendChild(placeholder);
            }
            
            console.log(`✅ Galerie créée pour produit ${index + 1}`);
        }
    });
}

// Rendre cette fonction accessible globalement
window.showImage = showImage;

// Fonction pour mettre à jour toutes les pointures vers 37-41
function updateAllSizesToNew() {
    console.log('🔄 Mise à jour des pointures vers 37-41...');
    
    // Trouver tous les conteneurs de pointures
    const sizeGrids = document.querySelectorAll('.sizes-grid');
    
    sizeGrids.forEach((grid, index) => {
        console.log(`📦 Mise à jour grille ${index + 1}`);
        
        // Nouveau HTML pour les pointures 37-41
        const newSizesHTML = `
            <button class="size-btn" data-size="37">37</button>
            <button class="size-btn" data-size="38">38</button>
            <button class="size-btn" data-size="39">39</button>
            <button class="size-btn" data-size="40">40</button>
            <button class="size-btn" data-size="41">41</button>
        `;
        
        // Remplacer le contenu
        grid.innerHTML = newSizesHTML;
        
        console.log(`✅ Grille ${index + 1} mise à jour`);
    });
    
    // Réinitialiser les événements de sélection
    setTimeout(() => {
        initializeSizeSelection();
    }, 500);
    
    console.log('✅ Toutes les pointures mises à jour vers 37-41');
}

// Fonction pour ajouter automatiquement les galeries d'images
function addImageGalleriesToAll() {
    console.log('🖼️ Ajout des galeries d\'images à tous les produits...');
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const productImage = card.querySelector('.product-image');
        const existingImg = card.querySelector('.product-img');
        
        // Si il n'y a pas de galerie mais une image existante
        if (existingImg && !card.querySelector('.image-gallery')) {
            const imgSrc = existingImg.src;
            const imgAlt = existingImg.alt;
            
            // Créer la galerie avec la même image 3 fois
            const galleryHTML = `
                <div class="image-gallery">
                    <img src="${imgSrc}" alt="${imgAlt} Vue 1" class="product-img active" onerror="this.style.display='none';">
                    <img src="${imgSrc}" alt="${imgAlt} Vue 2" class="product-img" onerror="this.style.display='none';">
                    <img src="${imgSrc}" alt="${imgAlt} Vue 3" class="product-img" onerror="this.style.display='none';">
                </div>
                <div class="image-dots">
                    <span class="dot active" onclick="showImage(this, 0)"></span>
                    <span class="dot" onclick="showImage(this, 1)"></span>
                    <span class="dot" onclick="showImage(this, 2)"></span>
                </div>
            `;
            
            // Sauvegarder le placeholder
            const placeholder = productImage.querySelector('.placeholder-image');
            
            // Remplacer le contenu
            productImage.innerHTML = galleryHTML;
            
            // Remettre le placeholder
            if (placeholder) {
                productImage.appendChild(placeholder);
            }
            
            console.log(`✅ Galerie ajoutée au produit ${index + 1}`);
        }
    });
    
    console.log('✅ Toutes les galeries d\'images ajoutées');
}

// Fonction pour tout mettre à jour d'un coup
function updatePageComplete() {
    console.log('🚀 Mise à jour complète de la page...');
    updateAllSizesToNew();
    setTimeout(() => {
        addImageGalleriesToAll();
    }, 1000);
}

// Fonction pour obtenir les images par défaut selon la catégorie
function getDefaultImagesForCategory(category) {
    // Utiliser des data URLs avec des SVG générés pour éviter les erreurs réseau
    const defaultImages = {
        'mocassins': [
            generatePlaceholderImage('Mocassin 1', '#8b7355'),
            generatePlaceholderImage('Mocassin 2', '#a0927d'),
            generatePlaceholderImage('Mocassin 3', '#8b7355')
        ],
        'ballerines': [
            generatePlaceholderImage('Ballerine 1', '#d4af37'),
            generatePlaceholderImage('Ballerine 2', '#f4d03f'),
            generatePlaceholderImage('Ballerine 3', '#d4af37')
        ],
        'mules': [
            generatePlaceholderImage('Mule 1', '#2c3e50'),
            generatePlaceholderImage('Mule 2', '#34495e'),
            generatePlaceholderImage('Mule 3', '#2c3e50')
        ],
        'sandales': [
            generatePlaceholderImage('Sandale 1', '#e67e22'),
            generatePlaceholderImage('Sandale 2', '#f39c12'),
            generatePlaceholderImage('Sandale 3', '#e67e22')
        ],
        'baskets': [
            generatePlaceholderImage('Basket 1', '#3498db'),
            generatePlaceholderImage('Basket 2', '#5dade2'),
            generatePlaceholderImage('Basket 3', '#3498db')
        ],
        'bottes': [
            generatePlaceholderImage('Botte 1', '#8e44ad'),
            generatePlaceholderImage('Botte 2', '#a569bd'),
            generatePlaceholderImage('Botte 3', '#8e44ad')
        ]
    };
    
    return defaultImages[category] || defaultImages['mocassins'];
}

// Fonction pour générer une image placeholder en SVG
function generatePlaceholderImage(text, backgroundColor) {
    const svg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="${backgroundColor}"/>
            <text x="200" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="bold" 
                  fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
            <text x="200" y="160" font-family="Arial, sans-serif" font-size="14" 
                  fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">BkShoes Collection</text>
            <circle cx="200" cy="200" r="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
            <path d="M185 200 L195 210 L215 190" stroke="rgba(255,255,255,0.6)" stroke-width="3" fill="none"/>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Rendre ces fonctions accessibles globalement
window.updateAllSizesToNew = updateAllSizesToNew;
window.addImageGalleriesToAll = addImageGalleriesToAll;
window.updatePageComplete = updatePageComplete;

console.log('✅ Script de sélection de pointure chargé');
