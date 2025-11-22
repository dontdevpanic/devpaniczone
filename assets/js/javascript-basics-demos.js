/**
 * Tutorial Demo Scripts für JavaScript Basics
 * DevPanicZone - Don't DevPanic. Cheat.
 * 
 * Alle interaktiven Demo-Funktionen für das JavaScript-Basics Tutorial.
 * Keine inline event handlers - alles über addEventListener!
 */

// Variable Demo
let gespeicherterWert;

function speichereVariable() {
    let input = document.getElementById("userInput").value;
    gespeicherterWert = input;
    document.getElementById("variableOutput").innerHTML = 
        `✅ Gespeichert in Variable: <strong>gespeicherterWert = "${gespeicherterWert}"</strong>`;
}

function zeigeVariable() {
    if (gespeicherterWert !== undefined) {
        document.getElementById("variableOutput").innerHTML = 
            `📦 Variable enthält: <strong>"${gespeicherterWert}"</strong>`;
    } else {
        document.getElementById("variableOutput").innerHTML = 
            `⚠️ Variable ist noch <strong>undefined</strong> - erst speichern!`;
    }
}

// Function Demo
function berechneAddition() {
    let num1 = parseFloat(document.getElementById("num1").value);
    let num2 = parseFloat(document.getElementById("num2").value);
    let ergebnis = num1 + num2;
    
    document.getElementById("functionOutput").innerHTML = 
        `<strong>Funktion ausgeführt:</strong><br>
        addiere(${num1}, ${num2}) = <strong>${ergebnis}</strong>`;
}

// Condition Demo
function pruefeAlter() {
    let alter = parseInt(document.getElementById("ageInput").value);
    let output = document.getElementById("conditionOutput");
    
    if (isNaN(alter)) {
        output.innerHTML = "⚠️ Bitte gib eine Zahl ein!";
        return;
    }
    
    if (alter >= 18) {
        output.innerHTML = `✅ Mit ${alter} Jahren bist du <strong>volljährig</strong>!`;
    } else {
        output.innerHTML = `🔒 Mit ${alter} Jahren bist du noch <strong>minderjährig</strong>.`;
    }
}

// Loop Demo
function zeigeSchleife() {
    let output = "<strong>For-Schleife läuft:</strong><br><br>";
    for (let i = 1; i <= 5; i++) {
        output += `Durchlauf ${i}: i = ${i}<br>`;
    }
    document.getElementById("loopOutput").innerHTML = output;
}

// DOM Manipulation Demo
let farbIndex = 0;
let farben = ["#344149ff", "#635b4eff", "#5e4462ff", "#344e4cff"];
let hatKlasse = false;

function aendereText() {
    let texte = [
        "Text wurde geändert! 🎉",
        "Noch ein neuer Text!",
        "JavaScript macht Spaß! 😊",
        "Dieser Text kann geändert werden!"
    ];
    let randomText = texte[Math.floor(Math.random() * texte.length)];
    document.getElementById("demoText").textContent = randomText;
}

function aendereFarbe() {
    farbIndex = (farbIndex + 1) % farben.length;
    document.getElementById("demoBox").style.backgroundColor = farben[farbIndex];
}

function toggleKlasse() {
    let box = document.getElementById("demoBox");
    if (hatKlasse) {
        box.style.border = "none";
        box.style.transform = "scale(1)";
        hatKlasse = false;
    } else {
        box.style.border = "4px solid var(--heading-primary)";
        box.style.transform = "scale(1.05)";
        hatKlasse = true;
    }
}

// Array Demo
function zeigeGeradeZahlen() {
    let zahlen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let gerade = zahlen.filter(zahl => zahl % 2 === 0);
    document.getElementById("arrayOutput").innerHTML = 
        `<strong>.filter()</strong> → Nur gerade Zahlen: <strong>[${gerade.join(", ")}]</strong>`;
}

function verdoppleZahlen() {
    let zahlen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let verdoppelt = zahlen.map(zahl => zahl * 2);
    document.getElementById("arrayOutput").innerHTML = 
        `<strong>.map()</strong> → Alle verdoppelt: <strong>[${verdoppelt.join(", ")}]</strong>`;
}

function berechneArraySumme() {
    let zahlen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let summe = zahlen.reduce((acc, zahl) => acc + zahl, 0);
    document.getElementById("arrayOutput").innerHTML = 
        `<strong>.reduce()</strong> → Summe aller Zahlen: <strong>${summe}</strong>`;
}

// Event Listeners initialisieren wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", function() {
    
    // Variable Demo Buttons
    let speichernBtn = document.getElementById("speichernBtn");
    let zeigenBtn = document.getElementById("zeigenBtn");
    if (speichernBtn) speichernBtn.addEventListener("click", speichereVariable);
    if (zeigenBtn) zeigenBtn.addEventListener("click", zeigeVariable);
    
    // Function Demo Button
    let additionBtn = document.getElementById("additionBtn");
    if (additionBtn) additionBtn.addEventListener("click", berechneAddition);
    
    // Condition Demo Button
    let alterBtn = document.getElementById("alterBtn");
    if (alterBtn) alterBtn.addEventListener("click", pruefeAlter);
    
    // Loop Demo Button
    let schleifeBtn = document.getElementById("schleifeBtn");
    if (schleifeBtn) schleifeBtn.addEventListener("click", zeigeSchleife);
    
    // DOM Manipulation Demo Buttons
    let textBtn = document.getElementById("textBtn");
    let farbeBtn = document.getElementById("farbeBtn");
    let klasseBtn = document.getElementById("klasseBtn");
    if (textBtn) textBtn.addEventListener("click", aendereText);
    if (farbeBtn) farbeBtn.addEventListener("click", aendereFarbe);
    if (klasseBtn) klasseBtn.addEventListener("click", toggleKlasse);
    
    // Array Demo Buttons
    let geradeBtn = document.getElementById("geradeBtn");
    let verdoppelBtn = document.getElementById("verdoppelBtn");
    let summeBtn = document.getElementById("summeBtn");
    if (geradeBtn) geradeBtn.addEventListener("click", zeigeGeradeZahlen);
    if (verdoppelBtn) verdoppelBtn.addEventListener("click", verdoppleZahlen);
    if (summeBtn) summeBtn.addEventListener("click", berechneArraySumme);
    
    // Event Demo - Click Counter und Input Tracking
    let eventButton = document.getElementById("eventButton");
    let eventInput = document.getElementById("eventInput");
    let eventOutput = document.getElementById("eventOutput");
    let clickCount = 0;
    
    if (eventButton) {
        eventButton.addEventListener("click", function() {
            clickCount++;
            eventOutput.innerHTML = 
                `🖱️ <strong>Click-Event!</strong><br>Button wurde ${clickCount}x geklickt`;
        });
    }
    
    if (eventInput) {
        eventInput.addEventListener("input", function(e) {
            eventOutput.innerHTML = 
                `⌨️ <strong>Input-Event!</strong><br>Du hast getippt: "${e.target.value}"`;
        });
    }
});