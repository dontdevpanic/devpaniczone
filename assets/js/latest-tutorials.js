/**
 * Latest Tutorials Loader
 * =======================
 * Lädt die Tutorial-Metadaten aus /assets/data/tutorials.json
 * und rendert die Latest Tutorials Cards
 * 
 * Verwendung:
 * 1. Auf der Startseite: Zeigt die 4 neuesten Tutorials
 * 2. Auf Kategorieseiten: Zeigt alle Tutorials der Kategorie
 */

(function() {
    'use strict';

    // ============================================
    // KONFIGURATION
    // ============================================
    const JSON_PATH = '/assets/data/tutorials.json';
    
    // ============================================
    // CARD TEMPLATE
    // ============================================
    function createTutorialCard(tutorial) {
        const card = document.createElement('article');
        card.className = 'tutorial-card';
        
        card.innerHTML = `
        <a href="${tutorial.url}">
            <span class="card-badge ${tutorial.badgeClass}">${tutorial.categoryDisplay}</span>
            <h3 class="card-title">${tutorial.title}</h3>
            <p class="card-description">${tutorial.excerpt || 'Tutorial entdecken...'}</p>
            <span class="card-link">Tutorial lesen →</span>
        </a>
    `;

        
        return card;
    }

    // ============================================
    // LATEST TUTORIALS (Startseite)
    // ============================================
    function renderLatestTutorials(container, tutorials) {
        container.innerHTML = '';
        
        tutorials.forEach(tutorial => {
            container.appendChild(createTutorialCard(tutorial));
        });
    }

    // ============================================
    // CATEGORY TUTORIALS (Kategorieseiten)
    // ============================================
    function renderCategoryTutorials(container, tutorials, category) {
        container.innerHTML = '';
        
        // Filtere nach Kategorie
        const categoryTutorials = tutorials.filter(t => t.category === category);
        
        // Nimm die neuesten 4 (oder weniger)
        const latestInCategory = categoryTutorials.slice(-4).reverse();
        
        latestInCategory.forEach(tutorial => {
            container.appendChild(createTutorialCard(tutorial));
        });
    }

    // ============================================
    // INIT
    // ============================================
    async function init() {
        // Suche nach Containern
        const latestContainer = document.getElementById('latestTutorials');
        const categoryContainer = document.getElementById('categoryLatestTutorials');
        
        if (!latestContainer && !categoryContainer) {
            return; // Keine Container auf dieser Seite
        }

        try {
            const response = await fetch(JSON_PATH);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Startseite: Neueste Tutorials
            if (latestContainer) {
                renderLatestTutorials(latestContainer, data.latest);
            }
            
            // Kategorieseite: Tutorials dieser Kategorie
            if (categoryContainer) {
                const category = categoryContainer.dataset.category;
                if (category && data.byCategory[category]) {
                    // Nimm die letzten 4 aus dieser Kategorie
                    const latestInCategory = data.byCategory[category].slice(-4).reverse();
                    renderLatestTutorials(categoryContainer, latestInCategory);
                }
            }
            
        } catch (error) {
            console.warn('Latest Tutorials: JSON konnte nicht geladen werden', error);
            
            // Fallback-Nachricht
            if (latestContainer) {
                latestContainer.innerHTML = '<p class="text-muted">Tutorials werden geladen...</p>';
            }
            if (categoryContainer) {
                categoryContainer.innerHTML = '<p class="text-muted">Tutorials werden geladen...</p>';
            }
        }
    }

    // Start wenn DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();