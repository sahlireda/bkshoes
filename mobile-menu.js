// Script dédié pour le menu hamburger mobile
console.log('Mobile menu script chargé');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation du menu mobile...');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.querySelector('.nav-overlay');

    console.log('Hamburger trouvé:', hamburger);
    console.log('Nav menu trouvé:', navMenu);
    console.log('Nav overlay trouvé:', navOverlay);

    if (!hamburger) {
        console.error('❌ Élément .hamburger non trouvé');
        return;
    }

    if (!navMenu) {
        console.error('❌ Élément .nav-menu non trouvé');
        return;
    }

    console.log('✅ Éléments trouvés, ajout des event listeners...');

    // Fonction pour fermer le menu
    function closeMenu() {
        console.log('Fermeture du menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.style.overflow = 'visible';
    }

    // Fonction pour ouvrir le menu
    function openMenu() {
        console.log('Ouverture du menu');
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        if (navOverlay) {
            navOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    // Event listener pour le hamburger
    hamburger.addEventListener('click', function(e) {
        console.log('Clic sur hamburger détecté');
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navMenu.classList.contains('active');
        console.log('Menu actuellement actif:', isActive);
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Event listener pour l'overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            console.log('Clic sur overlay détecté');
            closeMenu();
        });
    }

    // Event listeners pour les liens de navigation
    navLinks.forEach(function(link, index) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Fermeture avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            console.log('Touche Escape détectée');
            closeMenu();
        }
    });

    // ===== Labels-only navigation (no emojis on mobile or desktop) =====
    (function enforceLabelsOnlyMenu() {
        try {
            function stripLeadingEmoji(text) {
                if (!text) return '';
                // Remove known emojis used previously if present at start
                return text.replace(/^[🏠👞🩰👡🩴👟🥾📞]\s*/u, '').trim();
            }

            function cleanLink(a) {
                // If structure contains spans, prefer label span
                const labelSpan = a.querySelector('.label');
                if (labelSpan) {
                    a.textContent = (labelSpan.textContent || '').trim();
                } else {
                    // Remove any leading emoji from raw text
                    a.textContent = stripLeadingEmoji((a.textContent || '').trim());
                }
                // Remove any icon span if present
                const iconSpan = a.querySelector('.icon');
                if (iconSpan) iconSpan.remove();
                // Clear helper datasets from previous modes
                if (a.dataset) {
                    delete a.dataset.prepared;
                    delete a.dataset.originalLabel;
                }
            }

            function applyLabelsOnly() {
                document.querySelectorAll('.nav-menu .nav-link').forEach(cleanLink);
            }

            // Initialize and keep clean on changes
            applyLabelsOnly();
            window.addEventListener('resize', applyLabelsOnly);
            document.addEventListener('visibilitychange', applyLabelsOnly);
        } catch (err) {
            console.warn('Labels-only menu init error:', err);
        }
    })();

    console.log('✅ Menu mobile initialisé avec succès');
});
