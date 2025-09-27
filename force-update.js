// ===== SCRIPT POUR FORCER LA MISE À JOUR DE TOUTES LES PAGES =====
console.log('🔄 Script de mise à jour forcée chargé');

// Fonction pour forcer la mise à jour immédiate
function forceUpdateAllPages() {
    console.log('🔄 Forçage de la mise à jour de toutes les pages...');
    
    // Déclencher tous les événements de mise à jour possibles
    localStorage.setItem('bkshoes_update_trigger', Date.now());
    localStorage.setItem('bkshoes_products_timestamp', Date.now());
    localStorage.setItem('bkshoes_last_sync_check', '0'); // Force la prochaine vérification
    
    // Vider et recharger les données
    const products = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    localStorage.setItem('bkshoes_products', JSON.stringify(products));
    
    // Mettre à jour les données par catégorie
    const categories = ['mocassins', 'ballerines', 'mules', 'sandales', 'baskets', 'bottes'];
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category && p.status === 'active');
        const categoryData = {
            category: category,
            products: categoryProducts,
            lastUpdate: Date.now()
        };
        localStorage.setItem(`bkshoes_${category}_data`, JSON.stringify(categoryData));
    });
    
    console.log('✅ Mise à jour forcée terminée');
    console.log('📄 Toutes les pages devraient se mettre à jour automatiquement');
    
    // Déclencher l'événement storage manuellement
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'bkshoes_update_trigger',
        newValue: Date.now().toString()
    }));
    
    alert('✅ Mise à jour forcée terminée !\n\nToutes les pages vont se synchroniser automatiquement.');
}

// Fonction pour vérifier l'état actuel
function checkCurrentState() {
    const products = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    console.log(`📊 État actuel: ${products.length} produits`);
    
    const categories = ['mocassins', 'ballerines', 'mules', 'sandales', 'baskets', 'bottes'];
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category && p.status === 'active');
        console.log(`📦 ${category}: ${categoryProducts.length} produits`);
    });
    
    return products.length;
}

// Rendre les fonctions accessibles globalement
window.forceUpdateAllPages = forceUpdateAllPages;
window.checkCurrentState = checkCurrentState;

// Message d'aide
console.log('💡 Fonctions disponibles:');
console.log('   - forceUpdateAllPages() : Force la mise à jour de toutes les pages');
console.log('   - checkCurrentState() : Vérifie l\'état actuel des produits');

// Auto-exécution si la page est vide
document.addEventListener('DOMContentLoaded', function() {
    const productCount = checkCurrentState();
    if (productCount === 0) {
        console.log('✅ Système vide détecté - toutes les pages sont prêtes');
    }
});
