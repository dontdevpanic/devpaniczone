document.querySelectorAll('.entity-encoder').forEach(block => {
    const input = block.querySelector('.code-input');
    const output = block.querySelector('.code-output');
    const encodeBtn = block.querySelector('.encode-btn');
    const copyBtn = block.querySelector('.copy-btn');

    // Encode-Funktion
    function encodeText(str) {
        let encoded = '';
        for (let i = 0; i < str.length; i++) {
            encoded += '&#' + str.charCodeAt(i) + ';';
        }
        return encoded;
    }

    // Encode Button
    encodeBtn.addEventListener('click', () => {
        output.value = encodeText(input.value);
        output.focus();
        output.select();

        encodeBtn.classList.add('copied');
        encodeBtn.querySelector('.copy-text').textContent = 'Fertig!';
        setTimeout(() => {
            encodeBtn.classList.remove('copied');
            encodeBtn.querySelector('.copy-text').textContent = 'Encode';
        }, 1500);
    });

    // Copy Button
    copyBtn.addEventListener('click', () => {
        output.select();
        document.execCommand('copy');

        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-text').textContent = 'Kopiert!';
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.copy-text').textContent = 'Kopieren';
        }, 1500);
    });
});


document.querySelectorAll('.entity-decoder').forEach(block => {
    const input = block.querySelector('.code-input');
    const output = block.querySelector('.code-output');
    const decodeBtn = block.querySelector('.decode-btn');
    const copyBtn = block.querySelector('.copy-btn');

    // Decode-Funktion
    function decodeEntities(str) {
        return str.replace(/&#(\d+);/g, (match, dec) => {
            return String.fromCharCode(dec);
        });
    }

    // Decode Button
    decodeBtn.addEventListener('click', () => {
        output.value = decodeEntities(input.value);
        output.focus();
        output.select();

        decodeBtn.classList.add('copied');
        decodeBtn.querySelector('.copy-text').textContent = 'Fertig!';
        setTimeout(() => {
            decodeBtn.classList.remove('copied');
            decodeBtn.querySelector('.copy-text').textContent = 'Decode';
        }, 1500);
    });

    // Copy Button
    copyBtn.addEventListener('click', () => {
        output.select();
        document.execCommand('copy');

        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-text').textContent = 'Kopiert!';
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.copy-text').textContent = 'Kopieren';
        }, 1500);
    });
});