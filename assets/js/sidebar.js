// ===================================
// FLOATING SIDEBAR SYSTEM
// ===================================

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // LINKE SIDEBAR (TOC/Anchors)
    // ===================================

    const sidebar = document.getElementById('tutorialSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Öffne linke Sidebar
    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add('is-open');
            overlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }
    }

    // Schließe linke Sidebar
    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    }

    // Event Listeners für linke Sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', openSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    // ===================================
    // RECHTE SIDEBAR (Tutorial Navigation) - OPTIONAL
    // ===================================

    const tutorialRelated = document.querySelector('.tutorial-related');
    const tutorialNavToggle = document.getElementById('tutorialNavToggle');

    // Öffne rechte Sidebar
    function openTutorialNav() {
        if (tutorialRelated) {
            tutorialRelated.classList.add('is-open');
            overlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }
    }

    // Schließe rechte Sidebar
    function closeTutorialNav() {
        if (tutorialRelated) {
            tutorialRelated.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        }
    }

    // Event Listeners für rechte Sidebar
    if (tutorialNavToggle) {
        tutorialNavToggle.addEventListener('click', openTutorialNav);
    }



    // ===================================
    // GEMEINSAME FUNKTIONEN
    // ===================================

    // Schließe bei Klick auf Overlay
    overlay.addEventListener('click', () => {
        closeSidebar();
        closeTutorialNav();
    });

    // Schließe bei ESC Taste
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
            closeTutorialNav();
        }
    });

    // Schließe Sidebars wenn TOC-Link geklickt wird
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeSidebar();
        });
    });

    // ===================================
    // ACTIVE LINK TRACKING (Scroll Spy)
    // ===================================

    const sections = document.querySelectorAll('.content-section[id]');
    const navLinks = document.querySelectorAll('.toc-link');

    function highlightActiveLink() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink();

    // ===================================
    // SMOOTH SCROLL MIT OFFSET
    // ===================================

    tocLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('✅ Floating Sidebar System geladen!');
});