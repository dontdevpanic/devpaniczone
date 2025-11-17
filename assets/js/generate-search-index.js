const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Konfiguration
const CONFIG = {
    tutorialsDir: path.join(__dirname, '../tutorials'),
    glossaryFile: path.join(__dirname, '../glossary.html'),
    outputFile: path.join(__dirname, '../assets/data/search-index.json'),
    categories: {
        'html': 'HTML',
        'css': 'CSS',
        'bootstrap': 'Bootstrap',
        'javascript': 'JavaScript',
        'php': 'PHP',
        'misc': 'Verschiedenes'
    }
};

// Hilfsfunktion: Text bereinigen
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 200); // Erste 200 Zeichen für Excerpt
}

// Hilfsfunktion: Alle HTML-Dateien in einem Verzeichnis finden
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') && file !== 'index.html') {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Tutorial-Seite analysieren
function parseTutorial(filePath) {
    try {
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        // Titel extrahieren
        const h1 = doc.querySelector('h1');
        const title = h1 ? h1.textContent.trim() : path.basename(filePath, '.html');
        
        // Kategorie aus Pfad bestimmen
        const relativePath = path.relative(CONFIG.tutorialsDir, filePath);
        const categoryKey = relativePath.split(path.sep)[0];
        const category = CONFIG.categories[categoryKey] || 'Verschiedenes';
        
        // URL generieren
        const url = '/' + relativePath.replace(/\\/g, '/');
        
        // Ersten Text-Absatz für Excerpt finden
        const firstP = doc.querySelector('main p, .content p, article p');
        const excerpt = firstP ? cleanText(firstP.textContent) : '';
        
        // Alle H2-Überschriften für zusätzliche Suchbegriffe
        const headings = Array.from(doc.querySelectorAll('h2'))
            .map(h => h.textContent.trim())
            .filter(h => h.length > 0);
        
        // Suchbaren Text zusammenstellen
        const searchableText = [
            title,
            ...headings,
            excerpt
        ].join(' ').toLowerCase();
        
        return {
            title,
            url,
            category,
            excerpt,
            headings,
            searchableText,
            type: 'tutorial'
        };
    } catch (error) {
        console.error(`Fehler beim Parsen von ${filePath}:`, error.message);
        return null;
    }
}

// Glossar analysieren
function parseGlossary() {
    try {
        const html = fs.readFileSync(CONFIG.glossaryFile, 'utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        const entries = [];
        const glossaryItems = doc.querySelectorAll('.glossary-term');
        
        glossaryItems.forEach(item => {
            const term = item.querySelector('.term-name')?.textContent.trim();
            const definition = item.querySelector('.term-definition')?.textContent.trim();
            const category = item.getAttribute('data-category') || 'Allgemein';
            
            if (term && definition) {
                entries.push({
                    title: term,
                    url: `/glossary.html#${term.toLowerCase().replace(/\s+/g, '-')}`,
                    category: 'Glossar',
                    excerpt: cleanText(definition),
                    searchableText: `${term} ${definition} ${category}`.toLowerCase(),
                    type: 'glossary',
                    glossaryCategory: category
                });
            }
        });
        
        console.log(`✓ ${entries.length} Glossar-Einträge gefunden`);
        return entries;
    } catch (error) {
        console.error('Fehler beim Parsen des Glossars:', error.message);
        return [];
    }
}

// Hauptfunktion
function generateSearchIndex() {
    console.log('🔍 Generiere Search-Index...\n');
    
    const searchIndex = [];
    
    // Tutorials durchsuchen
    console.log('📚 Durchsuche Tutorials...');
    const tutorialFiles = findHtmlFiles(CONFIG.tutorialsDir);
    
    tutorialFiles.forEach(filePath => {
        const result = parseTutorial(filePath);
        if (result) {
            searchIndex.push(result);
        }
    });
    
    console.log(`✓ ${searchIndex.length} Tutorials gefunden\n`);
    
    // Glossar hinzufügen
    console.log('📖 Durchsuche Glossar...');
    const glossaryEntries = parseGlossary();
    searchIndex.push(...glossaryEntries);
    
    console.log(`\n✓ Gesamt: ${searchIndex.length} Einträge im Search-Index\n`);
    
    // Ausgabeverzeichnis erstellen
    const outputDir = path.dirname(CONFIG.outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Index speichern
    fs.writeFileSync(
        CONFIG.outputFile,
        JSON.stringify(searchIndex, null, 2),
        'utf-8'
    );
    
    console.log(`✅ Search-Index gespeichert: ${CONFIG.outputFile}`);
    
    // Statistik
    const tutorialCount = searchIndex.filter(item => item.type === 'tutorial').length;
    const glossaryCount = searchIndex.filter(item => item.type === 'glossary').length;
    
    console.log('\n📊 Statistik:');
    console.log(`   - Tutorials: ${tutorialCount}`);
    console.log(`   - Glossar: ${glossaryCount}`);
    console.log(`   - Gesamt: ${searchIndex.length}`);
}

// Script ausführen
generateSearchIndex();