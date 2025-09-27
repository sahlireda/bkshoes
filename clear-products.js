// ===== SCRIPT POUR VIDER TOUS LES PRODUITS =====
console.log('🗑️ Script de suppression de tous les produits');

// Fonction pour vider tous les produits
function clearAllProducts() {
    console.log('🗑️ Suppression de tous les produits...');
    
    // Vider le localStorage
    localStorage.removeItem('bkshoes_products');
    localStorage.removeItem('bkshoes_products_timestamp');
    
    // Vider les données par catégorie
    const categories = ['mocassins', 'ballerines', 'mules', 'sandales', 'baskets', 'bottes'];
    categories.forEach(category => {
        localStorage.removeItem(`bkshoes_${category}_data`);
    });
    
    // Réinitialiser avec un tableau vide
    localStorage.setItem('bkshoes_products', JSON.stringify([]));
    localStorage.setItem('bkshoes_products_timestamp', Date.now());
    
    console.log('✅ Tous les produits ont été supprimés');
    console.log('📄 Les pages vont se mettre à jour automatiquement');
    
    // Déclencher la mise à jour
    localStorage.setItem('bkshoes_update_trigger', Date.now());
    
    alert('✅ Tous les produits ont été supprimés avec succès !\nLes pages sont maintenant vides et prêtes pour vos nouveaux produits.');
}

// Fonction pour vider une page spécifique
function clearPageProducts() {
    const currentPage = getCurrentPageCategory();
    if (!currentPage) {
        console.log('❌ Page non reconnue');
        return;
    }
    
    console.log(`🗑️ Suppression des produits de la page ${currentPage}...`);
    
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = '<!-- Les produits seront ajoutés automatiquement depuis l\'administration -->';
        console.log(`✅ Page ${currentPage} vidée`);
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

// Exécuter au chargement si on est sur une page catégorie
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = getCurrentPageCategory();
    if (currentPage) {
        console.log(`📄 Page ${currentPage} détectée`);
        console.log('💡 Pour vider tous les produits, tapez: clearAllProducts()');
        console.log('💡 Pour vider cette page seulement, tapez: clearPageProducts()');
    }
});

// Rendre les fonctions accessibles globalement
window.clearAllProducts = clearAllProducts;
window.clearPageProducts = clearPageProducts;
