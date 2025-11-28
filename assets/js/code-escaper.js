document.querySelectorAll('.html-escaper').forEach(block => {
    const input = block.querySelector('.code-input');
    const output = block.querySelector('.code-output');
    const escapeBtn = block.querySelector('.escape-btn');
    const copyBtn = block.querySelector('.copy-btn');

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    escapeBtn.addEventListener('click', () => {
        const escaped = escapeHTML(input.value);
        output.value = escaped;
        output.focus();
        output.select();

        escapeBtn.classList.add('copied');
        escapeBtn.querySelector('.copy-text').textContent = 'Fertig!';
        setTimeout(() => {
            escapeBtn.classList.remove('copied');
            escapeBtn.querySelector('.copy-text').textContent = 'Escapen';
        }, 1500);
    });

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