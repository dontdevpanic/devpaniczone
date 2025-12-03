document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // CLICK-DROPDOWN FUNKTIONALITÄT
    // ============================================

    // Haupt-Dropdowns (.dropdown-click)
    document.querySelectorAll('.dropdown-click > a').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();                     // Link-Verhalten verhindern

            const dropdown = this.parentElement;    // Das li.dropdown-click

            // Alle anderen Haupt-Dropdowns schließen
            document.querySelectorAll('.dropdown-click.open').forEach(open => {
                if (open !== dropdown) {
                    open.classList.remove('open');
                    // Sub-Menüs auch schließen
                    open.querySelectorAll('.dropdown-sub-click.open').forEach(sub => {
                        sub.classList.remove('open');
                    });
                }
            });

            // Dieses Dropdown togglen
            dropdown.classList.toggle('open');
        });
    });

    // Sub-Dropdowns (.dropdown-sub-click)
    document.querySelectorAll('.dropdown-sub-click > a').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();                    // Verhindert Schließen des Haupt-Dropdowns

            const subDropdown = this.parentElement;

            // Andere Sub-Dropdowns auf gleicher Ebene schließen
            const siblings = subDropdown.parentElement.querySelectorAll('.dropdown-sub-click.open');
            siblings.forEach(open => {
                if (open !== subDropdown) {
                    open.classList.remove('open');
                }
            });

            // Dieses Sub-Dropdown togglen
            subDropdown.classList.toggle('open');
        });
    });

    // Klick außerhalb schließt alle Dropdowns
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown-click') && !e.target.closest('.dropdown-sub-click')) {
            document.querySelectorAll('.dropdown-click.open, .dropdown-sub-click.open').forEach(open => {
                open.classList.remove('open');
            });
        }
    });
});