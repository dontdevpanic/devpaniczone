# DevPanicZone

**Don't DevPanic. Cheat.**

Eine Sammlung von Web-Development-Tutorials und Cheatsheets - entstanden als persönliches Lernprojekt und Nachschlagewerk.

## Über das Projekt

DevPanicZone ist mein Weg zurück in die aktive Webentwicklung. Nach Jahren mit hauptsächlich WordPress Custom CSS wollte ich meine HTML- und CSS-Kenntnisse auf den aktuellen Stand bringen und gleichzeitig JavaScript und PHP von Grund auf lernen.

Das Projekt dient zwei Zwecken:
- **Lerntagebuch**: Konzepte so dokumentieren, dass ich sie in sechs Monaten noch verstehe
- **Nachschlagewerk**: Praktische Cheatsheets für den täglichen Gebrauch

## Features

- 📚 Tutorials zu HTML, CSS, Bootstrap, JavaScript und PHP
- 🔍 Integrierte Suchfunktion mit Dropdown-Schnellsuche
- 🧭 Automatisch generierte Navigation (Header, Footer, Breadcrumbs, Sidebar)
- ♿ Fokus auf semantisches HTML und Barrierefreiheit
- 🎨 Modulare CSS-Architektur
- 🔒 DSGVO-konform (lokal gehostetes Syntax-Highlighting mit Prism.js)

## Tech Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5
- **Build-Tools**: Node.js, npm
- **Automatisierung**: Custom `generate-navigation.js` für Site-weite Updates
- **Syntax Highlighting**: Prism.js (lokal gehostet)

## Projektstruktur
```
root/
├── index.html
├── search
├── glossary.html
├── scripts/
├── assets/
│   ├── css/
│   ├── data/
│   ├── fonts/
│   ├── graphics/
│   ├── icons/
│   ├── images/
│   ├── js/
│   └── vendor/
│
└── tutorials/
    ├── html/
    │   └── index.html
    │       ├── html-basics/
    │       └── html-advanced/
    ├── css/
    │   └── index.html
    │       ├── css-basics/
    │       ├── css-advanced/
    │       └── css-specials/
    ├── bootstrap/
    │   └── index.html
    │       ├── bootstrap-basics/
    │       ├── bootstrap-components/
    │       ├── bootstrap-navigation/
    │       ├── bootstrap-forms/
    │       ├── bootstrap-interactive/
    │       └── bootstrap-extras/
    ├── javascript/
    │   └── index.html
    │       ├── javascript-basics/
    │       ├── javascript-advanced/
    │       └── javascript-projects/
    ├── php/
    │   └── index.html
    │       ├── php-basics/
    │       └── php-advanced/
    ├── python/                  // ggf. später
    │   └── index.html
    │       ├── python-basics/
    │       └── python-advanced/
    ├── misc/
    │    └── index.html
    │       ├── seo-optimization/
    │       ├── tools/
    │       ├── projects/
    │       ├── web/
    │       └── sample-pages/
    └── documentaion/
            └── index.html
               ├── devpaniczone/
               ├── automatation/ // ggf. später
               ├── design/       // ggf. später
               ├── templates/    // ggf. später
               └── sample-pages/
```

## Status

🚧 **Work in Progress** - Dieses Projekt wächst kontinuierlich mit meinem Lernfortschritt.

**Aktuell verfügbar:**
- HTML-Grundlagen und semantische Struktur
- CSS-Tutorials (Flexbox, Grid, Responsive Design)
- Git-Einführung

**In Arbeit:**
- JavaScript-Grundlagen
- PHP-Tutorials
- Erweiterte CSS-Techniken (Container Queries, clamp())

## Was ich dabei lerne

- Moderne HTML5-Semantik und ARIA-Attribute
- CSS Custom Properties und modulare Architektur
- JavaScript für DOM-Manipulation und Build-Automatisierung
- Systematisches Debugging und Code-Organisation
- Git-Versionskontrolle

## Lokale Installation
```bash
git clone https://github.com/dontdevpanic/devpaniczone.git
cd devpaniczone
npm install
npm run build
```

## Lizenz

MIT - siehe [LICENSE](LICENSE) für Details.

---

*Erstellt mit viel Kaffee und noch mehr Debugging.* ☕