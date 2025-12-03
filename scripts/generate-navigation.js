#!/usr/bin/env node

/**
 * DevPanicZone Navigation Generator v2.2
 * ======================================
 * 6. Root-Level Seiten (Header + Footer)
 * Erstellt automatisch:
 * 1. Main Navigation (Dropdown-Menü)
 * 2. Tutorial Navigation (Prev/Next)
 * 3. Sticky Sidebar (Inhaltsverzeichnis)
 * 4. Breadcrumbs
 * 5. Tutorial-Listen (Kategorieseiten)
 * 
 * NEU in v2.1:
 * - Automatische Aktualisierung von Root-Level HTML-Dateien
 * VERBESSERUNGEN in v2.1:
 * - Robuste HTML-Entity-Dekodierung
 * - Deterministische ID-Generierung
 * - Bestehende IDs werden IMMER respektiert
 * - Besseres Debug-Logging
 * - Duplikat-Vermeidung mit Counter
 * 
 * NEU in v2.2:
 * - Tutorial-Metadaten JSON für "Latest Tutorials" Section
 * - extractHeroExcerpt() für Excerpts aus Hero-Bereich
 */


const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// ============================================
// KONFIGURATION - Pfade zeigen vom scripts/ Ordner nach oben
// ============================================
const rootDir = path.join(__dirname, '..');

const tutorialsDir = path.join(__dirname, '..', 'tutorials');
const assetsDir = path.join(__dirname, '..', 'assets');

// Stelle sicher dass data Verzeichnis existiert
const dataDir = path.join(assetsDir, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}


const ROOT_FILES_EXCLUDE = [
    'search.html', // Wird automatisch generiert
];
// Root-Dateien die NICHT aktualisiert werden sollen
// Blacklist: Diese Ordner werden ignoriert
const BLACKLIST_FOLDERS = ['noupload', 'node_modules', '.git', 'assets', 'snippet-collection'];

// ============================================
// HEADER TEMPLATE
// ============================================

const HEADER_TEMPLATE = `<header class="site-header">
    <div class="container">
        <div class="header-content">
            <div class="brand">
                <a href="/" class="brand-link">
                    <img src="/assets/icons/logo.svg" alt="DevPanicZone Logo" class="logo-icon">
                    <span class="brand-name">DevPanicZone! Cheatsheets.</span>
                </a>
            </div>

            <button class="theme-toggle" id="themeToggle" aria-label="Dark Mode umschalten">
                <span class="theme-icon">
                    <img src="/assets/icons/dark-mode.svg" alt="Icon Dark Mode" width="20" height="20">
                </span>
            </button>

            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Menü öffnen">
                <span class="hamburger"></span>
            </button>

            <nav class="main-nav" id="mainNav" aria-label="Navigation">
                <ul class="nav-list">
                    <li><a href="/" class="nav-link">Home</a></li>
                    <li class="nav-item-dropdown">
                        <button class="nav-link dropdown-toggle" aria-expanded="false">
                            Tutorials
                            <span class="dropdown-icon">▾</span>
                        </button>
                        <ul class="dropdown-menu">
                            <!-- Main-Nav-Start -->
                            <!-- Main-Nav-End -->
                        </ul>
                    </li>
                    <li><a href="/glossary.html" class="nav-link">Glossar</a></li>
                    
                    <!-- Search Toggle -->
                    <li>
                        <button class="nav-link search-toggle" id="searchToggle" aria-label="Suche öffnen">
                            <svg class="search-icon-nav" viewBox="0 0 23.25 28.09" aria-hidden="true">
                                <path d="M23.25,11.62c0,2.56-.83,4.93-2.24,6.86l7.07,7.08c.7.7.7,1.83,0,2.53-.7.7-1.83.7-2.53,0l-7.07-7.08c-1.92,1.41-4.29,2.24-6.86,2.24C5.2,23.25,0,18.04,0,11.62S5.2,0,11.62,0s11.62,5.2,11.62,11.62ZM11.62,19.67c4.44,0,8.05-3.6,8.05-8.05S16.07,3.58,11.62,3.58,3.58,7.18,3.58,11.62s3.6,8.05,8.05,8.05Z"/>
                            </svg>
                        </button>
                    </li>
                </ul>
                
                <!-- Search Dropdown -->
                <div class="search-dropdown" id="searchDropdown" hidden>
                    <div class="search-input-group">
                        <svg class="search-icon" viewBox="0 0 23.25 28.09" aria-hidden="true">
                            <path d="M23.25,11.62c0,2.56-.83,4.93-2.24,6.86l7.07,7.08c.7.7.7,1.83,0,2.53-.7.7-1.83.7-2.53,0l-7.07-7.08c-1.92,1.41-4.29,2.24-6.86,2.24C5.2,23.25,0,18.04,0,11.62S5.2,0,11.62,0s11.62,5.2,11.62,11.62ZM11.62,19.67c4.44,0,8.05-3.6,8.05-8.05S16.07,3.58,11.62,3.58,3.58,7.18,3.58,11.62s3.6,8.05,8.05,8.05Z"/>
                        </svg>
                        <input 
                            type="search" 
                            id="globalSearch" 
                            class="search-input" 
                            placeholder="Tutorials durchsuchen..."
                            aria-label="Suche">
                        <kbd class="search-shortcut" aria-hidden="true">/</kbd>
                    </div>
                    
                    <div class="search-results" id="searchResults" hidden>
                        <div class="search-results-list" id="searchResultsList"></div>
                        <div class="search-results-footer">
                            <button class="search-view-all" id="searchViewAll">
                                Alle Ergebnisse anzeigen →
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</header>`;

