# DevPanicZone

**Don't DevPanic. Cheat.**

A growing collection of web development tutorials and cheatsheets - built as a personal learning lab and reference for day-to-day use.

[![Visit devpaniczone.de](https://img.shields.io/badge/visit-devpaniczone.de-steelblue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://devpaniczone.de/) &nbsp; &nbsp; [![Repo](https://img.shields.io/badge/repository-darkred?style=for-the-badge&logo=github)](https://github.com/dontdevpanic/devpaniczone)

[Zur deutschen Version](#deutsche-version)

---

## About the Project

DevPanicZone is my way back into active web development. After years of working mainly with WordPress custom CSS, I wanted to bring my HTML and CSS skills up to date - and learn JavaScript and PHP from scratch along the way.

The project serves two purposes:

- **Learning journal**: Document concepts in a way I'll still understand six months from now
- **Reference tool**: Practical cheatsheets for everyday use

---

## Features

- Tutorials covering HTML, CSS, Bootstrap, JavaScript, and PHP
- Integrated search with dropdown quick-search and full search index
- Auto-generated navigation (header dropdowns, footer, breadcrumbs, sidebar, prev/next buttons across categories)
- Interactive JavaScript tools (Live Code Editor, HTML Code Escaper, Entity Encoder, To-Do App)
- WCAG 2.1 AA compliant - semantic HTML, ARIA attributes, color contrast verified
- Modular CSS architecture with CSS custom properties and dark/light mode
- GDPR-compliant - syntax highlighting via locally hosted Prism.js
- Custom SVG sprite system for theme-aware icons

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5 |
| Build tooling | Node.js, npm |
| Navigation automation | Custom `generate-navigation.js` for site-wide nav updates |
| Code formatting | Prettier (runs automatically as part of `npm run build`) |
| Search | Custom search index generated at build time (`search-index.json`) |
| Syntax highlighting | Prism.js (locally hosted) |
| Icons | Custom SVG sprite system |
| Deployment | FTP to All-Inkl shared hosting |

---

## Project Structure

```
root/
├── index.html
├── glossary.html
├── search/
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
    │   ├── index.html
    │   ├── html-basics/
    │   └── html-advanced/
    ├── css/
    │   ├── index.html
    │   ├── css-basics/
    │   ├── css-advanced/
    │   └── css-specials/
    ├── bootstrap/
    │   ├── index.html
    │   ├── bootstrap-basics/
    │   ├── bootstrap-components/
    │   ├── bootstrap-navigation/
    │   ├── bootstrap-forms/
    │   ├── bootstrap-interactive/
    │   └── bootstrap-extras/
    ├── javascript/
    │   ├── index.html
    │   ├── javascript-basics/
    │   ├── javascript-advanced/
    │   └── javascript-projects/
    ├── php/
    │   ├── index.html
    │   ├── php-basics/
    │   └── php-advanced/
    ├── misc/
    │   ├── index.html
    │   ├── seo-optimization/
    │   ├── tools/
    │   ├── projects/
    │   ├── web/
    │   └── sample-pages/
    └── documentation/
        ├── index.html
        ├── devpaniczone/
        └── sample-pages/
```

---

## How the Build System Works

`npm run build` runs three steps automatically:

1. **`generate-navigation.js`** - updates all navigation elements site-wide (header dropdowns, footer, breadcrumbs, sidebar, prev/next buttons, tutorial grids) based on `TUTORIAL_ORDER` and `CATEGORY_NAMES` configuration
2. **Search index generation** - creates `assets/data/search-index.json` and `assets/data/tutorials.json` from all tutorial content
3. **Prettier** - formats all HTML files consistently

> Note: The generated data files (`search-index.json`, `tutorials.json`) must be re-uploaded to the server via FTP after each build that adds or renames tutorials.

---

## Current Status

🚧 **Work in Progress** - this project grows alongside my learning.

**Currently available:**
- HTML fundamentals and semantic structure
- CSS tutorials (Flexbox, Grid, Responsive Design)
- Git introduction
- JavaScript tools (Live Code Editor, HTML Code Escaper, Entity Encoder, To-Do App)

**In progress:**
- JavaScript basics series
- PHP tutorials
- Advanced CSS techniques (Container Queries, `clamp()`)

---

## What I'm Learning

- Modern HTML5 semantics and ARIA attributes
- CSS custom properties and modular architecture
- JavaScript for DOM manipulation and build automation
- Accessibility (WCAG 2.1 AA) and systematic testing
- Git version control and professional documentation

---

## Local Setup

```bash
git clone https://github.com/dontdevpanic/devpaniczone.git
cd devpaniczone
npm install
npm run build
```

---

## Contributing

This is a personal project and learning journal - it's not set up for external contributions. That said, if you spot a mistake or have a suggestion, feel free to open an issue. Feedback is always welcome.

---

## License

MIT - see [LICENSE](LICENSE) for details.

---

*Built with a lot of coffee and even more debugging.* ☕


---

## Deutsche Version

[⬆︎ Back to English](#devpaniczone)

# DevPanicZone

**Don't DevPanic. Cheat.**

Eine wachsende Sammlung von Web-Development-Tutorials und Cheatsheets - entstanden als persönliches Lernlabor und Nachschlagewerk für den täglichen Gebrauch.

[![Visit devpaniczone.de](https://img.shields.io/badge/visit-devpaniczone.de-steelblue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://devpaniczone.de/) &nbsp; &nbsp; [![Repo](https://img.shields.io/badge/repository-darkred?style=for-the-badge&logo=github)](https://github.com/dontdevpanic/devpaniczone)

---

## Über das Projekt

DevPanicZone ist mein Weg zurück in die aktive Webentwicklung. Nach Jahren mit hauptsächlich WordPress Custom CSS wollte ich meine HTML- und CSS-Kenntnisse auf den aktuellen Stand bringen - und dabei JavaScript und PHP von Grund auf lernen.

Das Projekt dient zwei Zwecken:

- **Lerntagebuch**: Konzepte so dokumentieren, dass ich sie in sechs Monaten noch verstehe
- **Nachschlagewerk**: Praktische Cheatsheets für den täglichen Gebrauch

---

## Features

- Tutorials zu HTML, CSS, Bootstrap, JavaScript und PHP
- Integrierte Suchfunktion mit Dropdown-Schnellsuche und vollständigem Suchindex
- Automatisch generierte Navigation (Header-Dropdowns, Footer, Breadcrumbs, Sidebar, kategorieübergreifende Vor/Zurück-Buttons)
- Interaktive JavaScript-Tools (Live Code Editor, HTML Code Escaper, Entity Encoder, To-Do App)
- WCAG 2.1 AA konform - semantisches HTML, ARIA-Attribute, Farbkontraste geprüft
- Modulare CSS-Architektur mit CSS Custom Properties und Dark/Light Mode
- DSGVO-konform - Syntax-Highlighting mit lokal gehostetem Prism.js
- Custom SVG-Sprite-System für theme-fähige Icons

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5 |
| Build-Tools | Node.js, npm |
| Navigations-Automatisierung | Custom `generate-navigation.js` für siteweite Nav-Updates |
| Code-Formatierung | Prettier (läuft automatisch als Teil von `npm run build`) |
| Suche | Custom Suchindex wird beim Build generiert (`search-index.json`) |
| Syntax-Highlighting | Prism.js (lokal gehostet) |
| Icons | Custom SVG-Sprite-System |
| Deployment | FTP auf All-Inkl Shared Hosting |

---

## Projektstruktur

```
root/
├── index.html
├── glossary.html
├── search/
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
    │   ├── index.html
    │   ├── html-basics/
    │   └── html-advanced/
    ├── css/
    │   ├── index.html
    │   ├── css-basics/
    │   ├── css-advanced/
    │   └── css-specials/
    ├── bootstrap/
    │   ├── index.html
    │   ├── bootstrap-basics/
    │   ├── bootstrap-components/
    │   ├── bootstrap-navigation/
    │   ├── bootstrap-forms/
    │   ├── bootstrap-interactive/
    │   └── bootstrap-extras/
    ├── javascript/
    │   ├── index.html
    │   ├── javascript-basics/
    │   ├── javascript-advanced/
    │   └── javascript-projects/
    ├── php/
    │   ├── index.html
    │   ├── php-basics/
    │   └── php-advanced/
    ├── misc/
    │   ├── index.html
    │   ├── seo-optimization/
    │   ├── tools/
    │   ├── projects/
    │   ├── web/
    │   └── sample-pages/
    └── documentation/
        ├── index.html
        ├── devpaniczone/
        └── sample-pages/
```

---

## Wie das Build-System funktioniert

`npm run build` führt automatisch drei Schritte aus:

1. **`generate-navigation.js`** - aktualisiert alle Navigationselemente seitenübergreifend (Header-Dropdowns, Footer, Breadcrumbs, Sidebar, Vor/Zurück-Buttons, Tutorial-Grids) anhand der Konfiguration in `TUTORIAL_ORDER` und `CATEGORY_NAMES`
2. **Suchindex-Generierung** - erstellt `assets/data/search-index.json` und `assets/data/tutorials.json` aus allen Tutorial-Inhalten
3. **Prettier** - formatiert alle HTML-Dateien einheitlich

> Hinweis: Die generierten Datendateien (`search-index.json`, `tutorials.json`) müssen nach jedem Build, der neue Tutorials hinzufügt oder umbenennt, erneut per FTP auf den Server hochgeladen werden.

---

## Status

🚧 **Work in Progress** - dieses Projekt wächst kontinuierlich mit meinem Lernfortschritt.

**Aktuell verfügbar:**
- HTML-Grundlagen und semantische Struktur
- CSS-Tutorials (Flexbox, Grid, Responsive Design)
- Git-Einführung
- JavaScript-Tools (Live Code Editor, HTML Code Escaper, Entity Encoder, To-Do App)

**In Arbeit:**
- JavaScript-Grundlagen-Serie
- PHP-Tutorials
- Erweiterte CSS-Techniken (Container Queries, `clamp()`)

---

## Was ich dabei lerne

- Moderne HTML5-Semantik und ARIA-Attribute
- CSS Custom Properties und modulare Architektur
- JavaScript für DOM-Manipulation und Build-Automatisierung
- Barrierefreiheit (WCAG 2.1 AA) und systematisches Testen
- Git-Versionskontrolle und professionelle Dokumentation

---

## Lokale Installation

```bash
git clone https://github.com/dontdevpanic/devpaniczone.git
cd devpaniczone
npm install
npm run build
```

---

## Contributing

Das ist ein persönliches Projekt und Lerntagebuch - für externe Beiträge ist es nicht eingerichtet. Falls du einen Fehler entdeckst oder eine Anmerkung hast, kannst du gerne ein Issue öffnen. Feedback ist immer willkommen.

---

## Lizenz

MIT - siehe [LICENSE](LICENSE) für Details.

---

*Erstellt mit viel Kaffee und noch mehr Debugging.* ☕