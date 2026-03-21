// === SICHERHEITSWARNUNG (Immer zuerst!) ===
console.log('%c⚠️ Console-Warnung',
    'color: #ff6b6b; font-size: 18px; font-weight: bold;');
console.log('%cFalls dich jemand gebeten hat, Code hier einzufügen: DON\'T! ' +
    'Das könnte ein Betrugsversuch sein.',
    'color: #ff6b6b; font-size: 13px;');
console.log('%cMehr Infos: https://de.wikipedia.org/wiki/Self-XSS',
    'color: #999; font-size: 11px;');

console.log('\n'); // Leerzeile

// === BEGRÜßUNG ===
console.log(`
    ▄▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▄
    █  ░░  DevPanicZone        ░░  █
    █  ░░  Code | Debug | Win  ░░  █
    ▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀

         ⚡ Don't Panic. Cheat. ⚡
`);

console.log('%cHey! Schön, dass du hier bist! 👋',
    'color: #4ecdc4; font-size: 14px; font-weight: bold;');
console.log('%c💡 Du siehst: Sauberer Code, responsive Design, made with ☕',
    'color: #95e1d3; font-size: 12px;');
// console.log('%c📫 hello@devpaniczone.de', 
// 'color: #f38181; font-size: 11px;');

// Theme Icon Pfade (deine SVG-Dateien)
const THEME_ICONS = {
    dark: '/assets/icons/light-mode.svg',
    light: '/assets/icons/dark-mode.svg'
};


// ===================================
// LUCIDE ICON SPRITE LADEN
// ===================================