// ============================================
// FOOTER TEMPLATE
// ============================================

const FOOTER_TEMPLATE = `<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <p class="footer-text">© <span id="currentYear">2025</span> DevPanicZone. Alle Rechte vorbehalten.</p>
            <nav class="footer-nav">
                <a href="/impressum.html">Impressum</a>
                <a href="/datenschutzerklaerung.html">Datenschutz</a>
            </nav>
        </div>
    </div>
</footer>`;

// ============================================
// KONFIGURATION
// ============================================

// Manuelle Reihenfolge der Tutorials pro Kategorie
const TUTORIAL_ORDER = {
    'tutorials/html/html-basics': [
        'html-basics.html',
        'html-grundgeruest.html',
        'html-typografie.html',
        'html-navigation.html',
        'html-listen.html',
        'html-links.html',
        'html-bilder.html',
        'html-tabellen.html',
        'html-meta-tags.html'
    ],
    'tutorials/html/html-advanced': [
        'html-semantik.html',
        'html-formulare.html',
        'html-audio-video.html'
    ],
    'tutorials/css/css-basics': [
        'css-einbinden.html',
        'css-color-units.html',
        'css-typografie.html',
        'css-mobile-first.html'
    ],
    'tutorials/css/css-advanced': [
        // Platzhalter
    ],
    'tutorials/css/css-specials': [
        'css-organization.html'
    ],
    'tutorials/bootstrap/bootstrap-basics': [
        // Platzhalter
    ],
    'tutorials/bootstrap/bootstrap-components': [
        // Platzhalter
    ],
    'tutorials/bootstrap/bootstrap-navigation': [
        // Platzhalter
    ],
    'tutorials/bootstrap/bootstrap-forms': [
        // Platzhalter
    ],
    'tutorials/bootstrap/bootstrap-interactive': [
        // Platzhalter
    ],
    'tutorials/bootstrap/bootstrap-extras': [
        // Platzhalter
    ],
    'tutorials/javascript/javascript-basics': [
        'js-basics.html',
        'js-security.html'
        // 'js-variables.html',
        // 'js-functions.html',
        // 'js-conditions.html',
        // 'js-loops.html',
        // 'js-arrays-objects.html',
        // 'js-events.html',
        // 'js-scroll-to-top.html'
    ],
    'tutorials/javascript/javascript-advanced': [
        // 'js-async-await.html',
        // 'js-dom.html',
        // 'js-fetch.html',
        // 'js-storage.html',
        // 'js-event-delegation.html'
    ],
    'tutorials/javascript/javascript-projects': [
        'js-code-escaper.html',
        'js-entity-encoder.html',
        'js-to-do-app.html'
        // 'js-modal.html'
    ],
    'tutorials/php/php-basics': [
        'php-basics.html',
        'php-security.html',
        //'php-variables.html',
        //'php-arrays-loops.html',
        //'php-includes.html',
        //'php-forms.html'
    ],
    'tutorials/php/php-advanced': [
        //'php-OOP.html',
        //'php-sessions.html',
        //'php-validation.html',
        //'php-mail.html',
        //'php-pdo.html'
    ],
    'tutorials/misc/seo-optimization': [
        // Platzhalter
    ],
    'tutorials/misc/tools': [
        'browser-dev-tools.html',
        'bash-terminal.html',
        'git-versionskontrolle.html',
        'github-remote.html',
        'ftp-client-filezilla.html',
        'globale-aenderungen-an-HTML-Dateien.html'
    ],
    'tutorials/misc/projects': [
        // 'assets-structure.html',
        // 'project-structure.html'
    ],
    'tutorials/misc/web': [
        'console-security.html'
    ],
    'tutorials/documentation/devpaniczone': [
        'devpaniczone-automation.html',
        'devpaniczone-code-snippets.html',
        'devpaniczone-generate-navigation-js.html',
        'devpaniczone-main-navigation.html',
        'devpaniczone-sidebars-system.html',
        'devpaniczone-breadcrumbs.html',
        'devpaniczone-prev-next.html',
        'devpaniczone-tutorial-buttons.html',
        'devpaniczone-toggle-night-mode.html',
        'devpaniczone-current-year-footer.html'
        // 'devpaniczone-tutorial-template.html',
        // 'header-test.html'
    ]
};

// ============================================
// LATEST TUTORIALS (manuell gepflegt für Startseite)
// ============================================
const LATEST_TUTORIALS = [
    'tutorials/css/css-specials/css-organization.html',
    'tutorials/javascript/javascript-basics/js-security.html',
    'tutorials/misc/web/console-security.html',
    'tutorials/php/php-basics/php-security.html'
];

// Custom Titles (überschreibt H1 aus HTML)
const CUSTOM_TITLES = {
    'html-basics.html': 'HTML Basics',
    'html-grundgeruest.html': 'HTML Grundgerüst',
    'html-meta-tags.html': 'HTML Meta-Tags',
    'html-typografie.html': 'HTML Typografie',
    'css-einbinden.html': 'CSS einbinden',
    'css-color-units.html': 'CSS Farben & Einheiten',
    'css-typografie.html': 'CSS Typografie',
    'js-code-escaper.html': 'JavaScript: HTML-Code Escaper',
    'devpaniczone-tutorial-template.html': 'Tutorial Template',
    'header-test.html': 'Header Test',
    'devpaniczone-automation.html': 'Automatisches Generieren der Navigationen',
    'devpaniczone-generate-navigation-js.html': 'Was macht generate-navigation.js',
    'devpaniczone-sidebars-system.html': 'Wie funktionieren die Sidebars?'
};

