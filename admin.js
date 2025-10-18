// Vérification de l'authentification
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    const currentTime = Date.now();
    
    if (!isLoggedIn || currentTime - loginTime > 7200000) { // 2 heures
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Placeholder SVG (data URL) pour les cas sans image
const ADMIN_PLACEHOLDER = (() => {
    const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" fill="#f0f2f5"/>
      <text x="100" y="75" font-family="Arial, sans-serif" font-size="14" fill="#888" text-anchor="middle" dominant-baseline="middle">Aperçu indisponible</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
})();

// ===== SUPPORT IMAGES GOOGLE DRIVE (Admin) =====
// Extraction robuste de l'ID Drive depuis plusieurs formats d'URL
function extractDriveId(input) {
    if (!input) return '';
    const str = String(input).trim().replace(/^['\"]+|['\"]+$/g, '');
    // 1) Déjà un lien direct uc?id=FILE_ID
    let m = str.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m && m[1]) return m[1];
    // 2) Forme standard: /file/d/FILE_ID/...
    m = str.match(/\/file\/d\/([a-zA-Z0-9_-]{10,})(?:[/?#]|$)/);
    if (m && m[1]) return m[1];
    // 3) Forme courte: /d/FILE_ID/...
    m = str.match(/\/d\/([a-zA-Z0-9_-]{10,})(?:[/?#]|$)/);
    if (m && m[1]) return m[1];
    // 4) Lien open?uc?id= ou open?id=
    m = str.match(/open\?.*?[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m && m[1]) return m[1];
    // 5) Si l'utilisateur colle directement l'ID
    if (/^[a-zA-Z0-9_-]{10,}$/.test(str)) return str;
    return '';
}

// Convertir un lien de partage Drive ou un ID en lien direct image
function driveShareToDirect(urlOrId) {
    if (!urlOrId) return '';
    const str = String(urlOrId).trim();
    // Déjà un lien direct ?
    if (/^https?:\/\/drive\.google\.com\/uc\?/.test(str)) return str;
    const id = extractDriveId(str);
    if (!id) return '';
    return `https://drive.google.com/uc?export=view&id=${id}`;
}

// Accepter aussi des liens directs externes (ex: i.ibb.co)
function isDirectHttpUrl(url) {
    try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Normaliser tout lien saisi: Drive (converti) ou URL http(s) inchangée
function normalizeImageLink(input) {
    const val = (input || '').trim();
    if (!val) return '';
    // 1) Tenter conversion Drive
    const drive = driveShareToDirect(val);
    if (drive) return drive;
    // 2) Si http(s), accepter tel quel
    if (isDirectHttpUrl(val)) return val;
    // 3) Sinon, vide (non reconnu)
    return '';
}

// Utiliser une image depuis un lien/ID Drive pour l'emplacement n (1..3)
function useDriveImage(n) {
    try {
        const input = document.getElementById(`driveLink${n}`);
        const preview = document.getElementById(`imagePreview${n}`);
        if (!input || !preview) return;
        const val = (input.value || '').trim();
        if (!val) {
            showToast('Veuillez coller un lien direct (Drive, i.ibb.co, etc.) ou un ID Drive.', 'error');
            return;
        }
        const direct = normalizeImageLink(val);
        if (!direct) {
            showToast('Lien invalide. Collez une URL http(s) directe ou un ID Drive.', 'error');
            return;
        }
        // Afficher l'aperçu avec bouton de suppression (comme upload local)
        preview.innerHTML = `
            <img src="${direct}" alt="Aperçu ${n}" style="max-width: 150px; max-height: 150px; border-radius: 8px;">
            <button type="button" class="remove-image-btn" onclick="removeImage(${n})">
                <i class="fas fa-times"></i>
            </button>
        `;
        showToast('Image ajoutée', 'success');
        console.log(`[Admin] Aperçu image ${n} défini:`, direct);
    } catch (e) {
        console.warn('useDriveImage error:', e);
        showToast('Erreur lors de l\'ajout de l\'image', 'error');
    }
}

// Afficher un toast de succès/erreur
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#28a745' : '#dc3545';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
    toast.style.marginBottom = '10px';
    toast.style.fontFamily = "Poppins, sans-serif";
    toast.style.fontSize = '14px';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.style.transition = 'opacity .4s ease, transform .4s ease';

    container.appendChild(toast);

    // Disparition progressive
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-6px)';
    }, 2500);

    // Suppression
    setTimeout(() => {
        toast.remove();
        if (container.childElementCount === 0) {
            container.remove();
        }
    }, 3200);
}

// Déconnexion
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
}

// Gestion du menu mobile
function toggleMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
}

// Gestion des sections
function showSection(sectionId) {
    // Masquer toutes les sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les liens du menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    document.getElementById(sectionId).classList.add('active');
    
    // Activer le lien du menu
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
    
    // Fermer le menu mobile après sélection
    closeMobileMenu();
    
    // Mettre à jour les statistiques si on affiche le dashboard
    if (sectionId === 'dashboard') {
        updateDashboardStats();
    }
}

// Référence à la collection Firestore
const productsCollection = db.collection('products');

let products = []; // Les produits seront chargés depuis Firestore

// Sauvegarder les produits dans Firestore
async function saveProducts() {
    try {
        // Mettre à jour chaque produit individuellement ou utiliser un batch
        // Pour la simplicité, nous allons recharger et sauvegarder tout le tableau
        // Dans une application réelle, on ferait des opérations ciblées (add, update, delete)

        // Supprimer tous les produits existants dans Firestore (pour une synchronisation complète)
        const existingProducts = await productsCollection.get();
        const batch = db.batch();
        existingProducts.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Ajouter tous les produits actuels à Firestore
        for (const product of products) {
            await productsCollection.doc(String(product.id)).set(product);
        }

        updateDashboardStats();
        updateCategoryStats();
        loadProducts(); // Recharger depuis Firestore après sauvegarde

        console.log('✅ Produits sauvegardés et synchronisés avec Firestore');
        showToast('Produits enregistrés dans Firestore', 'success');

        // Publier aussi les produits statiques (Option A) via Netlify Function
        publishStaticProducts(products).catch(err => {
            console.warn('⚠️ Publication JSON statique échouée:', err);
        });

    } catch (e) {
        console.error('❌ Erreur lors de la sauvegarde des produits dans Firestore:', e);
        showToast('Erreur de sauvegarde Firestore', 'error');
    }
}

// Normaliser toutes les images des produits vers des liens directs Drive (migration)
function normalizeAllProductImages() {
    let changed = false;
    products = products.map(p => {
        let pChanged = false;
        // Normaliser tableau images (max 3)
        let images = Array.isArray(p.images) ? p.images.slice(0, 3) : [];
        images = images.map(src => {
            const direct = driveShareToDirect(src);
            if (direct && direct !== src) {
                pChanged = true;
                return direct;
            }
            return src || '';
        });
        // Normaliser image unique (héritage)
        let image = p.image;
        if (image) {
            const directOne = driveShareToDirect(image);
            if (directOne && directOne !== image) {
                pChanged = true;
                image = directOne;
            }
        }
        if (pChanged) {
            changed = true;
            return { ...p, images, image };
        }
        return p;
    });
    if (changed) {
        console.log('🔧 Normalisation Drive détectée → sauvegarde');
        saveProducts();
    }
}

// Fonction pour mettre à jour automatiquement les pages du site web (peut être simplifiée si Firestore est la source unique)
function updateWebsitePages() {
    console.log('🔄 Mise à jour automatique des pages du site web...');
    // Si Firestore est la source unique, cette fonction pourrait simplement déclencher un rechargement des données sur les pages front-end
    // Pour l'instant, nous laissons la logique de localStorage pour la compatibilité si elle est utilisée ailleurs.
    // Idéalement, les pages front-end liraient directement de Firestore.
    
    // Déclencher un événement pour notifier les pages ouvertes (si elles écoutent toujours localStorage)
    localStorage.setItem('bkshoes_update_trigger', Date.now());
    
    addActivity('Pages du site mises à jour automatiquement (via Firestore)');
    console.log('✅ Toutes les pages du site ont été mises à jour');
}

// La fonction updateCategoryPage n'est plus nécessaire si les pages front-end lisent directement de Firestore.
// Si elles dépendent encore de localStorage, il faudrait adapter cette logique.

// Charger les produits dans le tableau
function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    
    let filteredProducts = products;
    
    // Filtrer par catégorie
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Filtrer par recherche
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    tbody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const raw = product.images && product.images[0] ? product.images[0] : (product.image || '');
        const mainImage = normalizeImageLink(raw) || ADMIN_PLACEHOLDER;
        const sizesText = product.sizes ? product.sizes.join(', ') : '37-41';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-image-cell">
                    <img src="${mainImage}" alt="${product.name}" onerror="this.onerror=null; this.src='${ADMIN_PLACEHOLDER}'">
                    ${product.images && product.images.length > 1 ? `<span class="image-count">+${product.images.length - 1}</span>` : ''}
                </div>
            </td>
            <td>
                <div class="product-name-cell">
                    <strong>${product.name}</strong>
                    <small>Pointures: ${sizesText}</small>
                </div>
            </td>
            <td><span class="category-badge ${product.category}">${getCategoryName(product.category)}</span></td>
            <td>${product.price} DH</td>
            <td><span class="status-badge ${product.status}">${getStatusName(product.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct(${product.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="view-btn" onclick="viewProduct(${product.id})" title="Voir détails">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Obtenir le nom de la catégorie
function getCategoryName(category) {
    const names = {
        'mocassins': 'Mocassins',
        'ballerines': 'Ballerines',
        'mules': 'Mules',
        'sandales': 'Sandales',
        'bottes': 'Bottes'
    };
    return names[category] || category;
}

// Obtenir le nom du statut
function getStatusName(status) {
    const names = {
        'active': 'Actif',
        'coming-soon': 'Coming Soon',
        'inactive': 'Inactif'
    };
    return names[status] || status;
}

// Filtrer les produits
function filterProducts() {
    loadProducts();
}

// Ouvrir le modal d'ajout/modification
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');
    
    form.reset();
    
    // Réinitialiser les aperçus d'images
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`imagePreview${i}`).innerHTML = '';
    }
    
    // Réinitialiser les pointures (toutes cochées par défaut)
    ['37', '38', '39', '40', '41'].forEach(size => {
        document.getElementById(`size${size}`).checked = true;
    });
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Modifier le produit';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStatus').value = product.status;
            document.getElementById('productDescription').value = product.description || '';
            
            // Charger les images existantes (normalisées Drive)
            if (product.images && product.images.length > 0) {
                product.images.forEach((image, index) => {
                    if (index < 3 && image) {
                        const direct = normalizeImageLink(image);
                        document.getElementById(`imagePreview${index + 1}`).innerHTML = `
                            <img src="${direct}" alt="Aperçu ${index + 1}" style="max-width: 150px; max-height: 150px; border-radius: 8px;">
                        `;
                    }
                });
            } else if (product.image) {
                // Compatibilité avec l'ancien format
                const direct = normalizeImageLink(product.image);
                document.getElementById('imagePreview1').innerHTML = `
                    <img src="${direct}" alt="Aperçu 1" style="max-width: 150px; max-height: 150px; border-radius: 8px;">
                `;
            }
            
            // Charger les pointures
            if (product.sizes && product.sizes.length > 0) {
                // Décocher toutes les pointures d'abord
                ['37', '38', '39', '40', '41'].forEach(size => {
                    document.getElementById(`size${size}`).checked = false;
                });
                // Cocher seulement les pointures disponibles
                product.sizes.forEach(size => {
                    const checkbox = document.getElementById(`size${size}`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }
    } else {
        title.textContent = 'Ajouter un produit';
        document.getElementById('productId').value = '';
    }
    
    modal.style.display = 'flex';
    // Focus direct sur le premier champ Drive pour faciliter le collage
    const firstDrive = document.getElementById('driveLink1');
    if (firstDrive) {
        try { firstDrive.focus(); } catch(_) {}
    }
}

// Fermer le modal
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Modifier un produit
function editProduct(id) {
    openProductModal(id);
}

// Voir les détails d'un produit
function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
        const imagesHtml = product.images && product.images.length > 0 
            ? product.images.map((img, index) => `
                <div class="product-detail-image">
                    <img src="${img}" alt="${product.name} - Image ${index + 1}" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin: 5px;" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2220%22%20height%3D%2220%22%3E%0A%3Crect%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22%23F7F7F7%22/%3E'>
                </div>
            `).join('')
            : `<div class="product-detail-image">
            <img src="${product.image || 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2220%22%20height%3D%2220%22%3E%0A%3Crect%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22%23F7F7F7%22/%3E'}" alt="${product.name}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
        </div>`;
    
    const sizesHtml = product.sizes && product.sizes.length > 0
        ? product.sizes.map(size => `<span class="size-badge">${size}</span>`).join('')
        : '<span class="size-badge">37</span><span class="size-badge">38</span><span class="size-badge">39</span><span class="size-badge">40</span><span class="size-badge">41</span>';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Détails du produit</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="product-details">
                <div class="product-images-grid">
                    ${imagesHtml}
                </div>
                <div class="product-info-detail">
                    <h3>${product.name}</h3>
                    <p><strong>Catégorie:</strong> ${getCategoryName(product.category)}</p>
                    <p><strong>Prix:</strong> ${product.price} DH</p>
                    <p><strong>Statut:</strong> <span class="status-badge ${product.status}">${getStatusName(product.status)}</span></p>
                    <p><strong>Description:</strong> ${product.description || 'Aucune description'}</p>
                    <div class="product-sizes">
                        <strong>Pointures disponibles:</strong><br>
                        ${sizesHtml}
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="edit-btn" onclick="editProduct(${product.id}); this.closest('.modal').remove();">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="cancel-btn" onclick="this.closest('.modal').remove()">Fermer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Supprimer un produit de Firestore
async function deleteProduct(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
            await productsCollection.doc(String(id)).delete();
            products = products.filter(p => p.id !== id); // Mettre à jour le tableau local
            // Pas besoin de saveProducts() ici, car la suppression est directe dans Firestore
            loadProducts(); // Recharger les produits après suppression
            addActivity(`Produit supprimé (ID: ${id}) de Firestore`);
            showToast('Produit supprimé de Firestore', 'success');
        } catch (e) {
            console.error('❌ Erreur lors de la suppression du produit de Firestore:', e);
            showToast('Erreur de suppression Firestore', 'error');
        }
    }
}

// Fonction pour prévisualiser une image
function previewImage(imageNumber) {
    const fileInput = document.getElementById(`productImage${imageNumber}`);
    if (!fileInput) { return; }
    const preview = document.getElementById(`imagePreview${imageNumber}`);
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Aperçu ${imageNumber}" style="max-width: 150px; max-height: 150px; border-radius: 8px;">
                <button type="button" class="remove-image-btn" onclick="removeImage(${imageNumber})">
                    <i class="fas fa-times"></i>
                </button>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

// Fonction pour supprimer une image
function removeImage(imageNumber) {
    const preview = document.getElementById(`imagePreview${imageNumber}`);
    if (preview) preview.innerHTML = '';
    const linkEl = document.getElementById(`driveLink${imageNumber}`);
    if (linkEl) linkEl.value = '';
}

// Gestion du formulaire de produit
// Collecter les images depuis les aperçus OU directement depuis les champs Drive
function collectProductImages() {
    const images = [];
    for (let i = 1; i <= 3; i++) {
        const preview = document.getElementById(`imagePreview${i}`);
        const img = preview ? preview.querySelector('img') : null;
        if (img && img.src) {
            images.push(img.src);
            continue;
        }
        const linkEl = document.getElementById(`driveLink${i}`);
        const val = linkEl ? linkEl.value.trim() : '';
        if (val) {
            const direct = normalizeImageLink(val);
            if (direct) {
                images.push(direct);
                // Optionnel: mettre aussi l'aperçu pour retour visuel
                if (preview) {
                    preview.innerHTML = `
                        <img src="${direct}" alt="Aperçu ${i}" style="max-width: 150px; max-height: 150px; border-radius: 8px;">
                        <button type=\"button\" class=\"remove-image-btn\" onclick=\"removeImage(${i})\">\n                            <i class=\"fas fa-times\"></i>\n                        </button>
                    `;
                }
            } else {
                console.warn('Lien image invalide ignoré pour l\'image', i, val);
            }
        }
    }
    return images;
}

 
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    
    // Récupérer les images (aperçus ou champs Drive directement)
    const images = collectProductImages();
    
    // Récupérer les pointures sélectionnées
    const sizes = [];
    ['37', '38', '39', '40', '41'].forEach(size => {
        if (document.getElementById(`size${size}`).checked) {
            sizes.push(size);
        }
    });
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        status: document.getElementById('productStatus').value,
        description: document.getElementById('productDescription').value,
        images: images,
        sizes: sizes
    };
    
    // Validation
    if (images.length === 0) {
        alert('Veuillez ajouter au moins une image (collez un lien direct http(s) ou un ID Drive puis validez ou appuyez sur Entrée).');
        return;
    }
    
    if (sizes.length === 0) {
        alert('Veuillez sélectionner au moins une pointure.');
        return;
    }
    
    if (productId) {
        // Modification
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            addActivity(`Produit modifié: ${productData.name}`);
        }
    } else {
        // Ajout
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, ...productData });
        addActivity(`Nouveau produit ajouté: ${productData.name}`);
    }
    
    saveProducts(); // Sauvegarder dans Firestore
    updateWebsitePages(); // Mettre à jour automatiquement les pages du site
    closeProductModal();
    // Rediriger l'UI vers la section Produits et afficher un toast de succès
    showSection('products');
    loadProducts();
    showToast('Produit enregistré avec succès', 'success');
});

