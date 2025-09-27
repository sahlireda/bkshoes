// ===== ROUTEUR D'ADMINISTRATION BKSHOES =====
console.log('🔐 Routeur d\'administration chargé');

// Fonction pour gérer les routes d'administration
function handleAdminRouting() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const currentSearch = window.location.search;
    
    console.log('📍 Chemin actuel:', currentPath);
    
    // Vérifier si l'URL contient /admin
    if (currentPath.includes('/admin') || currentPath.endsWith('/admin')) {
        console.log('🔐 Accès administration détecté');
        window.location.href = 'admin';
        return;
    }
    
    // Vérifier les paramètres d'URL pour l'accès discret
    const urlParams = new URLSearchParams(currentSearch);
    if (urlParams.get('access') === 'admin' || urlParams.get('admin') === 'true') {
        console.log('🔑 Paramètre d\'accès administration détecté');
        window.location.href = 'admin';
        return;
    }
    
    // Vérifier le hash pour l'accès discret
    if (currentHash === '#admin' || currentHash === '#administration') {
        console.log('🔗 Hash d\'accès administration détecté');
        window.location.href = 'admin';
        return;
    }
}

// Fonction pour créer un accès discret via combinaison de touches
function setupSecretAccess() {
    let keySequence = [];
    const secretCode = ['a', 'd', 'm', 'i', 'n']; // Taper "admin"
    
    document.addEventListener('keydown', function(e) {
        // Ignorer si on est dans un champ de saisie
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        keySequence.push(e.key.toLowerCase());
        
        // Garder seulement les 5 dernières touches
        if (keySequence.length > secretCode.length) {
            keySequence = keySequence.slice(-secretCode.length);
        }
        
        // Vérifier si la séquence correspond
        if (keySequence.length === secretCode.length) {
            const matches = keySequence.every((key, index) => key === secretCode[index]);
            if (matches) {
                console.log('🔓 Code secret détecté !');
                showSecretAccessPrompt();
                keySequence = []; // Reset
            }
        }
    });
}

// Fonction pour afficher le prompt d'accès secret
function showSecretAccessPrompt() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <h3 style="color: #d4af37; margin-bottom: 1rem;">
                <i class="fas fa-key"></i> Accès Détecté
            </h3>
            <p style="color: #666; margin-bottom: 2rem;">
                Voulez-vous accéder à la zone d'administration ?
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="window.location.href='admin'" style="
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    <i class="fas fa-sign-in-alt"></i> Accéder
                </button>
                <button onclick="this.closest('div').remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    <i class="fas fa-times"></i> Annuler
                </button>
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
    
    // Auto-fermeture après 10 secondes
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 10000);
}

// Fonction pour masquer les éléments d'administration
function hideAdminElements() {
    // Masquer les liens vers les outils d'administration
    const adminLinks = document.querySelectorAll('a[href*="admin"], a[href*="status"], a[href*="reset"], a[href*="test"]');
    adminLinks.forEach(link => {
        if (!link.closest('.hidden-admin-access')) {
            link.style.display = 'none';
        }
    });
    
    // Masquer les éléments de debug
    const debugElements = document.querySelectorAll('.debug, .admin-tools, .sync-tools');
    debugElements.forEach(element => {
        element.style.display = 'none';
    });
    
    console.log('👁️ Éléments d\'administration masqués');
}

// Fonction pour créer un accès discret dans le footer
function createDiscreetAccess() {
    const footer = document.querySelector('footer');
    if (footer) {
        const accessElement = document.createElement('div');
        accessElement.className = 'hidden-admin-access';
        accessElement.style.cssText = `
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 10px;
            height: 10px;
            background: transparent;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        accessElement.addEventListener('mouseenter', function() {
            this.style.opacity = '0.3';
        });
        
        accessElement.addEventListener('mouseleave', function() {
            this.style.opacity = '0';
        });
        
        accessElement.addEventListener('click', function() {
            showSecretAccessPrompt();
        });
        
        footer.style.position = 'relative';
        footer.appendChild(accessElement);
        
        console.log('🔗 Accès discret créé dans le footer');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier les routes d'administration
    handleAdminRouting();
    
    // Configurer l'accès secret
    setupSecretAccess();
    
    // Masquer les éléments d'administration
    hideAdminElements();
    
    // Créer un accès discret
    createDiscreetAccess();
    
    console.log('✅ Routeur d\'administration initialisé');
    console.log('💡 Accès possibles:');
    console.log('   - URL: /admin ou ?admin=true ou #admin');
    console.log('   - Clavier: Taper "admin" sur la page');
    console.log('   - Souris: Zone invisible en bas à droite du footer');
});

// Écouter les changements d'URL (pour les SPA)
window.addEventListener('popstate', handleAdminRouting);
window.addEventListener('hashchange', handleAdminRouting);
