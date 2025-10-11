// Configuration WhatsApp - Remplacez par votre numéro
const WHATSAPP_NUMBER = "212671818295"; // Numéro WhatsApp configuré

// ===== LOADER PROFESSIONNEL =====
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    const body = document.body;
    
    if (loader) {
        loader.classList.add('hidden');
        body.style.overflow = 'visible';
        
        // Déclencher les animations d'entrée après un petit délai
        setTimeout(() => {
            initEntranceAnimations();
        }, 100);
    }
}

// Masquer le loader après le chargement complet OU après 3 secondes maximum
window.addEventListener('load', function() {
    setTimeout(hideLoader, 800);
});

// Cache-busting pour styles.css en production (Netlify)
document.addEventListener('DOMContentLoaded', function() {
    try {
        const ASSET_VERSION = '2025-10-11-3';
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        links.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href && href.indexOf('styles.css') !== -1) {
                const base = href.split('?')[0];
                const newHref = base + '?v=' + ASSET_VERSION;
                if (link.getAttribute('href') !== newHref) {
                    link.setAttribute('href', newHref);
                    console.log('🔄 Cache-busting appliqué à styles.css:', newHref);
                }
            }
        });
    } catch (e) {
        console.warn('Cache-busting CSS ignoré:', e);
    }

    // 1) Import automatique depuis un lien partageable (?p= ou ?pl=)
    try {
        importProductsFromLink();
    } catch (e) {
        console.warn('Import de produits via lien ignoré:', e);
    }
});

// =====================
// Partage sans backend
// =====================
function base64UrlDecode(input) {
    try {
        // Remplacer URL-safe chars et compléter le padding
        input = input.replace(/-/g, '+').replace(/_/g, '/');
        const pad = input.length % 4;
        if (pad) input += '='.repeat(4 - pad);
        return atob(input);
    } catch (e) {
        console.warn('Base64Url decode error:', e);
        return null;
    }
}

function safeJsonParse(str) {
    try { return JSON.parse(str); } catch { return null; }
}

function normalizeProduct(p) {
    if (!p || typeof p !== 'object') return null;
    const copy = { ...p };
    // Normalisations basiques
    copy.category = (copy.category || '').toLowerCase();
    copy.status = copy.status || 'active';
    if (!Array.isArray(copy.images)) {
        if (copy.image) copy.images = [copy.image]; else copy.images = [];
    }
    return copy;
}

function mergeProductsIntoLocal(products) {
    const KEY = 'bkshoes_products';
    const existing = safeJsonParse(localStorage.getItem(KEY)) || [];
    const byKey = new Map();
    const makeKey = (p) => `${(p.category||'').trim()}__${(p.name||'').trim()}`;

    // Index existants
    existing.forEach(p => {
        byKey.set(makeKey(p), p);
    });

    // Fusion: remplacer si même (catégorie + nom), sinon ajouter
    products.forEach(p => {
        const norm = normalizeProduct(p);
        if (!norm || !norm.name || !norm.category) return;
        byKey.set(makeKey(norm), { ...byKey.get(makeKey(norm)), ...norm });
    });

    const merged = Array.from(byKey.values());
    localStorage.setItem(KEY, JSON.stringify(merged));
    localStorage.setItem('bkshoes_products_timestamp', Date.now().toString());
    localStorage.setItem('bkshoes_update_trigger', Math.random().toString(36).slice(2));
    console.log(`✅ ${products.length} produit(s) importé(s) via lien. Total: ${merged.length}`);
}

function importProductsFromLink() {
    const params = new URLSearchParams(location.search);
    const single = params.get('p'); // produit unique encodé base64url(JSON)
    const list = params.get('pl');  // liste de produits encodée base64url(JSON array)

    if (!single && !list) return; // rien à faire

    let imported = [];
    if (single) {
        const decoded = base64UrlDecode(single);
        const obj = safeJsonParse(decoded || '');
        if (obj) imported.push(obj);
    }
    if (list) {
        const decoded = base64UrlDecode(list);
        const arr = safeJsonParse(decoded || '');
        if (Array.isArray(arr)) imported = imported.concat(arr);
    }

    if (imported.length) {
        mergeProductsIntoLocal(imported);
        // Nettoyer l'URL pour éviter les ré-imports
        const cleanUrl = location.origin + location.pathname + location.hash;
        if (history && history.replaceState) history.replaceState({}, document.title, cleanUrl);
    } else {
        console.warn('Aucun produit valide trouvé dans les paramètres du lien');
    }
}

