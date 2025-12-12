document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // KLICK-DROPDOWN FUNKTIONALITÄT
    // ============================================

    const dropdownTriggers = document.querySelectorAll('.dropdown-click > a');

    // Hilfsfunktion: Dropdown öffnen/schließen
    function toggleDropdown(trigger) {
        const dropdown = trigger.parentElement;
        const isOpen = dropdown.classList.contains('open');

        // Alle anderen Dropdowns schließen
        document.querySelectorAll('.dropdown-click.open').forEach(open => {
            if (open !== dropdown) {
                open.classList.remove('open');
                const openTrigger = open.querySelector('a[aria-expanded]');
                if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Dieses Dropdown togglen
        dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', !isOpen);
    }

    // Hilfsfunktion: Alle Dropdowns schließen
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-click.open').forEach(open => {
            open.classList.remove('open');
            const trigger = open.querySelector('a[aria-expanded]');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    dropdownTriggers.forEach(trigger => {
        // Klick-Event
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDropdown(this);
        });

        // Keyboard-Event (Enter und Space)
        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(this);
            }
        });
    });

    // Klick außerhalb schließt alle Dropdowns
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown-click')) {
            closeAllDropdowns();
        }
    });

    // ESC-Taste schließt Dropdowns
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
});







// Haupt-Dropdowns
document.querySelectorAll('.dropdown-click > a').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
        e.preventDefault();
        const dropdown = this.parentElement;

        // Andere Haupt-Dropdowns schließen
        document.querySelectorAll('.dropdown-click.open').forEach(open => {
            if (open !== dropdown) {
                open.classList.remove('open');
                // Sub-Menüs auch schließen
                open.querySelectorAll('.dropdown-sub-click.open').forEach(sub => {
                    sub.classList.remove('open');
                });
            }
        });

        dropdown.classList.toggle('open');
    });
});

// Sub-Dropdowns
document.querySelectorAll('.dropdown-sub-click > a').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const subDropdown = this.parentElement;

        // Andere Sub-Dropdowns auf gleicher Ebene schließen
        const siblings = subDropdown.parentElement.querySelectorAll('.dropdown-sub-click.open');
        siblings.forEach(open => {
            if (open !== subDropdown) {
                open.classList.remove('open');
            }
        });

        subDropdown.classList.toggle('open');
    });
});

// Klick außerhalb schließt alles
document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown-click') && !e.target.closest('.dropdown-sub-click')) {
        document.querySelectorAll('.dropdown-click.open, .dropdown-sub-click.open').forEach(open => {
            open.classList.remove('open');
        });
    }
});





// ===================================
// SLIDE-DOWN DEMO
// ===================================
const hamburgerBtn = document.getElementById('hamburgerDemoBtn');
const mobileMenu = document.getElementById('mobileMenuDemo');

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('open');

        const isOpen = mobileMenu.classList.contains('open');
        this.setAttribute('aria-expanded', isOpen);
        this.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });
}

// ===================================
// SLIDE-IN DEMO
// ===================================
const hamburgerSlideBtn = document.getElementById('hamburgerSlideBtn');
const slideMenu = document.getElementById('slideMenuDemo');
const slideOverlay = document.getElementById('slideOverlayDemo');

if (hamburgerSlideBtn && slideMenu && slideOverlay) {
    hamburgerSlideBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        slideMenu.classList.toggle('open');
        slideOverlay.classList.toggle('active');

        const isOpen = slideMenu.classList.contains('open');
        this.setAttribute('aria-expanded', isOpen);
        this.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });

    // Klick auf Overlay schließt Menü
    slideOverlay.addEventListener('click', function () {
        hamburgerSlideBtn.classList.remove('active');
        slideMenu.classList.remove('open');
        slideOverlay.classList.remove('active');
        hamburgerSlideBtn.setAttribute('aria-expanded', 'false');
        hamburgerSlideBtn.setAttribute('aria-label', 'Menü öffnen');
    });
}




// ============================================
// MOBILE NAVIGATON HAMBURGER V1
// ============================================

// document.addEventListener('DOMContentLoaded', function () {
//     const hamburgerBtn = document.getElementById('hamburgerDemoBtn');
//     const mobileMenu = document.getElementById('mobileMenuDemo');

//     if (hamburgerBtn && mobileMenu) {
//         hamburgerBtn.addEventListener('click', function () {
//             // Button-Animation togglen
//             this.classList.toggle('active');

//             // Menü öffnen/schließen
//             mobileMenu.classList.toggle('open');

//             // Accessibility: aria-expanded aktualisieren
//             const isOpen = mobileMenu.classList.contains('open');
//             this.setAttribute('aria-expanded', isOpen);
//             this.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
//         });
//     }
// });