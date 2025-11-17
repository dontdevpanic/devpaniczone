// ===================================
// CODE COPY BUTTON - NUR MODERNE BROWSER
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.code-copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeBlock = button.closest('.code-block');
            const codeElement = codeBlock.querySelector('code');
            const codeText = codeElement.textContent;
            
            // Prüfe ob Clipboard API verfügbar ist
            if (!navigator.clipboard) {
                console.warn('Clipboard API nicht verfügbar');
                return;
            }
            
            try {
                await navigator.clipboard.writeText(codeText);
                
                // Success Feedback
                const copyIcon = button.querySelector('.copy-icon');
                const copyText = button.querySelector('.copy-text');
                const originalText = copyText.textContent;
                const originalIcon = copyIcon.innerHTML;
                
                // copyIcon.innerHTML = '<img src="/assets/checkmark.svg" alt="" width="16" height="16">';
                copyIcon.innerHTML = '<img src="/assets/icons/clipboard.svg" alt="" width="16" height="16">';
                copyText.textContent = 'Kopiert!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    copyIcon.innerHTML = originalIcon;
                    copyText.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
                
            } catch (err) {
                console.error('Fehler beim Kopieren:', err);
            }
        });
    });
});