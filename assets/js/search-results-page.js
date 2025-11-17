/**
 * Full Search Results Page
 */

class SearchResultsPage {
    constructor() {
        this.displayQuery = document.getElementById('displayQuery');
        this.searchCount = document.getElementById('searchCount');
        this.fullSearchResults = document.getElementById('fullSearchResults');
        this.noResults = document.getElementById('noResults');
        this.searchInput = document.getElementById('globalSearch');

        this.searchIndex = [];
        this.currentQuery = '';

        this.init();
    }

    async init() {
        // Search-Index laden
        try {
            const response = await fetch('/assets/data/search-index.json');
            this.searchIndex = await response.json();
        } catch (error) {
            console.error('Fehler beim Laden des Search-Index:', error);
            return;
        }

        // Query aus URL lesen
        const urlParams = new URLSearchParams(window.location.search);
        this.currentQuery = urlParams.get('q') || '';

        if (this.currentQuery) {
            this.displayQuery.textContent = this.currentQuery;
            this.searchInput.value = this.currentQuery;
            this.performSearch();
        } else {
            this.noResults.removeAttribute('hidden');
        }
    }

    performSearch() {

        console.log('🔍 Suche nach:', this.currentQuery);
        console.log('📊 Search-Index hat', this.searchIndex.length, 'Einträge');

        const results = this.search(this.currentQuery);

        console.log('✅ Gefundene Ergebnisse:', results.length);
        console.log('📝 Ergebnisse:', results);

        if (results.length === 0) {
            console.log('❌ Keine Ergebnisse - zeige "Keine Ergebnisse"');
            this.fullSearchResults.style.display = 'none';
            this.noResults.removeAttribute('hidden');
            this.searchCount.textContent = 'Keine Ergebnisse gefunden';
            return;
        }

        // Ergebnisse anzeigen
        this.searchCount.textContent = `${results.length} ${results.length === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden`;
        this.displayResults(results);
    }

    search(query) {
        // Gleiche Suchlogik wie in search.js
        const normalizedQuery = query.toLowerCase().trim();
        const words = normalizedQuery.split(/\s+/);

        return this.searchIndex
            .map(item => {
                let score = 0;
                const searchText = item.searchableText;

                if (item.title.toLowerCase() === normalizedQuery) {
                    score += 100;
                }

                if (item.title.toLowerCase().includes(normalizedQuery)) {
                    score += 50;
                }

                const allWordsMatch = words.every(word => searchText.includes(word));
                if (!allWordsMatch) {
                    return null;
                }

                words.forEach(word => {
                    if (searchText.includes(word)) {
                        score += 10;
                    }

                    if (searchText.includes(' ' + word) || searchText.startsWith(word)) {
                        score += 5;
                    }
                });

                if (item.type === 'tutorial') {
                    score += 2;
                }

                return { ...item, score };
            })
            .filter(item => item !== null && item.score > 0)
            .sort((a, b) => b.score - a.score);
    }

    displayResults(results) {
        this.fullSearchResults.innerHTML = '';

        results.forEach(item => {
            const card = this.createResultCard(item);
            this.fullSearchResults.appendChild(card);
        });
    }

    createResultCard(item) {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'search-result-card';

        const highlightedTitle = this.highlightText(item.title, this.currentQuery);
        const highlightedExcerpt = this.highlightText(item.excerpt, this.currentQuery);

        a.innerHTML = `
            <div class="search-result-category">${this.escapeHtml(item.category)}</div>
            <h2 class="search-result-title">${highlightedTitle}</h2>
            <p class="search-result-excerpt">${highlightedExcerpt}</p>
        `;

        return a;
    }

    highlightText(text, query) {
        const escapedText = this.escapeHtml(text);
        const words = query.split(/\s+/);
        let result = escapedText;

        words.forEach(word => {
            const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });

        return result;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialisieren
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SearchResultsPage();
    });
} else {
    new SearchResultsPage();
}