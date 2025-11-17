// ===================================
// MAIN.JS - HAUPTSCRIPT FÜR ALLE SEITEN
// ===================================

// Theme Icon Pfade (deine SVG-Dateien)
const THEME_ICONS = {
    dark: '/assets/icons/light-mode.svg',
    light: '/assets/icons/dark-mode.svg'
};

// Tutorial-Daten für Auto-Populate der rechten Sidebar
// const TUTORIAL_DATA = {
//     html: {
//         title: 'HTML Tutorials',
//         groups: {
//             'HTML Basics': [
//                 { title: 'HTML Basics', url: '/tutorials/html/html-basics/html-basics.html' },
//                 { title: 'HTML-Grundgerüst', url: '/tutorials/html/html-basics/html-grundgeruest.html' },
//                 { title: 'Meta Tags', url: '/tutorials/html/html-basics/html-meta-tags.html' },
//                 { title: 'Typografie', url: '/tutorials/html/html-basics/html-typografie.html' },
//                 { title: 'Listen', url: '/tutorials/html/html-basics/html-listen.html' },
//                 { title: 'Links', url: '/tutorials/html/html-basics/html-links.html' },
//                 { title: 'Navigation', url: '/tutorials/html/html-basics/html-navigation.html' },
//                 { title: 'Bilder', url: '/tutorials/html/html-basics/html-bilder.html' },
//                 { title: 'Tabellen', url: '/tutorials/html/html-basics/html-tabellen.html' }
//             ],
//             'HTML Advanced': [
//                 { title: 'Semantik', url: '/tutorials/html/html-advanced/html-semantik.html' },
//                 { title: 'Formulare', url: '/tutorials/html/html-advanced/html-formulare.html' },
//                 { title: 'Audio & Video', url: '/tutorials/html/html-advanced/html-audio-video.html' },
//                 { title: 'SVG', url: '/tutorials/html/html-advanced/html-svg.html' },
//                 { title: 'iFrames', url: '/tutorials/html/html-advanced/html-iframes.html' },
//                 { title: 'Quellcode darstellen', url: '/tutorials/html/html-advanced/html-quellcode-darstellen.html' },
//                 { title: 'Accessibility', url: '/tutorials/html/html-advanced/html-accessibility.html' },
//                 { title: 'ARIA', url: '/tutorials/html/html-advanced/html-aria.html' },
//                 { title: 'Data Attributes', url: '/tutorials/html/html-advanced/html-data-attributes.html' }
//             ]
//         }
//     },
//     css: {
//         title: 'CSS Tutorials',
//         groups: {
//             'CSS Basics': [
//                 { title: 'CSS einbinden NEW', url: '/tutorials/css/css-basics/css-einbinden.html' },
//                 { title: 'Color Units', url: '/tutorials/css/css-basics/css-color-units.html' },
//                 { title: 'Variables', url: '/tutorials/css/css-basics/css-variables.html' },
//                 { title: 'Typografie', url: '/tutorials/css/css-basics/css-typografie.html' },
//                 { title: 'Textstyling', url: '/tutorials/css/css-basics/css-textstyling.html' },
//                 { title: 'Padding & Margin', url: '/tutorials/css/css-basics/css-padding-margin.html' },
//                 { title: 'Box Model', url: '/tutorials/css/css-basics/css-box-model.html' },
//                 { title: 'Flexbox & Grid', url: '/tutorials/css/css-basics/css-flexbox-grid.html' },
//                 { title: 'Background Effects', url: '/tutorials/css/css-basics/css-background-effects.html' },
//                 { title: 'Text Shadows & Effects', url: '/tutorials/css/css-basics/css-text-shadows-text-effects.html' },
//                 { title: 'Borders & Outlines', url: '/tutorials/css/css-basics/css-borders-outlines.html' },
//                 { title: 'Responsive', url: '/tutorials/css/css-basics/css-responsive.html' },
//                 { title: 'Media Queries', url: '/tutorials/css/css-basics/css-media-queries.html' },
//                 { title: 'Mobile First', url: '/tutorials/css/css-basics/css-mobile-first.html' }
//             ],
//             'CSS Advanced': [
//                 { title: 'Positioning', url: '/tutorials/css/css-advanced/css-positioning.html' },
//                 { title: 'Z-Index', url: '/tutorials/css/css-advanced/css-z-index.html' },
//                 { title: 'Transitions', url: '/tutorials/css/css-advanced/css-transitions.html' },
//                 { title: 'Animation', url: '/tutorials/css/css-advanced/css-animation.html' },
//                 { title: 'Transform 3D', url: '/tutorials/css/css-advanced/css-transform-3d.html' },
//                 { title: 'Dark Mode', url: '/tutorials/css/css-advanced/css-dark-mode.html' },
//                 { title: 'Functions', url: '/tutorials/css/css-advanced/css-functions.html' }
//             ],
//             'CSS Specials': [
//                 { title: 'Custom Fonts', url: '/tutorials/css/css-specials/css-custom-fonts.html' },
//                 { title: 'Pseudo Elements', url: '/tutorials/css/css-specials/css-pseudo-elements.html' },
//                 { title: 'Pseudo Classes', url: '/tutorials/css/css-specials/css-pseudo-classes.html' },
//                 { title: 'Shapes', url: '/tutorials/css/css-specials/css-shapes.html' },
//                 { title: 'Filters & Effects', url: '/tutorials/css/css-specials/css-filters-effects.html' },
//                 { title: 'Container Queries', url: '/tutorials/css/css-specials/css-container-queries.html' },
//                 { title: 'Grid Deep Dive', url: '/tutorials/css/css-specials/css-grid-deep-dive.html' }
//             ]
//         }
//     },
//     javascript: {
//         title: 'JavaScript Tutorials',
//         groups: {
//             'Basics': [
//                 { title: 'Variables', url: '/tutorials/javascript/basics/variables.html' },
//                 { title: 'Functions', url: '/tutorials/javascript/basics/functions.html' },
//                 { title: 'Conditions', url: '/tutorials/javascript/basics/conditions.html' },
//                 { title: 'Loops', url: '/tutorials/javascript/basics/loops.html' },
//                 { title: 'Arrays & Objects', url: '/tutorials/javascript/basics/arrays-objects.html' },
//                 { title: 'Events', url: '/tutorials/javascript/basics/events.html' },
//                 { title: 'Scroll to Top', url: '/tutorials/javascript/basics/scroll-to-top.html' }
//             ],
//             'Advanced': [
//                 { title: 'Async/Await', url: '/tutorials/javascript/advanced/async-await.html' },
//                 { title: 'DOM Manipulation', url: '/tutorials/javascript/advanced/dom.html' },
//                 { title: 'Fetch', url: '/tutorials/javascript/advanced/fetch.html' },
//                 { title: 'Storage', url: '/tutorials/javascript/advanced/storage.html' },
//                 { title: 'Event Delegation', url: '/tutorials/javascript/advanced/event-delegation.html' }
//             ],
//             'Projects': [
//                 { title: 'Todo App', url: '/tutorials/javascript/javascript-projects/todo-app.html' },
//                 { title: 'Modal', url: '/tutorials/javascript/javascript-projects/modal.html' }
//             ]
//         }
//     },
//     php: {
//         title: 'PHP Tutorials',
//         groups: {
//             'PHP Basics': [
//                 { title: 'PHP Basics', url: '/tutorials/php/php-basics/basics.html' },
//                 { title: 'Variables', url: '/tutorials/php/php-basics/variables.html' },
//                 { title: 'Arrays & Loops', url: '/tutorials/php/php-basics/arrays-loops.html' },
//                 { title: 'Includes', url: '/tutorials/php/php-basics/includes.html' },
//                 { title: 'Forms', url: '/tutorials/php/php-basics/forms.html' }
//             ],
//             'PHP Advanced': [
//                 { title: 'OOP', url: '/tutorials/php/php-advanced/oop.html' },
//                 { title: 'Security', url: '/tutorials/php/php-advanced/security.html' },
//                 { title: 'Sessions', url: '/tutorials/php/php-advanced/sessions.html' },
//                 { title: 'Validation', url: '/tutorials/php/php-advanced/validation.html' },
//                 { title: 'Mail', url: '/tutorials/php/php-advanced/mail.html' },
//                 { title: 'PDO', url: '/tutorials/php/php-advanced/pdo.html' }
//             ]
//         }
//     },
//     bootstrap: {
//         title: 'Bootstrap Tutorials',
//         groups: {
//             'Bootstrap Basics': [
//                 { title: 'Bootstrap Intro', url: '/tutorials/bootstrap/bootstrap-basics/bootstrap-intro.html' },
//                 { title: 'Grid', url: '/tutorials/bootstrap/bootstrap-basics/bootstrap-grid.html' },
//                 { title: 'Utilities', url: '/tutorials/bootstrap/bootstrap-basics/bootstrap-utilities.html' }
//             ],
//             'Components': [
//                 { title: 'Components', url: '/tutorials/bootstrap/bootstrap-components/bootstrap-components.html' },
//                 { title: 'Buttons', url: '/tutorials/bootstrap/bootstrap-components/bootstrap-buttons.html' },
//                 { title: 'Cards', url: '/tutorials/bootstrap/bootstrap-components/bootstrap-cards.html' },
//                 { title: 'Alerts', url: '/tutorials/bootstrap/bootstrap-components/bootstrap-alerts.html' },
//                 { title: 'Badges', url: '/tutorials/bootstrap/bootstrap-components/bootstrap-badges.html' },
//                 { title: 'Tables', url: '/tutorials/bootstrap/bootstrap-components/bootstrap-tables.html' }
//             ],
//             'Navigation': [
//                 { title: 'Navbar', url: '/tutorials/bootstrap/bootstrap-navigation/bootstrap-navbar.html' },
//                 { title: 'Pagination', url: '/tutorials/bootstrap/bootstrap-navigation/bootstrap-pagination.html' },
//                 { title: 'Breadcrumbs', url: '/tutorials/bootstrap/bootstrap-navigation/bootstrap-breadcrumbs.html' }
//             ],
//             'Forms': [
//                 { title: 'Forms', url: '/tutorials/bootstrap/bootstrap-forms/bootstrap-forms.html' }
//             ],
//             'Interactive': [
//                 { title: 'Accordion', url: '/tutorials/bootstrap/bootstrap-interactive/accordion.html' },
//                 { title: 'Carousel', url: '/tutorials/bootstrap/bootstrap-interactive/carousel.html' },
//                 { title: 'Modal', url: '/tutorials/bootstrap/bootstrap-interactive/modal.html' },
//                 { title: 'Tooltips', url: '/tutorials/bootstrap/bootstrap-interactive/tooltips.html' },
//                 { title: 'Popovers', url: '/tutorials/bootstrap/bootstrap-interactive/popovers.html' },
//                 { title: 'Spinner', url: '/tutorials/bootstrap/bootstrap-interactive/spinner.html' }
//             ],
//             'Extras': [
//                 { title: 'Icons', url: '/tutorials/bootstrap/bootstrap-extras/icons.html' },
//                 { title: 'SCSS', url: '/tutorials/bootstrap/bootstrap-extras/scss.html' },
//                 { title: 'Theming', url: '/tutorials/bootstrap/bootstrap-extras/theming.html' }
//             ]
//         }
//     }
// };

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ main.js geladen');

    // ===================================
    // THEME TOGGLE (Dark/Light Mode) mit Icon-Wechsel
    // ===================================

    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Setze initial Theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Funktion: Icon aktualisieren basierend auf aktuellem Theme
    function updateThemeIcon(theme) {
        if (!themeToggle) return;

        // Finde das img Element innerhalb des Buttons
        const img = themeToggle.querySelector('.theme-icon img');
        if (!img) return;

        // Dark Mode = zeige Light Icon (zum Wechseln zu Light)
        // Light Mode = zeige Dark Icon (zum Wechseln zu Dark)
        const iconSrc = theme === 'dark' ? THEME_ICONS.light : THEME_ICONS.dark;
        img.src = iconSrc;

        // Accessibility: Aria-Label aktualisieren
        const label = theme === 'dark' ? 'Zu Light Mode wechseln' : 'Zu Dark Mode wechseln';
        themeToggle.setAttribute('aria-label', label);
    }

    // Initial Icon setzen
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Icon aktualisieren
            updateThemeIcon(newTheme);

            console.log(`🌓 Theme gewechselt: ${current} → ${newTheme}`);
        });
    }

    // Theme synchronisieren bei Tab-Wechsel
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            const newTheme = e.newValue || 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });

    // ===================================
    // TUTORIAL SIDEBAR AUTO-POPULATE
    // Füllt rechte Sidebar automatisch mit Tutorials
    // ===================================

    // const tutorialRelated = document.querySelector('.tutorial-related');

    // if (tutorialRelated) {
        // Aktuelle URL analysieren
        // const currentPath = window.location.pathname;

        // Extrahiere Kategorie aus URL (z.B. /tutorials/css/... → css)
        // const categoryMatch = currentPath.match(/\/tutorials\/([^\/]+)\//);

        // if (categoryMatch) {
        //     const currentCategory = categoryMatch[1]; // z.B. 'css', 'html', 'javascript'

            // Prüfe ob Kategorie existiert
            // if (TUTORIAL_DATA[currentCategory]) {
            //     const categoryData = TUTORIAL_DATA[currentCategory];

                // Update Titel
                // const titleElement = tutorialRelated.querySelector('.sidebar-title');
                // if (titleElement) {
                //     titleElement.textContent = categoryData.title;
                // }

                // Finde die Liste
                // const navList = tutorialRelated.querySelector('.sidebar-nav-list');

                // if (navList) {
                    // Leere vorhandene Liste
                    // navList.innerHTML = '';

                    // Füge alle Gruppen hinzu
                    // Object.entries(categoryData.groups).forEach(([groupName, tutorials]) => {
                        // Gruppe-Überschrift (nur wenn mehrere Gruppen vorhanden)
                        // if (Object.keys(categoryData.groups).length > 1) {
                        //     const groupTitle = document.createElement('li');
                        //     groupTitle.className = 'sidebar-nav-group-title';
                        //     groupTitle.textContent = groupName;
                        //     navList.appendChild(groupTitle);
                        // }

                        // Tutorials dieser Gruppe
                        // tutorials.forEach(tutorial => {
                        //     const li = document.createElement('li');
                        //     const a = document.createElement('a');
                        //     a.href = tutorial.url;
                        //     a.textContent = tutorial.title;

                            // Markiere aktuelles Tutorial als active
    //                         if (currentPath === tutorial.url) {
    //                             a.classList.add('active');
    //                         }

    //                         li.appendChild(a);
    //                         navList.appendChild(li);
    //                     });
    //                 });

    //                 console.log(`✅ Tutorial-Sidebar für "${currentCategory}" geladen (${Object.keys(categoryData.groups).length} Gruppen)`);
    //             } else {
    //                 console.log('⚠️ Keine .sidebar-nav-list gefunden');
    //             }
    //         } else {
    //             console.log(`⚠️ Keine Tutorials für Kategorie "${currentCategory}" gefunden`);
    //         }
    //     } else {
    //         console.log('⚠️ Keine Tutorial-Kategorie in URL gefunden');
    //     }
    // }

    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
        });

        // Schließe Menü bei Klick außerhalb
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('is-open');
            }
        });
    }

    // ===================================
    // DROPDOWN MENU
    // ===================================

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Finde das zugehörige Dropdown-Menu (nächstes Sibling)
            const menu = toggle.nextElementSibling;

            if (!menu || !menu.classList.contains('dropdown-menu')) return;

            // Prüfe ob dieses Menu offen ist
            const isOpen = menu.classList.contains('is-open');

            // Schließe ALLE Dropdowns
            document.querySelectorAll('.dropdown-menu').forEach((m) => {
                m.classList.remove('is-open');
            });

            // Setze alle aria-expanded auf false
            document.querySelectorAll('.dropdown-toggle').forEach((t) => {
                t.setAttribute('aria-expanded', 'false');
            });

            // Toggle das aktuelle Dropdown
            if (!isOpen) {
                menu.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Schließe alle Dropdowns bei Klick außerhalb
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach((menu) => {
                menu.classList.remove('is-open');
            });
            document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Schließe bei ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu').forEach((menu) => {
                menu.classList.remove('is-open');
            });
            document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================

    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        // Zeige Button beim Scrollen
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top bei Klick
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // CURRENT YEAR IM FOOTER
    // ===================================

    function setCurrentYear() {
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    setCurrentYear();

    // ===================================
    // SMOOTH SCROLL FÜR ANKER-LINKS
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignoriere leere oder nur '#' Links
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('✅ Alle Features geladen!');
});

// Search Toggle
const searchToggle = document.getElementById('searchToggle');
const searchDropdown = document.getElementById('searchDropdown');
const searchInput = document.getElementById('globalSearch');

if (searchToggle && searchDropdown) {
    searchToggle.addEventListener('click', () => {
        const isHidden = searchDropdown.hasAttribute('hidden');
        
        if (isHidden) {
            searchDropdown.removeAttribute('hidden');
            searchInput.focus();
        } else {
            searchDropdown.setAttribute('hidden', '');
        }
    });
    
    // Schließen wenn außerhalb geklickt
    document.addEventListener('click', (e) => {
        if (!searchToggle.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.setAttribute('hidden', '');
        }
    });
    
    // ESC schließt Dropdown
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchDropdown.setAttribute('hidden', '');
        }
    });
}