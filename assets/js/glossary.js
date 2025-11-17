// ======================
// GLOSSAR - LOCAL SEARCH & FILTER
// ======================

// Wrapper-Funktion um Konflikte mit anderen Scripts zu vermeiden
(function() {
    'use strict';
    
    // Elemente mit eindeutigen Namen
    const glossarySearchInput = document.getElementById('searchInput');
    const glossaryFilterButtons = document.querySelectorAll('.filter-btn');
    const glossaryTermCards = document.querySelectorAll('.term-card');
    const glossaryResultsCount = document.getElementById('resultsCount');
    const glossaryEmptyState = document.getElementById('emptyState');
    const glossaryAlphabetButtons = document.getElementById('alphabetButtons');

    let glossaryCurrentFilter = 'all';
    let glossaryCurrentSearch = '';
    let glossaryCurrentLetter = null;

    // Nur initialisieren, wenn wir auf der Glossar-Seite sind
    if (!glossarySearchInput || !glossaryAlphabetButtons) {
        console.log('Glossar-Elemente nicht gefunden - überspringe Glossar-Initialisierung');
        return;
    }

    console.log('✅ Glossar-Suche wird initialisiert...');

    // Alphabet-Buttons erstellen (MIT SONDERZEICHEN-BUTTON)
    function createAlphabetButtons() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const availableLetters = new Set();
        let hasSpecialChars = false;

        // Welche Buchstaben gibt es?
        glossaryTermCards.forEach(card => {
            const title = card.querySelector('.term-title').textContent;
            const firstChar = title.charAt(0).toUpperCase();
            
            // Prüfen ob Buchstabe oder Sonderzeichen
            if (/[A-Z]/.test(firstChar)) {
                availableLetters.add(firstChar);
            } else {
                hasSpecialChars = true; // Sonderzeichen gefunden
            }
        });

        // Buttons für A-Z erstellen
        alphabet.forEach(letter => {
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = letter;
            btn.dataset.letter = letter;

            if (availableLetters.has(letter)) {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
                    
                    if (glossaryCurrentLetter === letter) {
                        glossaryCurrentLetter = null;
                    } else {
                        glossaryCurrentLetter = letter;
                        btn.classList.add('active');
                    }
                    
                    filterTerms();
                });
            } else {
                btn.classList.add('disabled');
                btn.disabled = true;
            }

            glossaryAlphabetButtons.appendChild(btn);
        });

        // SONDERZEICHEN-BUTTON am Ende hinzufügen
        if (hasSpecialChars) {
            const specialBtn = document.createElement('button');
            specialBtn.className = 'letter-btn special-char-btn';
            specialBtn.textContent = '#';
            specialBtn.dataset.letter = 'special';
            specialBtn.title = 'Sonderzeichen (@, #, etc.)';

            specialBtn.addEventListener('click', () => {
                document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
                
                if (glossaryCurrentLetter === 'special') {
                    glossaryCurrentLetter = null;
                } else {
                    glossaryCurrentLetter = 'special';
                    specialBtn.classList.add('active');
                }
                
                filterTerms();
            });

            glossaryAlphabetButtons.appendChild(specialBtn);
        }
    }

    // Filter-Buttons
    glossaryFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            glossaryFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            glossaryCurrentFilter = btn.dataset.filter;
            filterTerms();
        });
    });

    // Suche mit Clear-Button
    glossarySearchInput.addEventListener('input', (e) => {
        glossaryCurrentSearch = e.target.value.toLowerCase();
        
        // Clear-Button anzeigen/verstecken
        toggleClearButton();
        
        // Alphabet-Filter zurücksetzen bei Suche
        if (glossaryCurrentSearch) {
            glossaryCurrentLetter = null;
            document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
        }
        
        filterTerms();
    });

    // Clear-Button erstellen und verwalten
    function toggleClearButton() {
        let clearBtn = document.getElementById('glossarySearchClearBtn');
        
        if (glossaryCurrentSearch && !clearBtn) {
            // Clear-Button erstellen
            clearBtn = document.createElement('button');
            clearBtn.id = 'glossarySearchClearBtn';
            clearBtn.className = 'search-clear-btn';
            clearBtn.innerHTML = '×';
            clearBtn.title = 'Suche löschen';
            clearBtn.addEventListener('click', () => {
                glossarySearchInput.value = '';
                glossaryCurrentSearch = '';
                toggleClearButton();
                filterTerms();
                glossarySearchInput.focus();
            });
            glossarySearchInput.parentElement.appendChild(clearBtn);
        } else if (!glossaryCurrentSearch && clearBtn) {
            // Clear-Button entfernen
            clearBtn.remove();
        }
    }

    // Filter-Funktion (MIT SONDERZEICHEN-SORTIERUNG)
    function filterTerms() {
        let visibleCount = 0;
        const visibleCards = [];

        glossaryTermCards.forEach(card => {
            const category = card.dataset.category;
            const terms = card.dataset.terms.toLowerCase();
            const title = card.querySelector('.term-title').textContent;
            const titleLower = title.toLowerCase();
            const firstChar = title.charAt(0).toUpperCase();
            
            // Prüfen ob Buchstabe oder Sonderzeichen
            const isLetter = /[A-Z]/.test(firstChar);

            // Kategorie-Filter
            const matchesCategory = glossaryCurrentFilter === 'all' || category === glossaryCurrentFilter;

            // Such-Filter
            const matchesSearch = glossaryCurrentSearch === '' || 
                                 terms.includes(glossaryCurrentSearch) || 
                                 titleLower.includes(glossaryCurrentSearch);

            // Alphabet-Filter (MIT SONDERZEICHEN)
            let matchesLetter = glossaryCurrentLetter === null;
            if (glossaryCurrentLetter === 'special') {
                matchesLetter = !isLetter; // Zeige nur Sonderzeichen
            } else if (glossaryCurrentLetter !== null) {
                matchesLetter = firstChar === glossaryCurrentLetter; // Normaler Buchstabe
            }

            // Anzeigen oder verstecken
            if (matchesCategory && matchesSearch && matchesLetter) {
                card.classList.remove('hidden');
                visibleCards.push({ card, title, firstChar, isLetter });
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // SORTIERUNG: Buchstaben A-Z, dann Sonderzeichen
        visibleCards.sort((a, b) => {
            // Wenn beide Buchstaben oder beide Sonderzeichen: alphabetisch
            if (a.isLetter === b.isLetter) {
                return a.title.localeCompare(b.title, 'de');
            }
            // Buchstaben vor Sonderzeichen
            return a.isLetter ? -1 : 1;
        });

        // Sortierte Reihenfolge im DOM anwenden
        const glossaryGrid = document.getElementById('glossaryGrid');
        visibleCards.forEach(({ card }) => {
            glossaryGrid.appendChild(card);
        });

        // Ergebnis-Anzahl aktualisieren (mit Null-Check)
        if (glossaryResultsCount) {
            glossaryResultsCount.textContent = visibleCount;
        }

        // Empty State anzeigen/verstecken
        if (glossaryEmptyState) {
            if (visibleCount === 0) {
                glossaryEmptyState.classList.remove('hidden');
            } else {
                glossaryEmptyState.classList.add('hidden');
            }
        }
    }

    // Initialisierung
    createAlphabetButtons();
    
    if (glossaryResultsCount) {
        glossaryResultsCount.textContent = glossaryTermCards.length;
    }
    
    filterTerms();
    
    console.log(`✅ Glossar initialisiert: ${glossaryTermCards.length} Begriffe gefunden`);

})(); // IIFE Ende