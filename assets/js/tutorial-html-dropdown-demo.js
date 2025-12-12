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