// Custom Titles für TOC (Sidebar Links) - überschreibt H2/H3 Text für Anzeige
const TOC_CUSTOM_TITLES = {
    'html-basics.html': {
        'html-cheat-sheet-die-top-15-tags': 'Top 15 Tags',
        'ungeordnete-listen-ul': 'Ungeordnete Listen &lt;ul&gt;',
        'geordnete-listen-ol': 'Geordnete Listen &lt;ol&gt;',
        'beschreibungslisten-dl': 'Beschreibungslisten &lt;dl&gt;',
    },
    'html-formulare.html': {
        // 'input-types': 'Input Types',
        // ...
    },
    'devpaniczone-generate-navigation-js.html': {
        'findhtmlfiles-html-dateien-finden': 'HTML-Dateien finden',
        'getcategoryfrompath-kategorie-ermitteln': 'Kategorie ermitteln',
        'getsubcategoryfrompath-unterkategorie-ermitteln': 'Unterkategorie ermitteln',
        'generatemainnavigation-dropdown-menue': 'Dropdown-Menü',
        'generatebreadcrumbs-navigationspfad': 'Navigationspfad',
        'generateprevnextnav-vorherigesnaechstes': 'Vorheriges/Nächstes',
        'addidstoheadingsandgeneratesidebar-sidebar-toc': 'Sidebar TOC',
    }
};

// Kategorie-Namen für Main-Navigation
const CATEGORY_NAMES = {
    'html': 'HTML',
    'css': 'CSS',
    'bootstrap': 'Bootstrap',
    'javascript': 'JavaScript',
    'php': 'PHP',
    'misc': 'Verschiedenes',
    'documentation': 'DevPanicZone!'
};

// Spezielle Kapitalisierung für Akronyme
const ACRONYMS = {
    'html': 'HTML',
    'css': 'CSS',
    'php': 'PHP',
    'js': 'JS',
    'javascript': 'JavaScript',
    'seo': 'SEO',
    'ftp': 'FTP',
    'devpaniczone': 'DevPanicZone'
};

// Kapitalisiert Wörter korrekt, berücksichtigt Akronyme
function capitalizeWithAcronyms(text) {
    return text.split('-')
        .map(word => {
            const lower = word.toLowerCase();
            // Prüfe ob es ein Akronym ist
            if (ACRONYMS[lower]) {
                return ACRONYMS[lower];
            }
            // Normale Kapitalisierung
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

// ============================================
// HILFSFUNKTIONEN
// ============================================

function extractTitle(html) {
    const dom = new JSDOM(html);
    const h1 = dom.window.document.querySelector('h1');
    return h1 ? h1.textContent.trim() : 'Unbenanntes Tutorial';
}

/**
 * NEU v2.2: Extrahiert den Hero-Subtitle (Excerpt) aus einer Tutorial-Datei
 * Sucht nach: .hero-subtitle, .hero-text, oder p in .hero
 */
function extractHeroExcerpt(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Versuche verschiedene Selektoren
    const selectors = [
        '.hero-subtitle',
        '.hero-text',
        '.hero p',
        '.tutorial-hero p'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            let text = element.textContent.trim();
            // Kürze auf max 160 Zeichen für Cards
            if (text.length > 160) {
                text = text.substring(0, 157) + '...';
            }
            return text;
        }
    }

    return null;
}

/**
 * NEU v2.2: Extrahiert die Kategorie-Badge Klasse aus dem Pfad
 */
function getCategoryBadgeClass(category) {
    const badgeMap = {
        'html': 'card-badge-html',
        'css': 'card-badge-css',
        'bootstrap': 'card-badge-bootstrap',
        'javascript': 'card-badge-javascript',
        'php': 'card-badge-php',
        'misc': 'card-badge-misc',
        'documentation': 'card-badge-misc'
    };
    return badgeMap[category] || 'card-badge-misc';
}

/**
 * NEU v2.2: Sammelt Metadaten für ALLE Tutorials
 * Gibt ein Array zurück, sortiert nach Position in TUTORIAL_ORDER
 */
function generateLatestTutorialsData() {
    const allTutorials = [];

    // Iteriere durch alle Kategorien in TUTORIAL_ORDER
    Object.keys(TUTORIAL_ORDER).forEach(key => {
        const parts = key.split('/');
        const category = parts[1]; // z.B. "html"
        const subcategory = parts[2]; // z.B. "html-basics"

        const order = TUTORIAL_ORDER[key];
        if (!order || order.length === 0) return;

        // Entferne "tutorials/" Prefix für den Dateipfad
        const cleanSubcategory = key.replace(/^tutorials\//, '');

        order.forEach((filename, index) => {
            const filePath = path.join(tutorialsDir, cleanSubcategory, filename);

            if (!fs.existsSync(filePath)) {
                return;
            }

            const html = fs.readFileSync(filePath, 'utf8');
            const title = CUSTOM_TITLES[filename] || extractTitle(html);
            const excerpt = extractHeroExcerpt(html);
            const url = getRelativeUrl(filePath);

            allTutorials.push({
                title,
                excerpt,
                url,
                category,
                categoryDisplay: CATEGORY_NAMES[category] || category,
                subcategory,
                subcategoryDisplay: capitalizeWithAcronyms(subcategory),
                badgeClass: getCategoryBadgeClass(category),
                // Für Sortierung: Position in der Reihenfolge (später = neuer)
                orderIndex: allTutorials.length
            });
        });
    });

    return allTutorials;
}

/**
 * NEU v2.2: Generiert die JSON-Datei mit Tutorial-Metadaten
 * Wird in /assets/data/tutorials.json gespeichert
 */
function generateLatestTutorialsJSON() {
    console.log('\n📝 Generiere Tutorial-Metadaten JSON...');
    console.log('─────────────────────────────────');

    const tutorials = generateLatestTutorialsData();

    // Sortiere: Neueste zuerst (höchster orderIndex)
    // Da wir in TUTORIAL_ORDER neue Tutorials am Ende hinzufügen,
    // ist der höchste Index das neueste Tutorial
    // const sortedByNewest = [...tutorials].reverse();

    // Hole die manuell gepflegten "Latest" Tutorials
    const latestTutorials = LATEST_TUTORIALS.map(tutorialPath => {
        return tutorials.find(t => t.url === '/' + tutorialPath);
    }).filter(t => t !== undefined);

    const data = {
        generated: new Date().toISOString(),
        total: tutorials.length,
        // Alle Tutorials (für Kategorie-Seiten)
        all: tutorials,
        // Die neuesten 4 (für Startseite)
        // latest: sortedByNewest.slice(0, 4),
        // Die neuesten 4 (manuell gepflegt)
        latest: latestTutorials.slice(0, 4),
        // Gruppiert nach Kategorie (für Kategorie-Seiten)
        byCategory: {}
    };

    // Gruppiere nach Kategorie
    tutorials.forEach(tutorial => {
        if (!data.byCategory[tutorial.category]) {
            data.byCategory[tutorial.category] = [];
        }
        data.byCategory[tutorial.category].push(tutorial);
    });

    // Schreibe JSON-Datei
    const jsonPath = path.join(dataDir, 'tutorials.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`  ✓ ${tutorials.length} Tutorials gefunden`);
    // console.log(`  ✓ Neueste 4: ${sortedByNewest.slice(0, 4).map(t => t.title).join(', ')}`);
    console.log(`  ✓ Neueste 4: ${latestTutorials.slice(0, 4).map(t => t.title).join(', ')}`);
    console.log(`  ✓ JSON gespeichert: /assets/data/tutorials.json`);

    return data;
}

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            // Blacklist-Ordner ignorieren
            if (BLACKLIST_FOLDERS.includes(file)) {
                return;
            }
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            // ALLE HTML-Dateien, auch index.html
            fileList.push(filePath);
        }
    });
    return fileList;
}

