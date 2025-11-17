/**
 * Global Search Functionality
 * Hybrid: Quick-Results Dropdown + Full Results Page
 */

class GlobalSearch {
    constructor() {
        this.searchInput = document.getElementById('globalSearch');
        this.searchResults = document.getElementById('searchResults');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.searchViewAll = document.getElementById('searchViewAll');
        
        this.searchIndex = [];
        this.currentQuery = '';
        this.maxQuickResults = 6;
        
        this.init();
    }
    
    async init() {
        // Search-Index laden
        try {
            const response = await fetch('/assets/data/search-index.json');
            this.searchIndex = await response.json();
            console.log(`✓ Search-Index geladen: ${this.searchIndex.length} Einträge`);
        } catch (error) {
            console.error('Fehler beim Laden des Search-Index:', error);
            return;
        }
        
        // Event Listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        this.searchInput.addEventListener('focus', () => this.handleFocus());
        this.searchInput.addEventListener('blur', (e) => this.handleBlur(e));
        
        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Click outside zum Schließen
        document.addEventListener('click', (e) => this.handleClickOutside(e));
        
        // "Alle Ergebnisse anzeigen" Button
        this.searchViewAll.addEventListener('click', () => this.viewAllResults());
    }
    
    handleSearch(e) {
        const query = e.target.value.trim();
        this.currentQuery = query;
        
        if (query.length < 2) {
            this.hideResults();
            return;
        }
        
        const results = this.search(query);
        this.displayQuickResults(results);
    }
    
    handleFocus() {
        if (this.currentQuery.length >= 2) {
            this.searchResults.removeAttribute('hidden');
        }
    }
    
    handleBlur(e) {
        // Verzögerung, damit Klicks auf Ergebnisse noch funktionieren
        setTimeout(() => {
            if (!this.searchResults.contains(document.activeElement)) {
                this.hideResults();
            }
        }, 200);
    }
    
    handleKeyboard(e) {
        // "/" aktiviert Suche
        if (e.key === '/' && document.activeElement !== this.searchInput) {
            e.preventDefault();
            this.searchInput.focus();
        }
        
        // ESC schließt Dropdown
        if (e.key === 'Escape') {
            this.hideResults();
            this.searchInput.blur();
        }
        
        // Enter auf Suchfeld = Alle Ergebnisse anzeigen
        if (e.key === 'Enter' && document.activeElement === this.searchInput) {
            if (this.currentQuery.length >= 2) {
                this.viewAllResults();
            }
        }
    }
    
    handleClickOutside(e) {
        if (!e.target.closest('.search-wrapper')) {
            this.hideResults();
        }
    }
    
    search(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const words = normalizedQuery.split(/\s+/);
        
        return this.searchIndex
            .map(item => {
                let score = 0;
                const searchText = item.searchableText;
                
                // Exakte Titel-Übereinstimmung = höchste Priorität
                if (item.title.toLowerCase() === normalizedQuery) {
                    score += 100;
                }
                
                // Titel enthält Query
                if (item.title.toLowerCase().includes(normalizedQuery)) {
                    score += 50;
                }
                
                // Alle Wörter müssen vorkommen
                const allWordsMatch = words.every(word => searchText.includes(word));
                if (!allWordsMatch) {
                    return null;
                }
                
                // Score für jedes gefundene Wort
                words.forEach(word => {
                    if (searchText.includes(word)) {
                        score += 10;
                    }
                    
                    // Bonus für Wortanfänge
                    if (searchText.includes(' ' + word) || searchText.startsWith(word)) {
                        score += 5;
                    }
                });
                
                // Bonus für Tutorials vs. Glossar (Tutorials bevorzugen)
                if (item.type === 'tutorial') {
                    score += 2;
                }
                
                return { ...item, score };
            })
            .filter(item => item !== null && item.score > 0)
            .sort((a, b) => b.score - a.score);
    }
    
    displayQuickResults(results) {
        this.searchResultsList.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResultsList.innerHTML = `
                <div class="search-no-results">
                    <p>Keine Ergebnisse für "${this.escapeHtml(this.currentQuery)}"</p>
                </div>
            `;
            this.searchResults.removeAttribute('hidden');
            return;
        }
        
        // Erste 6 Ergebnisse anzeigen
        const quickResults = results.slice(0, this.maxQuickResults);
        
        quickResults.forEach(item => {
            const resultElement = this.createResultElement(item);
            this.searchResultsList.appendChild(resultElement);
        });
        
        // "Alle anzeigen" Button aktualisieren
        if (results.length > this.maxQuickResults) {
            this.searchViewAll.textContent = `Alle ${results.length} Ergebnisse anzeigen →`;
        } else {
            this.searchViewAll.textContent = `Alle ${results.length} Ergebnisse`;
        }
        
        this.searchResults.removeAttribute('hidden');
    }
    
    createResultElement(item) {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'search-result-item';
        
        // Highlight Query in Titel
        const highlightedTitle = this.highlightText(item.title, this.currentQuery);
        
        a.innerHTML = `
            <div class="search-result-category">${this.escapeHtml(item.category)}</div>
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-excerpt">${this.escapeHtml(item.excerpt)}</div>
        `;
        
        return a;
    }
    
    highlightText(text, query) {
        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.escapeHtml(query);
        
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<mark>$1</mark>');
    }
    
    hideResults() {
        this.searchResults.setAttribute('hidden', '');
    }
    
    viewAllResults() {
        window.location.href = `/search.html?q=${encodeURIComponent(this.currentQuery)}`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialisieren wenn DOM geladen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GlobalSearch();
    });
} else {
    new GlobalSearch();
}