// Helpers pour générer des liens partageables depuis la console
function base64UrlEncode(str) {
    const b64 = btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    return b64;
}

function generateShareLinkForProduct(product) {
    const payload = base64UrlEncode(JSON.stringify(product || {}));
    return location.origin + location.pathname + `?p=${payload}`;
}

function generateShareLinkForProducts(products) {
    const payload = base64UrlEncode(JSON.stringify(products || []));
    return location.origin + location.pathname + `?pl=${payload}`;
}

window.ShareBK = {
    generateShareLinkForProduct,
    generateShareLinkForProducts
};

// Forcer l'affichage des produits en 1 colonne et centrés (toutes pages)
document.addEventListener('DOMContentLoaded', function() {
    function applyOnePerRow() {
        try {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            document.querySelectorAll('.products-grid').forEach(grid => {
                grid.style.display = 'grid';
                if (isMobile) {
                    grid.style.gridTemplateColumns = '1fr';
                    grid.style.justifyItems = 'center';
                } else {
                    // Laisser le CSS gérer le layout desktop (3 colonnes)
                    grid.style.gridTemplateColumns = '';
                    grid.style.justifyItems = '';
                }
            });
        } catch (e) {
            console.warn('applyOnePerRow failed:', e);
        }
    }

    // Initial application
    applyOnePerRow();

    // Observer pour ré-appliquer quand le contenu est injecté/chargé
    try {
        const observer = new MutationObserver(() => applyOnePerRow());
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
        console.warn('MutationObserver not available:', e);
    }

    // Recalculer au redimensionnement (passage mobile/desktop)
    window.addEventListener('resize', applyOnePerRow);
});

// Fallback : masquer le loader après 3 secondes même si la page n'est pas complètement chargée
setTimeout(hideLoader, 3000);

// Masquer le scroll pendant le chargement initial
if (document.readyState === 'loading') {
    document.body.style.overflow = 'hidden';
}

// Canonical: forcer les URLs avec .html si la page est servie via un chemin sans extension (Netlify clean URLs)
(function enforceHtmlCanonicalUrl(){
    try {
        var rawPath = (window.location && window.location.pathname) ? window.location.pathname : '/';
        // Supprimer les slashes de début/fin
        var path = rawPath.replace(/^\/+|\/+$/g, '').toLowerCase();
        // Pages internes connues
        var pages = new Set(['index','mocassins','ballerines','mules','sandales','baskets','bottes']);

        // Cas spécial: racine "/" -> forcer /index.html
        if (path === '') {
            var home = window.location.origin + '/index.html' + (window.location.search || '') + (window.location.hash || '');
            if (window.location.href !== home) {
                window.location.replace(home);
                return;
            }
        }

        // Si l'URL est exactement une page connue SANS extension, rediriger vers .html
        if (pages.has(path)) {
            var target = window.location.origin + '/' + path + '.html' + (window.location.search || '') + (window.location.hash || '');
            if (window.location.href !== target) {
                window.location.replace(target);
            }
        }
    } catch (e) {
        console.warn('Canonical .html redirect skipped:', e);
    }
})();

// ===== ANIMATIONS D'ENTRÉE SOPHISTIQUÉES =====
function initEntranceAnimations() {
    // Animation des éléments avec intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animation spécifique selon la classe
                if (element.classList.contains('section-title')) {
                    element.style.animation = 'titleSlideUp 0.8s ease-out forwards';
                } else if (element.classList.contains('section-subtitle')) {
                    element.style.animation = 'fadeInUp 0.8s ease-out 0.2s forwards';
                } else if (element.classList.contains('product-card')) {
                    const delay = Array.from(element.parentNode.children).indexOf(element) * 0.1;
                    element.style.animation = `cardSlideUp 0.8s ease-out ${delay}s forwards`;
                } else if (element.classList.contains('quality-section')) {
                    element.style.animation = 'fadeInUp 1s ease-out forwards';
                } else {
                    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
                
                animateOnScroll.unobserve(element);
            }
        });
    }, observerOptions);

    // Observer tous les éléments à animer
    const elementsToAnimate = document.querySelectorAll(`
        .section-title,
        .section-subtitle,
        .product-card,
        .quality-section,
        .social-section,
        .contact-section
    `);

    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        animateOnScroll.observe(element);
    });
}