function getRelativeUrl(filePath) {
    return '/' + path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
}

function getCategoryFromPath(filePath) {
    const relativePath = path.relative(tutorialsDir, filePath);
    const parts = relativePath.split(path.sep);
    return parts[0]; // Erste Ebene (html, css, etc.)
}

function getSubcategoryFromPath(filePath) {
    const relativePath = path.relative(tutorialsDir, filePath);
    const parts = relativePath.split(path.sep);
    if (parts.length >= 2) {
        return 'tutorials/' + parts.slice(0, 2).join('/'); // z.B. "tutorials/html/html-basics"
    }
    return 'tutorials/' + parts[0];
}

function getOrderedTutorials(subcategory) {
    const order = TUTORIAL_ORDER[subcategory];
    if (!order) {
        return [];
    }

    // Entferne "tutorials/" Prefix für den Dateipfad
    const cleanSubcategory = subcategory.replace(/^tutorials\//, '');

    return order.map(filename => {
        const filePath = path.join(tutorialsDir, cleanSubcategory, filename);
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const html = fs.readFileSync(filePath, 'utf8');
        const title = CUSTOM_TITLES[filename] || extractTitle(html);

        return {
            filename,
            title,
            url: getRelativeUrl(filePath),
            filePath
        };
    }).filter(item => item !== null);
}

// Extrahiert alle Unterkategorien einer Hauptkategorie
function getSubcategoriesForCategory(category) {
    const subcategories = {};

    Object.keys(TUTORIAL_ORDER).forEach(key => {
        if (key.startsWith(`tutorials/${category}/`)) {
            const parts = key.split('/');
            const subcategoryName = parts[2]; // z.B. "html-basics"

            // Prüfe ob es Tutorials in dieser Unterkategorie gibt
            if (TUTORIAL_ORDER[key] && TUTORIAL_ORDER[key].length > 0) {
                // Display Name: "html-basics" → "HTML Basics"
                // const displayName = subcategoryName
                //     .split('-')
                //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                //     .join(' ');
                const displayName = capitalizeWithAcronyms(subcategoryName);

                subcategories[subcategoryName] = {
                    name: displayName,
                    path: key.replace('tutorials/', '/tutorials/')
                };
            }
        }
    });

    return subcategories;
}

// Holt ALLE Tutorials einer Hauptkategorie, gruppiert nach Unterkategorie
function getAllTutorialsForCategory(category) {
    const grouped = {};

    Object.keys(TUTORIAL_ORDER).forEach(key => {
        if (key.startsWith(`tutorials/${category}/`)) {
            const parts = key.split('/');
            const subcategoryName = parts[2]; // z.B. "html-basics"

            const tutorials = getOrderedTutorials(key);

            if (tutorials.length > 0) {
                // Display Name: "html-basics" → "HTML Basics"
                // const displayName = subcategoryName
                //     .split('-')
                //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                //     .join(' ');

                const displayName = capitalizeWithAcronyms(subcategoryName);

                grouped[subcategoryName] = {
                    displayName: displayName,
                    tutorials: tutorials
                };
            }
        }
    });

    return grouped;
}

// Holt ALLE Tutorials einer Hauptkategorie als flache, geordnete Liste
function getAllTutorialsFlat(category) {
    const allTutorials = [];

    // Iteriere durch TUTORIAL_ORDER in der definierten Reihenfolge
    Object.keys(TUTORIAL_ORDER).forEach(key => {
        if (key.startsWith(`tutorials/${category}/`)) {
            const tutorials = getOrderedTutorials(key);
            const parts = key.split('/');
            const subcategoryName = parts[2];

            // Füge Unterkategorie-Info zu jedem Tutorial hinzu
            tutorials.forEach(tutorial => {
                allTutorials.push({
                    ...tutorial,
                    subcategory: subcategoryName,
                    // subcategoryDisplay: subcategoryName
                    //     .split('-')
                    //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    //     .join(' ')
                    subcategoryDisplay: capitalizeWithAcronyms(subcategoryName)

                });
            });
        }
    });

    return allTutorials;
}

// ============================================
// HILFSFUNKTION: Boolean-Attribute bereinigen
// ============================================
// JSDOM serialisiert Boolean-Attribute im XHTML-Style (defer="")
// Diese Funktion bereinigt sie zu HTML5-Standard (defer)
function cleanBooleanAttributes(html) {
    return html.replace(
        /(\s(?:defer|async|hidden|checked|disabled|selected|readonly|required|multiple|novalidate|formnovalidate|autofocus|autoplay|controls|loop|muted))=""/g,
        '$1'
    );
}

// ============================================
// Header & Footer aktualisieren
// ============================================

function updateHeader(html) {
    const headerStartMarker = '<!-- Header-Start -->';
    const headerEndMarker = '<!-- Header-End -->';

    const startIndex = html.indexOf(headerStartMarker);
    const endIndex = html.indexOf(headerEndMarker);

    if (startIndex === -1 || endIndex === -1) {
        return html;
    }

    const before = html.substring(0, startIndex + headerStartMarker.length);
    const after = html.substring(endIndex);

    return before + '\n' + HEADER_TEMPLATE + '\n' + after;
}

function updateFooter(html) {
    const footerStartMarker = '<!-- Footer-Start -->';
    const footerEndMarker = '<!-- Footer-End -->';

    const startIndex = html.indexOf(footerStartMarker);
    const endIndex = html.indexOf(footerEndMarker);

    if (startIndex === -1 || endIndex === -1) {
        return html;
    }

    const before = html.substring(0, startIndex + footerStartMarker.length);
    const after = html.substring(endIndex);

    return before + '\n' + FOOTER_TEMPLATE + '\n' + after;
}

// ============================================
// TUTORIAL BUTTONS FÜR KATEGORIESEITEN
// ============================================

function generateTutorialButtons(category) {
    const subcategories = {};

    Object.keys(TUTORIAL_ORDER).forEach(key => {
        if (key.startsWith(`tutorials/${category}/`)) {
            const parts = key.split('/');
            const subcategoryName = parts[2];

            if (!subcategories[subcategoryName]) {
                subcategories[subcategoryName] = [];
            }

            const tutorials = getOrderedTutorials(key);
            subcategories[subcategoryName].push(...tutorials);
        }
    });

    let html = '';

    Object.keys(subcategories).forEach(subcategoryName => {
        const tutorials = subcategories[subcategoryName];

        if (tutorials.length === 0) {
            return;
        }

        // const displayName = subcategoryName
        //     .split('-')
        //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        //     .join(' ');
        const displayName = capitalizeWithAcronyms(subcategoryName);

        //     html += `
        // <div class="tutorial-group">
        //     <h3 class="tutorial-group-title">${displayName}</h3>
        //     <div class="tutorial-group-buttons">`;

        html += `
    <div id="${subcategoryName}" class="tutorial-group">
        <h3 class="tutorial-group-title">${displayName}</h3>
        <div class="tutorial-group-buttons">`;

        tutorials.forEach(tutorial => {
            html += `
            <a href="${tutorial.url}" class="tutorial-button">${tutorial.title}</a>`;
        });

        html += `
        </div>
    </div>`;
    });

    return html;
}

function updateTutorialButtons(html, category) {
    const startMarker = '<!-- Tutorial-Buttons-Start -->';
    const endMarker = '<!-- Tutorial-Buttons-End -->';

    const startIndex = html.indexOf(startMarker);
    const endIndex = html.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
        return html;
    }

    const before = html.substring(0, startIndex + startMarker.length);
    const after = html.substring(endIndex);

    const buttonsHtml = generateTutorialButtons(category);

    const newContent = `
<div id="tutorialButtons" class="tutorial-buttons" data-category="${category}">
${buttonsHtml}
</div>
`;

    return before + newContent + after;
}