fetch('/assets/icons/sprite.svg')
    .then(response => {
        if (!response.ok) {
            throw new Error('Sprite nicht gefunden');
        }
        return response.text();
    })
    .then(svg => {
        document.body.insertAdjacentHTML('afterbegin', svg);
        console.log('✅ Sprite geladen');
    })
    .catch(error => {
        console.warn('⚠️ Sprite konnte nicht geladen werden:', error);
    });




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
    // MOBILE MENU TOGGLE
    // ===================================

    // const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    // const mainNav = document.getElementById('mainNav');

    // if (mobileMenuToggle && mainNav) {
    //     mobileMenuToggle.addEventListener('click', () => {
    //         mainNav.classList.toggle('is-open');
    //     });

    // Schließe Menü bei Klick außerhalb
    //     document.addEventListener('click', (e) => {
    //         if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
    //             mainNav.classList.remove('is-open');
    //         }
    //     });
    // }

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); // NEU
        });

        // Schließe Menü bei Klick außerhalb
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('is-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false'); // NEU
            }
        });
    }

    // ===================================
    // DROPDOWN MENU
    // ===================================

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Hilfsfunktion: Dropdown togglen
    function toggleDropdown(toggle) {
        const menu = toggle.nextElementSibling;

        if (!menu || !menu.classList.contains('dropdown-menu')) return;

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
    }

    dropdownToggles.forEach((toggle) => {
        // Klick-Event
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(toggle);
        });

        // Keyboard-Event (Enter und Space)
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(toggle);
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
    // NESTED SUBMENU (Kategorien im Tutorials-Dropdown)
    // ===================================

    const nestedItems = document.querySelectorAll('.nav-item-nested > .nav-link');

    // Hilfsfunktion: Submenu togglen
    function toggleSubmenu(link) {
        const parentLi = link.closest('.nav-item-nested');

        // Schließe alle anderen Submenus im gleichen Dropdown
        const dropdown = link.closest('.dropdown-menu');
        if (dropdown) {
            dropdown.querySelectorAll('.nav-item-nested').forEach(item => {
                if (item !== parentLi) {
                    item.classList.remove('is-active');
                }
            });
        }

        // Toggle das aktuelle Submenu
        parentLi.classList.toggle('is-active');
    }

    nestedItems.forEach(link => {
        // Klick-Event
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSubmenu(this);
        });

        // Keyboard-Event (Enter und Space)
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu(this);
            }
        });
    });

    // Schließe Submenus wenn außerhalb geklickt wird (NUR EINMAL!)
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item-nested') && !e.target.closest('.dropdown-menu')) {
            document.querySelectorAll('.nav-item-nested').forEach(item => {
                item.classList.remove('is-active');
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
    // CURRENT DATE FÜR DATENSCHUTZERKLÄRUNG
    // ===================================

    function setCurrentDate() {
        const dateSpan = document.getElementById('currentDate');
        if (dateSpan) {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateSpan.textContent = today.toLocaleDateString('de-DE', options);
        }
    }

    setCurrentDate();

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

// ============================================================================
// LEGAL PAGES: Datenschutz & Impressum
// ============================================================================

/**
 * Bot-Schutz für E-Mail-Adressen und Kontaktdaten
 * Baut die Kontaktdaten clientseitig zusammen, um sie vor einfachen Scraper-Bots zu schützen
 */
function initContactProtection() {
    console.log('🔒 Contact Protection wird initialisiert...');

    // E-Mail-Teile (verschleiert gespeichert)
    const part1 = 'hello';
    const part2 = 'devpaniczone';
    const part3 = 'de';
    const email = part1 + String.fromCharCode(64) + part2 + '.' + part3;

    console.log('📧 E-Mail zusammengebaut:', email);

    // Kontaktdaten (verschleiert gespeichert)
    // const name = 'Bianca Schlich';
    // const street = 'Im Birkenacker';
    // const number = '12';
    // const zip = '51061';
    // const city = 'Köln';

    // === E-MAIL EINFÜGEN (NUR TEXT, NICHT KLICKBAR) ===
    const emailElements = [
        document.getElementById('contact-email'),
        document.getElementById('privacy-email'),
        document.getElementById('imprint-email')
    ];

    console.log('📍 Gefundene E-Mail Elemente:', emailElements.filter(el => el !== null).length);

    emailElements.forEach((element, index) => {
        if (element) {
            // Nur Text, kein Link
            element.textContent = email;
            console.log(`✅ E-Mail eingefügt in Element ${index + 1}`);
        }
    });

    // === KOMPLETTER KONTAKT-BLOCK (SICHER MIT DOM-MANIPULATION) ===
    const contactElement = document.getElementById('contact-person');
    console.log('📍 contact-person Element gefunden:', contactElement !== null);

    if (contactElement) {
        // Leeren
        contactElement.innerHTML = '';

        // Name (fett)
        // const nameStrong = document.createElement('strong');
        // nameStrong.textContent = name;
        // contactElement.appendChild(nameStrong);
        // contactElement.appendChild(document.createElement('br'));

        // Straße + Hausnummer
        // const streetText = document.createTextNode(street + ' ' + number);
        // contactElement.appendChild(streetText);
        // contactElement.appendChild(document.createElement('br'));

        // PLZ + Stadt
        // const cityText = document.createTextNode(zip + ' ' + city);
        // contactElement.appendChild(cityText);
        // contactElement.appendChild(document.createElement('br'));
        // contactElement.appendChild(document.createElement('br'));

        // E-Mail Label
        const emailLabel = document.createTextNode('E-Mail: ');
        contactElement.appendChild(emailLabel);

        // E-Mail (nur Text)
        const emailText = document.createTextNode(email);
        contactElement.appendChild(emailText);
        contactElement.appendChild(document.createElement('br'));

        // Website Label
        const websiteLabel = document.createTextNode('Website: ');
        contactElement.appendChild(websiteLabel);

        // Website (nur Text)
        const websiteText = document.createTextNode('https://devpaniczone.de');
        contactElement.appendChild(websiteText);

        console.log('✅ Kontakt-Block eingefügt (sicher mit DOM)');
    } else {
        console.log('❌ contact-person Element NICHT gefunden');
    }

    // === FÜR IMPRESSUM (GLEICHE SICHERE METHODE) ===
    const imprintContact = document.getElementById('imprint-contact');
    if (imprintContact) {
        imprintContact.innerHTML = '';

        const nameStrong = document.createElement('strong');
        nameStrong.textContent = name;
        imprintContact.appendChild(nameStrong);
        imprintContact.appendChild(document.createElement('br'));

        const streetText = document.createTextNode(street + ' ' + number);
        imprintContact.appendChild(streetText);
        imprintContact.appendChild(document.createElement('br'));

        const cityText = document.createTextNode(zip + ' ' + city);
        imprintContact.appendChild(cityText);
        imprintContact.appendChild(document.createElement('br'));
        imprintContact.appendChild(document.createElement('br'));

        const emailLabel = document.createTextNode('E-Mail: ');
        imprintContact.appendChild(emailLabel);
        const emailText = document.createTextNode(email);
        imprintContact.appendChild(emailText);
        imprintContact.appendChild(document.createElement('br'));

        const websiteLabel = document.createTextNode('Website: ');
        imprintContact.appendChild(websiteLabel);
        const websiteText = document.createTextNode('https://devpaniczone.de');
        imprintContact.appendChild(websiteText);

        console.log('✅ Impressum-Kontakt eingefügt (sicher mit DOM)');
    }
}

/**
 * Aktuelles Datum für Datenschutzerklärung einfügen
 */
function insertCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    console.log('📅 Datum-Element gefunden:', dateElement !== null);

    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // textContent statt innerHTML = sicherer
        dateElement.textContent = today.toLocaleDateString('de-DE', options);
        console.log('✅ Datum eingefügt:', dateElement.textContent);
    }
}

/**
 * Initialisierung für Legal-Pages
 */
function initLegalPages() {
    console.log('⚖️ Legal Pages Init gestartet');

    // Prüfen ob wir auf einer Legal-Page sind
    const isLegalPage = document.querySelector('.legal-date, #contact-email, #privacy-email, #imprint-email, #contact-person');

    console.log('📄 Ist Legal-Page?', isLegalPage !== null);

    if (isLegalPage) {
        initContactProtection();
        insertCurrentDate();
    } else {
        console.log('ℹ️ Keine Legal-Page, Script wird übersprungen');
    }
}

// === INITIALISIERUNG ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLegalPages);
    console.log('🔄 DOMContentLoaded Listener registriert');
} else {
    initLegalPages();
    console.log('🔄 DOM bereits geladen, direkt ausgeführt');
}

// Fallback
setTimeout(() => {
    console.log('🔄 Fallback-Check nach 100ms');
    const checkElement = document.getElementById('contact-person');
    if (checkElement && checkElement.innerHTML.trim() === '') {
        console.log('⚠️ Element leer, nochmal versuchen...');
        initLegalPages();
    }
}, 100);