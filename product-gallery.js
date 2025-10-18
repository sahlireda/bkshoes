// Script pour la galerie d'images de la page de confirmation
console.log('🖼️ Product Gallery script chargé');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Galerie d\'images - Initialisation...');
    
    // Récupérer les données du produit depuis l'URL ou le localStorage
    loadProductGallery();
    
    // Initialiser les événements de la galerie
    initializeGalleryEvents();
});

function loadProductGallery() {
    // Récupérer les données du produit depuis localStorage
    const selectedProductData = localStorage.getItem('selectedProduct');
    let selectedProduct = {};

    if (selectedProductData) {
        selectedProduct = JSON.parse(selectedProductData);
    } else {
        // Fallback si 'selectedProduct' n'est pas trouvé (pour compatibilité ou debug)
        selectedProduct = {
            name: 'Produit sélectionné',
            price: 'Prix non défini',
            size: '--',
            category: 'mocassins',
            image: '',
            description: 'Description du produit',
            images: []
        };
    }
    
    // Assurez-vous que 'images' est un tableau
    if (!selectedProduct.images || !Array.isArray(selectedProduct.images)) {
        selectedProduct.images = [];
    }

    // Si l'image principale existe mais n'est pas dans le tableau d'images, l'ajouter
    if (selectedProduct.image && !selectedProduct.images.includes(selectedProduct.image)) {
        selectedProduct.images.unshift(selectedProduct.image);
    }
    
    // Si toujours pas d'images, charger les images par défaut
    if (selectedProduct.images.length === 0) {
        loadDefaultImages(selectedProduct);
    } else {
        displayProductGallery(selectedProduct);
    }
}

function displayProductGallery(product) {
    console.log('🎨 Affichage de la galerie pour:', product.name);
    
    const mainImageElement = document.getElementById('selected-product-main-image');
    const mainPlaceholder = document.getElementById('selected-product-main-placeholder');
    const imagesGrid = document.getElementById('product-images-grid');
    
    // Afficher l'image principale
    if (product.images && product.images.length > 0) {
        mainImageElement.src = product.images[0];
        mainImageElement.style.display = 'block';
        mainPlaceholder.style.display = 'none';
        
        // Créer la galerie d'images
        createImageGallery(product.images, imagesGrid);
    } else {
        // Afficher le placeholder
        mainImageElement.style.display = 'none';
        mainPlaceholder.style.display = 'flex';
        
        // Afficher le placeholder de la galerie
        showGalleryPlaceholder(imagesGrid);
    }
}

function createImageGallery(images, container) {
    console.log('🖼️ Création de la galerie avec', images.length, 'images');
    
    // Vider le container
    container.innerHTML = '';
    
    // Créer les éléments de la galerie
    images.forEach((imageSrc, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-image';
        if (index === 0) galleryItem.classList.add('active');
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Image ${index + 1}`;
        img.loading = 'lazy';
        
        // Ajouter les événements
        galleryItem.addEventListener('click', () => selectMainImage(imageSrc, index));
        galleryItem.addEventListener('dblclick', () => openImageModal(imageSrc));
        
        galleryItem.appendChild(img);
        container.appendChild(galleryItem);
    });
}

function selectMainImage(imageSrc, index) {
    console.log('🖱️ Sélection de l\'image', index + 1);
    
    const mainImage = document.getElementById('selected-product-main-image');
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    // Mettre à jour l'image principale
    mainImage.src = imageSrc;
    
    // Mettre à jour les classes actives
    galleryImages.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function openImageModal(imageSrc) {
    console.log('🔍 Ouverture du modal pour l\'image');
    
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.classList.add('active');
    
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    console.log('❌ Fermeture du modal image');
    
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    
    // Restaurer le scroll du body
    document.body.style.overflow = 'visible';
}

function loadDefaultImages(product) {
    console.log('🎨 Chargement des images par défaut pour la catégorie:', product.category);
    
    // Utiliser la fonction de génération d'images SVG
    const categoryImages = getDefaultImagesForCategory(product.category);
    
    // Créer un produit avec les images par défaut
    const productWithImages = {
        ...product,
        images: categoryImages
    };
    
    displayProductGallery(productWithImages);
}

// Fonction pour obtenir les images par défaut selon la catégorie (identique à size-selection.js)
function getDefaultImagesForCategory(category) {
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

function showGalleryPlaceholder(container) {
    container.innerHTML = `
        <div class="gallery-placeholder">
            <i class="fas fa-camera"></i>
            <p>Photos du produit</p>
        </div>
    `;
}

function initializeGalleryEvents() {
    console.log('⚙️ Initialisation des événements de la galerie');
    
    // Fermeture du modal avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
    
    // Fermeture du modal en cliquant sur le fond
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
    
    // Double-clic sur l'image principale pour ouvrir le modal
    const mainImage = document.getElementById('selected-product-main-image');
    if (mainImage) {
        mainImage.addEventListener('dblclick', function() {
            if (this.src && !this.src.includes('placeholder')) {
                openImageModal(this.src);
            }
        });
        
        // Ajouter un curseur pointer pour indiquer que c'est cliquable
        mainImage.style.cursor = 'pointer';
        mainImage.title = 'Double-cliquez pour agrandir';
    }
}


// Fonctions globales pour l'accès depuis le HTML
window.closeImageModal = closeImageModal;
window.openImageModal = openImageModal;

console.log('✅ Product Gallery script initialisé avec succès');
