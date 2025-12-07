// Demo 1: const vs let
document.getElementById('demoConstBtn').addEventListener('click', function () {
    const output = document.getElementById('demoOutput1');
    try {
        const CONSTANT_VALUE = "Ich bin konstant!";
        CONSTANT_VALUE = "Versuch mich zu ändern!"; // Das gibt einen Fehler
    } catch (error) {
        output.innerHTML = `
                    <p class="error-message"><strong>❌ Fehler mit const:</strong></p>
                    <p>${error.message}</p>
                    <p>const-Variablen können nicht neu zugewiesen werden!</p>
                `;
    }
});

document.getElementById('demoLetBtn').addEventListener('click', function () {
    const output = document.getElementById('demoOutput1');
    let mutableValue = "Ich bin veränderbar!";
    mutableValue = "Ich wurde geändert!";
    output.innerHTML = `
                <p class="success-message"><strong>✅ Erfolg mit let:</strong></p>
                <p>Alter Wert: "Ich bin veränderbar!"</p>
                <p>Neuer Wert: "${mutableValue}"</p>
                <p>let-Variablen können neu zugewiesen werden!</p>
            `;
});

document.getElementById('demoResetBtn').addEventListener('click', function () {
    document.getElementById('demoOutput1').innerHTML = '<p>Klicke auf die Buttons, um zu sehen, was passiert...</p>';
});

// Demo 2: Block Scope
document.getElementById('scopeTestBtn').addEventListener('click', function () {
    const output = document.getElementById('demoOutput2');
    let results = [];

    // Globale Variable
    const globalVar = "Ich bin global";

    // Block Scope Test
    if (true) {
        const blockVar = "Ich bin im Block";
        let blockLet = "Ich auch!";
        results.push(`Innerhalb des Blocks:<br>globalVar = "${globalVar}"<br>blockVar = "${blockVar}"<br>blockLet = "${blockLet}"`);
    }

    // Außerhalb des Blocks
    results.push(`Außerhalb des Blocks:<br>globalVar = "${globalVar}"`);

    try {
        console.log(blockVar); // Das gibt einen Fehler
    } catch (error) {
        results.push(`<span class="error-message">blockVar ist außerhalb nicht verfügbar! (ReferenceError)</span>`);
    }

    output.innerHTML = results.join('<br><br>');
});

// Demo 3: Counter
let counter = 0;

document.getElementById('incrementBtn').addEventListener('click', function () {
    counter++;
    document.getElementById('counterValue').textContent = counter;
});

document.getElementById('decrementBtn').addEventListener('click', function () {
    counter--;
    document.getElementById('counterValue').textContent = counter;
});

document.getElementById('resetCounterBtn').addEventListener('click', function () {
    counter = 0;
    document.getElementById('counterValue').textContent = counter;
});