// Appelle la fonction Netlify pour pousser data/products.json dans le repo
async function publishStaticProducts(productsArray) {
    try {
        const resp = await fetch('/.netlify/functions/update-products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: productsArray })
        });
        if (!resp.ok) {
            const txt = await resp.text();
            throw new Error(`Netlify function error: ${txt}`);
        }
        showToast('Produits publiés (JSON) ✔️', 'success');
        console.log('✅ products.json mis à jour via Netlify Function');
    } catch (e) {
        showToast('Publication JSON échouée (voir console)', 'error');
        console.error(e);
    }
}

// Fonction pour initialiser les produits par défaut lors du premier chargement (si Firestore est vide)
async function initializeDefaultProducts() {
    const snapshot = await productsCollection.get();
    if (snapshot.empty) {
        console.log('🔄 Initialisation des produits par défaut dans Firestore...');
        // Vous pouvez ajouter des produits par défaut ici si nécessaire
        // Par exemple:
        // await productsCollection.doc("1").set({ id: 1, name: "Produit par défaut", ... });
        // Pour l'instant, nous ne faisons rien si Firestore est vide, l'utilisateur devra ajouter des produits manuellement.
        updateWebsitePages();
        addActivity('Produits par défaut initialisés dans Firestore (si Firestore était vide)');
    }
}

