// === SICHERHEITSWARNUNG (Immer zuerst!) ===
console.log('%c⚠️ Console-Warnung', 
    'color: #ff6b6b; font-size: 18px; font-weight: bold;');
console.log('%cFalls dich jemand gebeten hat, Code hier einzufügen: DON\'T! ' +
            'Das könnte ein Betrugsversuch sein.',
    'color: #f06595; font-size: 13px;');
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
console.log('%c📫 hello@devpaniczone.de', 
    'color: #f38181; font-size: 11px;');

// Theme Icon Pfade (deine SVG-Dateien)
const THEME_ICONS = {
    dark: '/assets/icons/light-mode.svg',
    light: '/assets/icons/dark-mode.svg'
};

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