// ============================================
// Navigation generieren
// ============================================

// function generateMainNavigation() {
//     const categories = Object.keys(CATEGORY_NAMES);
//     const navItems = [];

//     categories.forEach(category => {
//         const categoryName = CATEGORY_NAMES[category];

//         const hasEntry = Object.keys(TUTORIAL_ORDER).some(key =>
//             key.startsWith('tutorials/' + category + '/')
//         );

//         if (hasEntry) {
//             navItems.push(`<li><a href="/tutorials/${category}/">${categoryName}</a></li>`);
//         }
//     });

//     return navItems;
// }

// NEUE VERSION mit Unterkategorien-Dropdowns
// 

// KORRIGIERTE VERSION v2 - Verschachtelte Struktur für bestehendes Tutorials-Dropdown
function generateMainNavigation() {
    const categories = Object.keys(CATEGORY_NAMES);
    const navItems = [];

    categories.forEach(category => {
        const categoryName = CATEGORY_NAMES[category];
        const subcategories = getSubcategoriesForCategory(category);

        // Prüfe ob es Tutorials in dieser Kategorie gibt
        if (Object.keys(subcategories).length > 0) {
            // Item mit Unterkategorien
            let navItem = `<li class="nav-item-nested">
                        <a href="/tutorials/${category}/" class="nav-link">
                            ${categoryName}
                            <span class="submenu-icon">▸</span>
                        </a>
                        <ul class="dropdown-submenu">`;

            // Füge Unterkategorien hinzu
            Object.keys(subcategories).forEach(subKey => {
                const sub = subcategories[subKey];
                navItem += `
                            <li><a href="/tutorials/${category}/#${subKey}">${sub.name}</a></li>`;
            });

            navItem += `
                        </ul>
                    </li>`;

            navItems.push(navItem);
        }
    });

    return navItems;
}