// Mettre à jour les statistiques du dashboard
function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('activeProducts').textContent = products.filter(p => p.status === 'active').length;
    document.getElementById('comingSoonProducts').textContent = products.filter(p => p.status === 'coming-soon').length;
}

// Mettre à jour les statistiques des catégories
function updateCategoryStats() {
    const categories = ['mocassins', 'ballerines', 'mules', 'sandales', 'bottes'];
    
    categories.forEach(category => {
        const count = products.filter(p => p.category === category).length;
        const element = document.getElementById(`${category}Count`);
        if (element) {
            element.textContent = `${count} produit${count !== 1 ? 's' : ''}`;
        }
    });
}

// Ajouter une activité
function addActivity(message) {
    const activityList = document.getElementById('activityList');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <time>${new Date().toLocaleString('fr-FR')}</time>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Garder seulement les 10 dernières activités
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

// Réinitialiser toutes les données (supprimer tous les produits de Firestore)
async function clearAllData() {
    if (confirm('⚠️ ATTENTION !\n\nCette action va supprimer TOUS les produits de TOUTES les catégories de Firestore.\n\nÊtes-vous absolument sûr de vouloir continuer ?')) {
        console.log('🗑️ Suppression de tous les produits de Firestore...');
        
        try {
            const snapshot = await productsCollection.get();
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            products = []; // Réinitialiser le tableau local
            // Pas besoin de saveProducts() ici, car la suppression est directe dans Firestore
            loadProducts(); // Recharger les produits après suppression
            updateWebsitePages();
            
            addActivity('🗑️ TOUS les produits ont été supprimés de Firestore');
            
            console.log('✅ Tous les produits supprimés de Firestore avec succès');
            alert('✅ Tous les produits ont été supprimés de Firestore avec succès !\n\n📄 Les pages du site se mettent à jour automatiquement.\n\nVous pouvez maintenant ajouter vos nouveaux produits.');
        } catch (e) {
            console.error('❌ Erreur lors de la suppression de tous les produits de Firestore:', e);
            showToast('Erreur de suppression globale Firestore', 'error');
        }
    }
}

// Fermer le modal en cliquant à l'extérieur
window.addEventListener('click', function(e) {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
        closeProductModal();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', async function() { // Utiliser async ici
    // Vérifier l'authentification
    if (!checkAuth()) return;
    
    // Afficher l'heure actuelle
    document.getElementById('currentTime').textContent = new Date().toLocaleString('fr-FR');
    
    // Afficher la dernière connexion
    const lastLogin = document.getElementById('lastLogin');
    if (lastLogin) {
        lastLogin.value = new Date().toLocaleString('fr-FR');
    }
    
    // Initialiser les produits par défaut si nécessaire (attend que Firestore soit prêt)
    await initializeDefaultProducts();
    
    // Migrer/normaliser d'abord les liens d'images si nécessaire
    normalizeAllProductImages();

    // Charger les données
    loadProducts();
    updateDashboardStats();
    updateCategoryStats();
    
    // Ajouter l'activité de connexion
    addActivity('Connexion administrateur');
    
    console.log('✅ Administration BkShoes initialisée avec succès');
    // Entrée rapide: appuyer sur Enter dans un champ Drive applique l'image
    [1,2,3].forEach(i => {
        const linkEl = document.getElementById(`driveLink${i}`);
        if (linkEl) {
            linkEl.addEventListener('keydown', function(ev) {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    useDriveImage(i);
                }
            });
            // Déclencher l'aperçu automatiquement lors d'un collage ou changement
            const trigger = () => {
                // Petitre délai pour laisser le collage remplir la valeur
                setTimeout(() => useDriveImage(i), 0);
            };
            linkEl.addEventListener('paste', trigger);
            linkEl.addEventListener('change', trigger);
            linkEl.addEventListener('blur', function(){ if (this.value.trim()) useDriveImage(i); });
        }
    });
});
