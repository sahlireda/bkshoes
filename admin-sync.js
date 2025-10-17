// ===== SYSTÈME DE SYNCHRONISATION ADMINISTRATION =====
console.log('🔄 Système de synchronisation administration chargé');

// Fonction pour synchroniser les produits depuis l'administration
function syncProductsFromAdmin() {
    console.log('🔄 Synchronisation des produits depuis l\'administration...');
    
    const adminProducts = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    const currentPage = getCurrentPageCategory();
    
    if (!currentPage) {
        console.log('📄 Page non reconnue pour la synchronisation');
        return;
    }
    
    // Filtrer les produits pour la catégorie actuelle
    const categoryProducts = adminProducts.filter(p => 
        p.category === currentPage && p.status === 'active'
    );
    
    console.log(`📦 ${categoryProducts.length} produits trouvés pour ${currentPage}`);
    
    if (categoryProducts.length > 0) {
        const productsGrid = document.querySelector('#products-grid') || document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.classList.remove('empty-state');
        }
        updatePageProducts(categoryProducts);
    } else {
        // Afficher l'état vide Coming Soon sur la page courante
        const productsGrid = document.querySelector('#products-grid') || document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.classList.add('empty-state');
            productsGrid.innerHTML = `
                <div class="coming-soon-empty">
                    <div class="cs-badge">Bientôt disponible</div>
                    <div class="cs-dots" aria-hidden="true">
                        <span class="cs-dot"></span>
                        <span class="cs-dot"></span>
                        <span class="cs-dot"></span>
                    </div>
                </div>
            `;
        }
    }
}

// Déterminer la catégorie de la page actuelle
function getCurrentPageCategory() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    const categoryMap = {
        'mocassins.html': 'mocassins',
        'ballerines.html': 'ballerines',
        'mules.html': 'mules',
        'sandales.html': 'sandales',
        'baskets.html': 'baskets',
        'bottes.html': 'bottes'
    };
    
    return categoryMap[filename] || null;
}

// Mettre à jour les produits sur la page
function updatePageProducts(products) {
    console.log('🔄 Mise à jour des produits sur la page...');
    
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.warn('⚠️ Grille de produits non trouvée');
        return;
    }
    
    // Sauvegarder les éléments non-produits (header, etc.)
    const nonProductElements = [];
    productsGrid.querySelectorAll(':not(.product-card)').forEach(el => {
        nonProductElements.push(el.cloneNode(true));
    });
    
    // Vider la grille
    productsGrid.innerHTML = '';
    
    // Remettre les éléments non-produits
    nonProductElements.forEach(el => {
        productsGrid.appendChild(el);
    });
    
    // Ajouter les nouveaux produits
    products.forEach((product, index) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
        
        console.log(`✅ Produit ajouté: ${product.name}`);
    });
    
    // Réinitialiser les événements de sélection de pointure
    if (typeof initializeSizeSelection === 'function') {
        setTimeout(() => {
            initializeSizeSelection();
        }, 100);
    }
    
    // Mettre à jour le compteur de produits
    updateProductsCount(products.length);
    
    console.log(`✅ ${products.length} produits synchronisés avec succès`);
}

// Créer une carte produit
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    productCard.setAttribute('data-name', product.name);
    productCard.setAttribute('data-price', `${product.price} DH`);
    productCard.setAttribute('data-image', product.images && product.images[0] ? product.images[0] : '');
    
    // Créer la galerie d'images ou image simple
    let imageHtml = '';
    if (product.images && product.images.length > 1) {
        // Galerie d'images
        imageHtml = `
            <div class="image-gallery">
                ${product.images.slice(0, 3).map((img, index) => `
                    <img src="${img}" alt="${product.name} Vue ${index + 1}" class="product-img ${index === 0 ? 'active' : ''}" onerror="this.style.display='none';">
                `).join('')}
            </div>
            <div class="image-dots">
                ${product.images.slice(0, 3).map((_, index) => `
                    <span class="dot ${index === 0 ? 'active' : ''}" onclick="showImage(this, ${index})"></span>
                `).join('')}
            </div>
        `;
    } else {
        // Image simple
        const imageUrl = product.images && product.images[0] ? product.images[0] : (product.image || '');
        imageHtml = `
            <img src="${imageUrl}" alt="${product.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        `;
    }
    
    // Créer les boutons de pointure
    const sizes = product.sizes || ['37', '38', '39', '40', '41'];
    const sizesHtml = sizes.map(size => 
        `<button class="size-btn" data-size="${size}">${size}</button>`
    ).join('');
    
    productCard.innerHTML = `
        <div class="product-image">
            ${imageHtml}
            <div class="placeholder-image" style="display: none;">
                <i class="fas fa-shoe-prints"></i>
                <p>${product.name}</p>
            </div>
        </div>
        <div class="product-info">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description || 'Chaussures en cuir véritable de qualité supérieure'}</p>
                <div class="price-container">
                    <span class="price">${product.price} DH</span>
                </div>
            </div>
            <div class="product-actions">
                <div class="size-selection">
                    <span class="sizes-label">Choisir la pointure:</span>
                    <div class="sizes-grid">
                        ${sizesHtml}
                    </div>
                </div>
                <button class="order-btn" onclick="selectProductAndSize(this)" disabled>
                    <i class="fas fa-shopping-cart"></i> Sélectionner une pointure
                </button>
            </div>
        </div>
    `;
    
    return productCard;
}