function generateBreadcrumbs(filePath, currentTitle) {
    const category = getCategoryFromPath(filePath);
    const categoryName = CATEGORY_NAMES[category] || category;
    const basename = path.basename(filePath);

    // Für Kategorieseiten (index.html): nur Home › Kategorie
    if (basename === 'index.html') {
        return `<a href="/" class="breadcrumb-link">Home</a><span class="breadcrumb-separator">›</span><span class="breadcrumb-current">${categoryName}</span>`;
    }

    // Für Tutorial-Seiten: Home › Kategorie › Tutorial
    return `<a href="/" class="breadcrumb-link">Home</a><span class="breadcrumb-separator">›</span><a href="/tutorials/${category}/" class="breadcrumb-link">${categoryName}</a><span class="breadcrumb-separator">›</span><span class="breadcrumb-current">${currentTitle}</span>`;
}

// Für Tutorial-Seiten: prev/next Buttons
// function generatePrevNextNav(filePath) {
//     const subcategory = getSubcategoryFromPath(filePath);
//     const tutorials = getOrderedTutorials(subcategory);
//     const currentIndex = tutorials.findIndex(t => t.filePath === filePath);

//     if (currentIndex === -1) return '';

//     const prev = currentIndex > 0 ? tutorials[currentIndex - 1] : null;
//     const next = currentIndex < tutorials.length - 1 ? tutorials[currentIndex + 1] : null;

//     let navHtml = '';

// WICHTIG: Keine Leerzeichen/Zeilenumbrüche zwischen den divs!
// Das CSS braucht sie direkt nebeneinander für flexbox
// if (prev) {
//     navHtml += `
//     <div class="tutorial-nav-prev">
//         <a href="${prev.url}">
//             <span class="tutorial-nav-label">← Vorheriges</span>
//             <span class="tutorial-nav-link">${prev.title}</span>
//         </a>
//     </div>`;
// } else {
//     navHtml += '<div class="tutorial-nav-prev"></div>';
// }

// Direkt anschließend ohne Leerzeichen!
//     if (next) {
//         navHtml += `<div class="tutorial-nav-next">
//             <a href="${next.url}">
//                 <span class="tutorial-nav-label">Nächstes →</span>
//                 <span class="tutorial-nav-link">${next.title}</span>
//             </a>
//         </div>`;
//     } else {
//         navHtml += '<div class="tutorial-nav-next"></div>';
//     }

//     return navHtml;
// }

// NEUE VERSION - alle Tutorials der Kategorie mit Unterkategorie-Hinweis
function generatePrevNextNav(filePath) {
    const category = getCategoryFromPath(filePath);
    const currentSubcategory = getSubcategoryFromPath(filePath);
    const allTutorials = getAllTutorialsFlat(category);
    const currentIndex = allTutorials.findIndex(t => t.filePath === filePath);

    if (currentIndex === -1) return '';

    const prev = currentIndex > 0 ? allTutorials[currentIndex - 1] : null;
    const next = currentIndex < allTutorials.length - 1 ? allTutorials[currentIndex + 1] : null;
    const current = allTutorials[currentIndex];

    let navHtml = '';

    // PREV Button
    if (prev) {
        const prevSubcategory = `tutorials/${category}/${prev.subcategory}`;
        const isNewCategory = prevSubcategory !== currentSubcategory;
        const categoryClass = isNewCategory ? ' is-new' : '';

        navHtml += `
        <div class="tutorial-nav-prev">
            <a href="${prev.url}">
                <span class="tutorial-nav-label">← Vorheriges</span>
                <span class="tutorial-nav-link">${prev.title}</span>
                <span class="tutorial-nav-category${categoryClass}">${prev.subcategoryDisplay}</span>
            </a>
        </div>`;
    } else {
        navHtml += '<div class="tutorial-nav-prev"></div>';
    }

    // NEXT Button
    if (next) {
        const nextSubcategory = `tutorials/${category}/${next.subcategory}`;
        const isNewCategory = nextSubcategory !== currentSubcategory;
        const categoryClass = isNewCategory ? ' is-new' : '';

        navHtml += `<div class="tutorial-nav-next">
            <a href="${next.url}">
                <span class="tutorial-nav-label">Nächstes →</span>
                <span class="tutorial-nav-link">${next.title}</span>
                <span class="tutorial-nav-category${categoryClass}">${next.subcategoryDisplay}</span>
            </a>
        </div>`;
    } else {
        navHtml += '<div class="tutorial-nav-next"></div>';
    }

    return navHtml;
}