// ===== PARALLAXE AVANCÉ =====
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const heroParticles = document.querySelector('.hero-particles');
    const heroGradient = document.querySelector('.hero-gradient');
    
    if (heroParticles) {
        heroParticles.style.transform = `translateY(${rate}px)`;
    }
    
    if (heroGradient) {
        heroGradient.style.transform = `translateY(${rate * 0.3}px) rotate(${scrolled * 0.1}deg)`;
    }
    
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxUpdate);

// ===== MICRO-INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Animation du scroll indicator
    const scrollIndicator = document.querySelector('.scroll-arrow');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.querySelector('#mocassins').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Effet de typing sur les statistiques
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerStats = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observerStats.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observerStats.observe(stat));
}

function animateNumber(element) {
    const finalNumber = element.textContent;
    const isPercentage = finalNumber.includes('%');
    const isPlus = finalNumber.includes('+');
    const number = parseInt(finalNumber.replace(/[^\d]/g, ''));
    
    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayNumber = Math.floor(current);
        if (isPercentage) displayNumber += '%';
        if (isPlus) displayNumber = '+' + displayNumber;
        if (finalNumber.includes('h')) displayNumber += 'h';
        
        element.textContent = displayNumber;
    }, 30);
}
// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.querySelector('.nav-overlay');

    if (!hamburger || !navMenu) {
        console.log('Elements hamburger ou nav-menu non trouvés');
        return;
    }

    // Fonction pour fermer le menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'visible';
    }

    // Fonction pour ouvrir le menu
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) {
            navOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    // Toggle menu mobile
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fermer le menu quand on clique sur l'overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});

// Smooth scrolling pour les liens de navigation (pour la page d'accueil)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight du lien actif dans la navigation
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animation des cartes produits au scroll
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

    // Observer toutes les cartes produits
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Fonction pour commander via WhatsApp
function orderWhatsApp(productName, price) {
    const message = `Bonjour, je suis intéressé(e) par ${productName} au prix de ${price}. Pouvez-vous me donner plus d'informations ?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    // Analytics (optionnel) - pour suivre les clics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_order', {
            'product_name': productName,
            'product_price': price
        });
    }
    
    console.log(`Commande WhatsApp pour: ${productName} - ${price}`);
}

// Fonction pour le contact WhatsApp général
function contactWhatsApp() {
    const message = `Bonjour ! 👋

Je visite votre site BkShoes et j'aimerais avoir plus d'informations sur vos produits.

Pouvez-vous m'aider ?

Merci ! 😊`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// Effet de parallaxe léger pour le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && scrolled < hero.offsetHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Animation du bouton CTA
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
});

// Gestion des erreurs d'images (si vous ajoutez de vraies images plus tard)
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Remplacer par une image placeholder si l'image ne charge pas
            this.style.display = 'none';
            
            // Créer un placeholder de remplacement
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-image';
            placeholder.innerHTML = '<i class="fas fa-shoe-prints"></i><p>Image non disponible</p>';
            
            this.parentNode.insertBefore(placeholder, this);
        });
    });
});

// Fonction pour filtrer les produits (pour une future fonctionnalité)
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            product.style.display = 'none';
        }
    });
}

// Fonction pour rechercher des produits (pour une future fonctionnalité)
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchQuery = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.dataset.name.toLowerCase();
        const productCategory = product.dataset.category.toLowerCase();
        
        if (productName.includes(searchQuery) || productCategory.includes(searchQuery)) {
            product.style.display = 'block';
            product.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            product.style.display = 'none';
        }
    });
}

// Gestion du scroll pour masquer/afficher le header
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.header');
    
    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Scroll vers le bas - masquer le header
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scroll vers le haut - afficher le header
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Ajouter une transition au header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    if (header) {
        header.style.transition = 'transform 0.3s ease-in-out';
    }
});

// Fonction pour copier le numéro WhatsApp
function copyWhatsAppNumber() {
    const phoneNumber = WHATSAPP_NUMBER;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber).then(function() {
            showNotification('Numéro copié !', 'success');
        });
    } else {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = phoneNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Numéro copié !', 'success');
    }
}

// Fonction pour afficher des notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#25d366' : '#ff6b9d'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialisation des tooltips (pour une future fonctionnalité)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9rem;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
            
            this.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        document.body.removeChild(tooltip);
                    }
                }, 300);
            }, { once: true });
        });
    });
}

// Initialiser les tooltips au chargement de la page
document.addEventListener('DOMContentLoaded', initTooltips);

// Normaliser les liens internes pour forcer l'extension .html
document.addEventListener('DOMContentLoaded', function() {
    try {
        const pages = new Set(['index','mocassins','ballerines','mules','sandales','baskets','bottes']);
        const links = document.querySelectorAll('a[href]');

        links.forEach(a => {
            const raw = (a.getAttribute('href') || '').trim();
            if (!raw) return;

            // Ignorer anchors, chemins absolus ou protocoles spéciaux
            if (/^(https?:|mailto:|tel:|javascript:|#|\/)/i.test(raw)) return;

            // Déjà une page .html (avec ou sans query/hash)
            if (/\.html($|[?#])/i.test(raw)) return;

            // Correspond aux pages internes connues sans extension
            const match = raw.match(/^([a-z0-9-_]+)([?#].*)?$/i);
            if (!match) return;

            const base = match[1].toLowerCase();
            const suffix = match[2] || '';
            if (pages.has(base)) {
                a.setAttribute('href', `${base}.html${suffix}`);
            }
        });
    } catch (e) {
        console.warn('Normalisation des liens échouée:', e);
    }
});

// ===== SYNCHRONISATION AVEC L'ADMINISTRATION =====

// Fonction pour charger les produits depuis l'administration
function loadProductsFromAdmin() {
    const adminProducts = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    
    console.log('📦 Chargement des produits...', adminProducts.length, 'produits trouvés');
    
    // Organiser les produits par catégorie
    const productsByCategory = {
        mocassins: adminProducts.filter(p => p.category === 'mocassins' && p.status === 'active'),
        ballerines: adminProducts.filter(p => p.category === 'ballerines' && p.status === 'active'),
        mules: adminProducts.filter(p => p.category === 'mules' && p.status === 'active'),
        sandales: adminProducts.filter(p => p.category === 'sandales' && p.status === 'active'),
        baskets: adminProducts.filter(p => p.category === 'baskets' && p.status === 'active'),
        bottes: adminProducts.filter(p => p.category === 'bottes' && p.status === 'active')
    };
    
    // Debug des catégories
    Object.keys(productsByCategory).forEach(category => {
        console.log(`${category}: ${productsByCategory[category].length} produits actifs`);
    });
    
    // Mettre à jour chaque section (page d'accueil ET pages de catégories)
    Object.keys(productsByCategory).forEach(category => {
        updateCategorySection(category, productsByCategory[category]);
        updateCategoryPage(category, productsByCategory[category]);
    });
    
    console.log('🔄 Produits synchronisés depuis l\'administration');
}

// Fonction pour mettre à jour une section de catégorie
function updateCategorySection(category, products) {
    const section = document.getElementById(category);
    if (!section) return;
    
    const productsGrid = section.querySelector('.products-grid');
    const comingSoon = section.querySelector('.coming-soon');
    
    if (products.length > 0) {
        // Il y a des produits actifs, masquer "Coming Soon" et afficher les produits
        if (comingSoon) {
            comingSoon.style.display = 'none';
        }
        
        if (!productsGrid) {
            // Créer la grille de produits si elle n'existe pas
            const container = section.querySelector('.container');
            const subtitle = container.querySelector('.section-subtitle');
            const newGrid = document.createElement('div');
            newGrid.className = 'products-grid';
            
            // Insérer après le subtitle
            if (subtitle && subtitle.nextSibling) {
                container.insertBefore(newGrid, subtitle.nextSibling);
            } else {
                container.appendChild(newGrid);
            }
            
            console.log(`✅ Grille de produits créée pour la section ${category}`);
        }
        
        const grid = section.querySelector('.products-grid');
        grid.style.display = 'grid';
        grid.innerHTML = '';
        
        // Ajouter chaque produit
        products.forEach(product => {
            const productCard = createProductCard(product);
            grid.appendChild(productCard);
        });
        
        // Réappliquer les animations aux nouvelles cartes
        const newCards = grid.querySelectorAll('.product-card');
        newCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Observer la nouvelle carte
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            
            observer.observe(card);
        });
        
    } else {
        // Pas de produits actifs, afficher "Coming Soon"
        if (productsGrid) {
            productsGrid.style.display = 'none';
        }
        if (comingSoon) {
            comingSoon.style.display = 'flex';
        }
    }
}

// Fonction pour mettre à jour les pages de catégories spécifiques
function updateCategoryPage(category, products) {
    // Cette fonction fonctionne sur les pages individuelles de catégories
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return; // Pas sur une page de catégorie

    // Ne mettre à jour que si la page actuelle correspond à la catégorie ciblée
    const path = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
    const currentCategory =
        path.includes('mocassins.html') ? 'mocassins' :
        path.includes('ballerines.html') ? 'ballerines' :
        path.includes('mules.html') ? 'mules' :
        path.includes('sandales.html') ? 'sandales' :
        path.includes('baskets.html') ? 'baskets' :
        path.includes('bottes.html') ? 'bottes' : '';

    if (currentCategory && currentCategory !== category) {
        return; // Cette mise à jour ne concerne pas la page courante
    }
    
    console.log(`🔄 Mise à jour de la page ${category} avec ${products.length} produits`);
    
    if (products.length > 0) {
        productsGrid.innerHTML = '';
        productsGrid.classList.remove('empty-state');
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        // Réappliquer les animations
        const newCards = productsGrid.querySelectorAll('.product-card');
        newCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        console.log(`✅ ${products.length} produits ajoutés à la page ${category}`);
    } else {
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
        console.log(`ℹ️ Aucun produit actif pour la catégorie ${category}`);
    }
}

// Fonction pour créer une carte produit
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-name', product.name);
    card.setAttribute('data-price', `${product.price} DH`);
    
    // Vérifier si c'est un produit avec page dédiée (sandales ou bottes)
    const hasDetailPage = (product.category === 'sandales' && product.name.toLowerCase().includes('élégantes beige')) ||
                         (product.category === 'bottes' && product.name.toLowerCase().includes('cuir marron'));
    
    if (hasDetailPage) {
        card.style.cursor = 'pointer';
        const detailPageUrl = product.category === 'sandales' ? 
            'produit-sandales-elegantes-beige.html' : 
            'produit-bottines-cuir-marron.html';
        card.onclick = () => window.location.href = detailPageUrl;
    }
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image ? 
                `<img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="placeholder-image" style="display: none;">
                    <i class="fas fa-shoe-prints"></i>
                    <p>${getShortName(product.name)}</p>
                </div>` :
                `<div class="placeholder-image">
                    <i class="fas fa-shoe-prints"></i>
                    <p>${getShortName(product.name)}</p>
                </div>`
            }
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">${product.price} DH</p>
            <button class="order-btn" onclick="${hasDetailPage ? 'event.stopPropagation(); ' : ''}selectProductAndSize(this)">
                <i class="fab fa-whatsapp"></i> Commander
            </button>
        </div>
    `;
    
    return card;
}

// Fonction pour obtenir un nom court pour le placeholder
function getShortName(fullName) {
    const words = fullName.split(' ');
    if (words.length <= 2) return fullName;
    return words.slice(0, 2).join(' ');
}

// Fonction pour vérifier les mises à jour des produits
function checkForProductUpdates() {
    const lastUpdate = localStorage.getItem('bkshoes_last_update');
    const currentTimestamp = localStorage.getItem('bkshoes_products_timestamp');
    
    if (lastUpdate !== currentTimestamp && currentTimestamp) {
        console.log('🔄 Mise à jour détectée, rechargement des produits...');
        loadProductsFromAdmin();
        localStorage.setItem('bkshoes_last_update', currentTimestamp);
    }
}

// Fonction pour forcer la synchronisation
function forceSyncProducts() {
    console.log('🔄 Synchronisation forcée des produits...');
    
    // Forcer le rechargement complet
    localStorage.removeItem('bkshoes_last_update');
    
    loadProductsFromAdmin();
    const timestamp = localStorage.getItem('bkshoes_products_timestamp') || Date.now();
    localStorage.setItem('bkshoes_last_update', timestamp);
    
    // Vérification spéciale pour les Ballerines
    const adminProducts = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    const ballerinesActives = adminProducts.filter(p => p.category === 'ballerines' && p.status === 'active');
    
    if (ballerinesActives.length > 0) {
        console.log('🩰 Ballerines actives détectées:', ballerinesActives);
        // Forcer la mise à jour de la section Ballerines
        setTimeout(() => {
            updateCategorySection('ballerines', ballerinesActives);
        }, 100);
    }
    
    alert('Synchronisation forcée terminée ! Vérifiez la console pour plus de détails.');
}

// Fonction de debug pour diagnostiquer les problèmes
function debugProducts() {
    const adminProducts = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    const lastUpdate = localStorage.getItem('bkshoes_last_update');
    const timestamp = localStorage.getItem('bkshoes_products_timestamp');
    
    console.log('=== DEBUG PRODUITS ===');
    console.log('Nombre de produits dans l\'admin:', adminProducts.length);
    console.log('Produits:', adminProducts);
    console.log('Dernière mise à jour:', lastUpdate);
    console.log('Timestamp actuel:', timestamp);
    
    // Compter les produits par catégorie et statut
    const stats = {};
    adminProducts.forEach(product => {
        const key = `${product.category}_${product.status}`;
        stats[key] = (stats[key] || 0) + 1;
    });
    
    console.log('Statistiques par catégorie/statut:', stats);
    
    // Debug spécifique pour chaque catégorie
    const categories = ['mocassins', 'ballerines', 'mules', 'sandales', 'bottes'];
    categories.forEach(category => {
        const activeProducts = adminProducts.filter(p => p.category === category && p.status === 'active');
        const section = document.getElementById(category);
        const hasGrid = section ? section.querySelector('.products-grid') : null;
        const hasComingSoon = section ? section.querySelector('.coming-soon') : null;
        
        console.log(`${category.toUpperCase()}:`, {
            produits_actifs: activeProducts.length,
            section_existe: !!section,
            grille_existe: !!hasGrid,
            coming_soon_visible: hasComingSoon ? hasComingSoon.style.display !== 'none' : false,
            produits: activeProducts.map(p => p.name)
        });
    });
    
    // Afficher dans une alerte aussi
    const ballerinesActives = adminProducts.filter(p => p.category === 'ballerines' && p.status === 'active').length;
    alert(`DEBUG PRODUITS:
    
Nombre total: ${adminProducts.length}
Produits actifs: ${adminProducts.filter(p => p.status === 'active').length}
Mocassins actifs: ${adminProducts.filter(p => p.category === 'mocassins' && p.status === 'active').length}
Ballerines actives: ${ballerinesActives}

${ballerinesActives > 0 ? '⚠️ Vous avez des ballerines actives qui devraient s\'afficher !' : 'ℹ️ Aucune ballerine active trouvée.'}

Vérifiez la console (F12) pour plus de détails.`);
}

// Fonction spéciale pour tester les Ballerines
function testBallerines() {
    console.log('🩰 === TEST BALLERINES ===');
    
    const adminProducts = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
    const ballerinesActives = adminProducts.filter(p => p.category === 'ballerines' && p.status === 'active');
    
    console.log('Ballerines dans l\'admin:', ballerinesActives);
    
    const ballerinesSection = document.getElementById('ballerines');
    if (!ballerinesSection) {
        alert('❌ Section Ballerines introuvable dans le HTML !');
        return;
    }
    
    console.log('Section Ballerines trouvée:', ballerinesSection);
    
    if (ballerinesActives.length > 0) {
        console.log('🔄 Forçage de l\'affichage des Ballerines...');
        updateCategorySection('ballerines', ballerinesActives);
        
        setTimeout(() => {
            const grid = ballerinesSection.querySelector('.products-grid');
            const comingSoon = ballerinesSection.querySelector('.coming-soon');
            
            alert(`🩰 TEST BALLERINES:
            
Produits actifs: ${ballerinesActives.length}
Grille créée: ${grid ? 'OUI' : 'NON'}
Coming Soon masqué: ${comingSoon && comingSoon.style.display === 'none' ? 'OUI' : 'NON'}
Cartes dans la grille: ${grid ? grid.children.length : 0}

${ballerinesActives.length > 0 && grid && grid.children.length > 0 ? '✅ Les Ballerines devraient maintenant être visibles !' : '❌ Problème détecté - vérifiez la console'}`);
        }, 500);
    } else {
        alert('ℹ️ Aucune ballerine active trouvée dans l\'admin. Vérifiez que le statut est "Actif".');
    }
}

// Initialisation de la synchronisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation BkShoes...');
    
    // Charger les produits au démarrage avec plusieurs tentatives
    setTimeout(loadProductsFromAdmin, 100);
    setTimeout(loadProductsFromAdmin, 500);
    setTimeout(loadProductsFromAdmin, 1000);
    
    // Vérifier les mises à jour toutes les 3 secondes
    setInterval(checkForProductUpdates, 3000);
    
    // Initialiser la sélection de pointure
    initializeSizeSelection();
    
    // Debug automatique au chargement
    setTimeout(() => {
        const products = JSON.parse(localStorage.getItem('bkshoes_products')) || [];
        console.log(`📊 Produits trouvés: ${products.length}`);
        if (products.length === 0) {
            console.warn('⚠️ Aucun produit trouvé! Vérifiez l\'administration.');
        }
    }, 1500);
    
    console.log('🔄 Synchronisation avec l\'administration activée');
    console.log('🛒 Système de sélection de pointure initialisé');
});