// Fonction pour gérer les galeries d'images
function showImage(dotElement, imageIndex) {
    const productCard = dotElement.closest('.product-card');
    const images = productCard.querySelectorAll('.image-gallery .product-img');
    const dots = productCard.querySelectorAll('.dot');
    
    // Masquer toutes les images
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Afficher l'image sélectionnée
    if (images[imageIndex]) {
        images[imageIndex].classList.add('active');
    }
    dotElement.classList.add('active');
}

// Mettre à jour le compteur de produits
function updateProductsCount(count) {
    const countElement = document.querySelector('.products-count span');
    if (countElement) {
        countElement.textContent = `${count} produit${count !== 1 ? 's' : ''} disponible${count !== 1 ? 's' : ''}`;
    }
}

// Rendre la fonction showImage accessible globalement
window.showImage = showImage;

// Écouter les changements dans localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'bkshoes_products_timestamp' || e.key === 'bkshoes_update_trigger') {
        console.log('🔄 Mise à jour détectée depuis l\'administration');
        setTimeout(() => {
            syncProductsFromAdmin();
        }, 500);
    }
});

// Synchronisation périodique (toutes les 30 secondes)
setInterval(() => {
    const lastCheck = localStorage.getItem('bkshoes_last_sync_check');
    const lastUpdate = localStorage.getItem('bkshoes_products_timestamp');
    
    if (lastUpdate && (!lastCheck || parseInt(lastUpdate) > parseInt(lastCheck))) {
        console.log('🔄 Synchronisation périodique détectée');
        syncProductsFromAdmin();
        localStorage.setItem('bkshoes_last_sync_check', Date.now());
    }
}, 30000);

// Synchronisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Charger d'abord les produits statiques si localStorage vide, puis synchroniser la page
    setTimeout(() => {
        loadStaticProductsIfEmpty().then(() => {
            syncProductsFromAdmin();
        });
    }, 500);
});

console.log('✅ Système de synchronisation administration initialisé');

// Alias pratique pour déclencher une synchro manuelle depuis la console
// Exemple: forceSyncProducts()
window.forceSyncProducts = function() {
    console.log('🔄 forceSyncProducts() appelé');
    syncProductsFromAdmin();
};

// Charger des produits statiques (Option A) si aucune donnée locale
function loadStaticProductsIfEmpty() {
    return new Promise(resolve => {
        try {
            const existing = JSON.parse(localStorage.getItem('bkshoes_products') || '[]');
            if (Array.isArray(existing) && existing.length > 0) {
                resolve(false);
                return;
            }
        } catch (_) {
            // ignore
        }

        fetch('data/products.json', { cache: 'no-store' })
            .then(resp => resp.ok ? resp.json() : [])
            .then(json => {
                if (Array.isArray(json) && json.length > 0) {
                    localStorage.setItem('bkshoes_products', JSON.stringify(json));
                    localStorage.setItem('bkshoes_products_timestamp', Date.now());
                    console.log('📥 Produits statiques chargés depuis data/products.json');
                } else {
                    console.log('ℹ️ Aucun produit statique trouvé dans data/products.json');
                }
                resolve(true);
            })
            .catch(err => {
                console.warn('⚠️ Échec du chargement des produits statiques:', err);
                resolve(false);
            });
    });
}