function addIdsToHeadingsAndGenerateSidebar(html, filename) {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const headings = doc.querySelectorAll('h2, h3');

    const anchors = [];
    const usedIds = new Set();

    headings.forEach(heading => {
        if (heading.classList.contains('no-toc')) return;

        let id = heading.id;

        // ID generieren wenn keine vorhanden
        if (!id) {
            id = heading.textContent.trim().toLowerCase()
                .replace(/[äöüÄÖÜß]/g, match => {
                    const map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue', 'ß': 'ss' };
                    return map[match];
                })
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            // Duplikate vermeiden
            let finalId = id;
            let counter = 1;
            while (usedIds.has(finalId)) {
                finalId = `${id}-${counter}`;
                counter++;
            }

            // ID ins Heading einfügen!
            heading.id = finalId;
            id = finalId;
        }

        usedIds.add(id);

        const level = heading.tagName === 'H2' ? 'toc-level-1' : 'toc-level-2';

        // Custom Title verwenden falls vorhanden, sonst Original-Text (escaped!)
        let displayTitle;
        if (TOC_CUSTOM_TITLES[filename] && TOC_CUSTOM_TITLES[filename][id]) {
            // Custom Title direkt verwenden (User kontrolliert das Escaping)
            displayTitle = TOC_CUSTOM_TITLES[filename][id];
        } else {
            // textContent escaped, da es Entities bereits dekodiert hat
            displayTitle = escapeHtml(heading.textContent.trim());
        }

        anchors.push(`<li class="${level}"><a href="#${id}">${displayTitle}</a></li>`);
    });

    return {
        html: cleanBooleanAttributes(dom.serialize()),
        anchors: anchors.join('\n                    ')
    };
}

// HTML-Entities escapen für Sidebar-Anzeige
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// function generateSidebarNavList(filePath) {
//     const subcategory = getSubcategoryFromPath(filePath);
//     const tutorials = getOrderedTutorials(subcategory);
//     const currentUrl = getRelativeUrl(filePath);

//     return tutorials.map(tutorial => {
//         const isActive = tutorial.url === currentUrl;
//         const activeClass = isActive ? ' class="active"' : '';
//         return `<li><a href="${tutorial.url}"${activeClass}>${tutorial.title}</a></li>`;
//     }).join('\n                    ');
// }

// NEUE VERSION - alle Tutorials der Kategorie, gruppiert
function generateSidebarNavList(filePath) {
    const category = getCategoryFromPath(filePath);
    const currentUrl = getRelativeUrl(filePath);
    const allTutorials = getAllTutorialsForCategory(category);

    let html = '';

    // Iteriere durch alle Unterkategorien
    Object.keys(allTutorials).forEach(subcategoryKey => {
        const group = allTutorials[subcategoryKey];

        // Gruppen-Überschrift
        html += `<li class="sidebar-group-title">${group.displayName}</li>\n                    `;

        // Tutorials dieser Gruppe
        group.tutorials.forEach(tutorial => {
            const isActive = tutorial.url === currentUrl;
            const activeClass = isActive ? ' class="active"' : '';
            html += `<li><a href="${tutorial.url}"${activeClass}>${tutorial.title}</a></li>\n                    `;
        });
    });

    return html.trim();
}

// ============================================
// HTML-Datei aktualisieren
// ============================================

function updateHtmlFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    const category = getCategoryFromPath(filePath);
    const basename = path.basename(filePath);
    const currentTitle = CUSTOM_TITLES[basename] || extractTitle(html);

    // WICHTIG: ZUERST IDs zu Headings hinzufügen (nur für nicht-index Seiten)
    // Das muss vor allen anderen Ersetzungen passieren!
    let sidebarAnchorsHtml = '';
    if (basename !== 'index.html') {
        const result = addIdsToHeadingsAndGenerateSidebar(html, basename);
        html = result.html;  // Nutze das HTML mit den eingefügten IDs!
        sidebarAnchorsHtml = result.anchors;
    }

    // 1. HEADER AKTUALISIEREN
    html = updateHeader(html);

    // 2. FOOTER AKTUALISIEREN
    html = updateFooter(html);

    // 3. TUTORIAL BUTTONS (nur bei Kategorieseiten!)
    if (basename === 'index.html') {
        html = updateTutorialButtons(html, category);
    }

    // 4. Main Navigation
    const mainNavStartMarker = '<!-- Main-Nav-Start -->';
    const mainNavEndMarker = '<!-- Main-Nav-End -->';
    const mainNavItems = generateMainNavigation();

    if (html.includes(mainNavStartMarker) && html.includes(mainNavEndMarker)) {
        const navContent = mainNavItems.join('\n                                ');
        html = html.replace(
            new RegExp(`${mainNavStartMarker}[\\s\\S]*?${mainNavEndMarker}`),
            `${mainNavStartMarker}\n                                ${navContent}\n                                ${mainNavEndMarker}`
        );
    }

    // 5. Breadcrumbs (für alle Tutorial-Seiten, auch Kategorieseiten!)
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const isInTutorials = relativePath.includes('tutorials');

    if (isInTutorials) {
        const breadcrumbsNav = html.match(/<nav class="breadcrumbs">.*?<\/nav>/s);
        if (breadcrumbsNav) {
            const newBreadcrumbs = `<nav class="breadcrumbs">${generateBreadcrumbs(filePath, currentTitle)}</nav>`;
            html = html.replace(breadcrumbsNav[0], newBreadcrumbs);
        }
    }

    // 6. Prev/Next Navigation (nicht für index.html)
    if (basename !== 'index.html') {
        const tutorialNavTag = html.match(/<nav class="tutorial-nav">.*?<\/nav>/s);
        if (tutorialNavTag) {
            const prevNextNav = generatePrevNextNav(filePath);
            html = html.replace(tutorialNavTag[0], `<nav class="tutorial-nav">${prevNextNav}</nav>`);
        }
    }

    // 7. Sidebar Anchors (nicht für index.html) - nutze die bereits generierten anchors!
    if (basename !== 'index.html') {
        const sidebarAnchorStartMarker = '<!-- Sidebar-Anchor-Start -->';
        const sidebarAnchorEndMarker = '<!-- Sidebar-Anchor-End -->';

        if (html.includes(sidebarAnchorStartMarker) && html.includes(sidebarAnchorEndMarker)) {
            html = html.replace(
                new RegExp(`${sidebarAnchorStartMarker}[\\s\\S]*?${sidebarAnchorEndMarker}`),
                `${sidebarAnchorStartMarker}\n                    ${sidebarAnchorsHtml}\n                    ${sidebarAnchorEndMarker}`
            );
        }
    }

    // 8. Sidebar Navigation List (nicht für index.html)
    if (basename !== 'index.html') {
        const sidebarNavList = html.match(/<ul class="sidebar-nav-list">.*?<\/ul>/s);
        if (sidebarNavList) {
            const navListContent = generateSidebarNavList(filePath);
            html = html.replace(
                sidebarNavList[0],
                `<ul class="sidebar-nav-list">\n                    ${navListContent}\n                </ul>`
            );
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
}

// ============================================
// HAUPTLOGIK
// ============================================


// ============================================
// ROOT-LEVEL HTML-DATEIEN (NEU in v2.1)
// ============================================

// NEU: Root-Level HTML-Dateien finden
function findRootHtmlFiles() {
    const files = fs.readdirSync(rootDir);
    const htmlFiles = [];

    files.forEach(file => {
        if (file.endsWith('.html') && !ROOT_FILES_EXCLUDE.includes(file)) {
            const filePath = path.join(rootDir, file);
            const stat = fs.statSync(filePath);

            // Prüfe ob es eine Datei ist (kein Verzeichnis)
            if (stat.isFile()) {
                htmlFiles.push(filePath);
            }
        }
    });

    return htmlFiles;
}

// NEU: Root-Level HTML-Datei aktualisieren (nur Header + Footer + Main Nav)
function updateRootHtmlFile(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. HEADER AKTUALISIEREN
    html = updateHeader(html);

    // 2. FOOTER AKTUALISIEREN
    html = updateFooter(html);

    // 3. Main Navigation (im Header)
    const mainNavStartMarker = '<!-- Main-Nav-Start -->';
    const mainNavEndMarker = '<!-- Main-Nav-End -->';
    const mainNavItems = generateMainNavigation();

    if (html.includes(mainNavStartMarker) && html.includes(mainNavEndMarker)) {
        const navContent = mainNavItems.join('\n                                ');
        html = html.replace(
            new RegExp(`${mainNavStartMarker}[\\s\\S]*?${mainNavEndMarker}`),
            `${mainNavStartMarker}\n                                ${navContent}\n                                ${mainNavEndMarker}`
        );
    }

    fs.writeFileSync(filePath, html, 'utf8');
}

function generateAllNavigation() {
    console.log('🚀 Starte Navigation-Generierung...\n');

    // 1. Tutorial-Dateien aktualisieren
    console.log('📚 Tutorial-Seiten:');
    console.log('─────────────────────────────────');
    const tutorialFiles = findHtmlFiles(tutorialsDir);
    console.log(`📄 Gefundene Tutorial-Dateien: ${tutorialFiles.length}\n`);

    tutorialFiles.forEach(filePath => {
        const relativePath = path.relative(tutorialsDir, filePath);
        console.log(`  ✓ Aktualisiere: ${relativePath}`);
        updateHtmlFile(filePath);
    });

    // 2. Root-Level Dateien aktualisieren
    console.log('\n🏠 Root-Level Seiten:');
    console.log('─────────────────────────────────');
    const rootFiles = findRootHtmlFiles();
    console.log(`📄 Gefundene Root-Dateien: ${rootFiles.length}\n`);

    rootFiles.forEach(filePath => {
        const filename = path.basename(filePath);
        console.log(`  ✓ Aktualisiere: ${filename}`);
        updateRootHtmlFile(filePath);
    });

    console.log('\n✅ Navigation erfolgreich generiert!');
    console.log('💡 Header & Footer wurden auf allen Seiten aktualisiert!');
    console.log(`📊 Gesamt aktualisiert: ${tutorialFiles.length + rootFiles.length} Dateien\n`);
}

// 3. Tutorial-Metadaten JSON generieren (NEU v2.2)
generateLatestTutorialsJSON();

generateAllNavigation();