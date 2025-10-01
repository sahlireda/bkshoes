// Script de test ultra-simple pour le hamburger
console.log('🍔 Script de test hamburger chargé');

// Test immédiat
setTimeout(function() {
    console.log('🔍 Test des éléments...');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        console.log('✅ Hamburger trouvé:', hamburger);
        console.log('📏 Taille hamburger:', hamburger.offsetWidth, 'x', hamburger.offsetHeight);
        console.log('👁️ Visible:', window.getComputedStyle(hamburger).display);
        
        // Test de clic simple
        hamburger.onclick = function() {
            console.log('🎯 CLIC DÉTECTÉ SUR HAMBURGER !');
            alert('Hamburger cliqué !');
            
            if (navMenu) {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                console.log('🔄 Classes toggles appliquées');
            }
        };
        
        // Test tactile
        hamburger.ontouchstart = function() {
            console.log('👆 TOUCH START détecté');
        };
        
        hamburger.ontouchend = function() {
            console.log('👆 TOUCH END détecté');
        };
        
    } else {
        console.error('❌ Hamburger non trouvé !');
    }
    
    if (navMenu) {
        console.log('✅ Nav menu trouvé:', navMenu);
    } else {
        console.error('❌ Nav menu non trouvé !');
    }
    
}, 1000);

// Test au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, test hamburger...');
    
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        console.log('✅ Hamburger disponible au DOM ready');
        
        // Style de debug
        hamburger.style.border = '2px solid red';
        hamburger.style.backgroundColor = 'rgba(255,0,0,0.1)';
        
        setTimeout(function() {
            hamburger.style.border = '';
            hamburger.style.backgroundColor = '';
        }, 3000);
    }
});