function initializeSizeSelection() {
    console.log('🔍 Initialisation de la sélection de pointure...');
    
    // Ajouter les événements de clic sur tous les boutons de pointure
    const sizeButtons = document.querySelectorAll('.size-btn');
    console.log(`📊 Trouvé ${sizeButtons.length} boutons de pointure`);
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('👆 Clic sur pointure:', this.dataset.size);
            
            const productCard = this.closest('.product-card');
            const cardSizeButtons = productCard.querySelectorAll('.size-btn');
            const orderBtn = productCard.querySelector('.order-btn');
            
            if (!productCard || !orderBtn) {
                console.error('❌ Éléments manquants dans la carte produit');
                return;
            }
            
            // Retirer la sélection précédente
            cardSizeButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Ajouter la sélection actuelle
            this.classList.add('selected');
            
            // Activer le bouton de commande
            orderBtn.disabled = false;
            orderBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander cette pointure';
            orderBtn.classList.add('enabled');
            
            console.log('✅ Pointure sélectionnée:', this.dataset.size);
        });
    });
    
    // Initialiser aussi les boutons de commande
    const orderButtons = document.querySelectorAll('.order-btn');
    console.log(`🛒 Trouvé ${orderButtons.length} boutons de commande`);
}

function selectProductAndSize(button) {
    const productCard = button.closest('.product-card');
    const selectedSizeBtn = productCard.querySelector('.size-btn.selected');
    
    if (!selectedSizeBtn) {
        alert('Veuillez sélectionner une pointure avant de continuer.');
        return;
    }
    
    // Récupérer les informations du produit
    const productData = {
        name: productCard.dataset.name || productCard.querySelector('h3').textContent,
        price: productCard.dataset.price || productCard.querySelector('.price').textContent,
        size: selectedSizeBtn.dataset.size,
        category: productCard.dataset.category || 'Chaussures',
        image: productCard.dataset.image || productCard.querySelector('.product-img')?.src,
        description: productCard.querySelector('.product-description')?.textContent || 'Chaussures en cuir véritable'
    };
    
    // Stocker les données dans localStorage
    localStorage.setItem('selectedProductName', productData.name);
    localStorage.setItem('selectedProductPrice', productData.price);
    localStorage.setItem('selectedProductSize', productData.size);
    localStorage.setItem('selectedProductCategory', productData.category);
    localStorage.setItem('selectedProductImage', productData.image);
    localStorage.setItem('selectedProductDescription', productData.description);
    
    // Rediriger vers la page de confirmation
    window.location.href = 'confirmation-commande.html';
}

// Fonction pour la compatibilité avec l'ancien système
function orderWhatsApp(productName, price, size = null) {
    if (size) {
        // Si une pointure est spécifiée, utiliser directement WhatsApp
        const message = `🛍️ *Nouvelle Commande BkShoes*\n\n👠 *Produit:* ${productName}\n💰 *Prix:* ${price}\n👟 *Pointure:* ${size}\n\n✨ Merci de me confirmer la disponibilité et les détails de livraison.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    } else {
        // Sinon, rediriger vers la sélection de pointure
        alert('Veuillez sélectionner une pointure avant de commander.');
    }
}

console.log('🦶 BkShoes - Site chargé avec succès !');
console.log('📱 WhatsApp configuré pour:', WHATSAPP_NUMBER);
console.log('🛒 Système de sélection de pointure activé !');
