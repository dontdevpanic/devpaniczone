/**
 * Scroll Spy für TOC (Linke Sidebar)
 * Hebt den aktiven Abschnitt beim Scrollen hervor
 */

class ScrollSpy {
    constructor() {
        this.tocLinks = document.querySelectorAll('.toc-list a');
        this.headings = [];
        this.currentActive = null;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        if (this.tocLinks.length === 0) {
            return; // Keine TOC auf dieser Seite
        }
        
        // Sammle alle Überschriften mit IDs
        this.tocLinks.forEach(link => {
            const id = link.getAttribute('href').substring(1); // Entferne #
            const heading = document.getElementById(id);
            
            if (heading) {
                this.headings.push({
                    id: id,
                    element: heading,
                    link: link
                });
            }
        });
        
        if (this.headings.length === 0) {
            return;
        }
        
        // Event Listeners
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onScroll(), { passive: true });
        
        // Initial Check
        this.updateActiveLink();
    }
    
    onScroll() {
        // Throttling für Performance
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateActiveLink();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    updateActiveLink() {
        // Finde die Überschrift, die gerade im Viewport ist
        const scrollPosition = window.scrollY + 100; // 100px Offset von oben
        
        let activeHeading = null;
        
        // Durchlaufe alle Überschriften von oben nach unten
        for (let i = 0; i < this.headings.length; i++) {
            const heading = this.headings[i];
            const headingTop = heading.element.offsetTop;
            
            if (scrollPosition >= headingTop) {
                activeHeading = heading;
            } else {
                break;
            }
        }
        
        // Wenn wir ganz unten sind, nimm die letzte Überschrift
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
            activeHeading = this.headings[this.headings.length - 1];
        }
        
        // Wenn keine gefunden, nimm die erste
        if (!activeHeading && this.headings.length > 0) {
            activeHeading = this.headings[0];
        }
        
        // Nur updaten wenn sich etwas geändert hat
        if (activeHeading && activeHeading !== this.currentActive) {
            this.setActiveLink(activeHeading);
        }
    }
    
    setActiveLink(activeHeading) {
        // Entferne .active von allen Links
        this.tocLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Setze .active auf den aktiven Link
        if (activeHeading && activeHeading.link) {
            activeHeading.link.classList.add('active');
            this.currentActive = activeHeading;
        }
    }
}

// Initialisiere Scroll Spy
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ScrollSpy();
    });
} else {
    new ScrollSpy();
}