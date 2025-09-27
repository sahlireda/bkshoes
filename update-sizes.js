// Script pour mettre à jour automatiquement les pointures sur toutes les pages
// Exécuter ce script dans la console de chaque page catégorie

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
    if (typeof initializeSizeSelection === 'function') {
        setTimeout(() => {
            initializeSizeSelection();
        }, 500);
    }
    
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

// Fonction pour ajouter 3 images à un produit
function addImageGallery(productCard, productName, baseImagePath) {
    const productImage = productCard.querySelector('.product-image');
    
    const galleryHTML = `
        <div class="image-gallery">
            <img src="${baseImagePath}-1.jpg" alt="${productName} Vue 1" class="product-img active" onerror="this.style.display='none';">
            <img src="${baseImagePath}-2.jpg" alt="${productName} Vue 2" class="product-img" onerror="this.style.display='none';">
            <img src="${baseImagePath}-3.jpg" alt="${productName} Vue 3" class="product-img" onerror="this.style.display='none';">
        </div>
        <div class="image-dots">
            <span class="dot active" onclick="showImage(this, 0)"></span>
            <span class="dot" onclick="showImage(this, 1)"></span>
            <span class="dot" onclick="showImage(this, 2)"></span>
        </div>
    `;
    
    // Remplacer le contenu de product-image
    const placeholder = productImage.querySelector('.placeholder-image');
    productImage.innerHTML = galleryHTML;
    if (placeholder) {
        productImage.appendChild(placeholder);
    }
}

// Rendre les fonctions accessibles
window.updateAllSizesToNew = updateAllSizesToNew;
window.addImageGallery = addImageGallery;

console.log('🛠️ Script de mise à jour chargé. Utilisez updateAllSizesToNew() pour mettre à jour les pointures.');
