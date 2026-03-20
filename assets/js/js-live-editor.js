/* ===============================================================================
   LIVE-EDITOR.JS - DevPanicZone
   ===============================================================================
   Live Code Editor
   Funktionen:
   - Panel-Toggles: HTML / CSS / JS ein- und ausblenden
   - Run-Button: Code aus allen aktiven Panels zusammenführen
     und sicher im sandboxed iframe ausführen
   - Fullscreen-Button: speichert aktuellen Code in localStorage,
     öffnet live-editor-fullscreen.html im neuen Tab
   =============================================================================== */

(function () {

    'use strict';

    /* ---- Abbruch wenn Editor-Elemente nicht im DOM ---- */
    if (!document.getElementById('btnFullscreen')) { return; }

    /* ---- Storage Key ---- */
    /* Einheitlicher Key für localStorage – muss in live-editor-fullscreen.js gleich sein */
    var STORAGE_KEY = 'dpz_live_editor';

    /* ---- Elemente ---- */
    var btnRun = document.getElementById('btnRun');
    var previewFrame = document.getElementById('previewFrame');

    var inputHtml = document.getElementById('inputHtml');
    var inputCss = document.getElementById('inputCss');
    var inputJs = document.getElementById('inputJs');

    var panelHtml = document.getElementById('panelHtml');
    var panelCss = document.getElementById('panelCss');
    var panelJs = document.getElementById('panelJs');

    var toggleBtns = document.querySelectorAll('.editor-toggle-btn');
    var btnFullscreen = document.getElementById('btnFullscreen');

    /* ---- Panel-Toggles ---- */

    toggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var panel = btn.dataset.panel;
            var isActive = btn.classList.contains('active');

            /* Mindestens ein Panel muss aktiv bleiben */
            var activeCount = document.querySelectorAll('.editor-toggle-btn.active').length;
            if (isActive && activeCount <= 1) {
                return;
            }

            btn.classList.toggle('active');
            btn.setAttribute('aria-pressed', btn.classList.contains('active'));

            /* Zugehöriges Panel ein-/ausblenden */
            if (panel === 'html') { panelHtml.classList.toggle('hidden', !btn.classList.contains('active')); }
            if (panel === 'css') { panelCss.classList.toggle('hidden', !btn.classList.contains('active')); }
            if (panel === 'js') { panelJs.classList.toggle('hidden', !btn.classList.contains('active')); }
        });
    });

    /* ---- Slash-Fix: Browser-Schnellsuche unterdrücken ---- */
    /* Firefox und einige andere Browser fangen '/' als Shortcut ab.
       stopPropagation verhindert das, ohne das Zeichen zu blockieren. */

    [inputHtml, inputCss, inputJs].forEach(function (textarea) {
        if (!textarea) { return; }
        textarea.addEventListener('keydown', function (e) {
            if (e.key === '/') {
                e.stopPropagation();
            }
        });
    });

    /* ---- Live-Preview: bei jeder Eingabe automatisch ausführen ---- */
    [inputHtml, inputCss, inputJs].forEach(function (textarea) {
        if (!textarea) { return; }
        textarea.addEventListener('input', runCode);
    });

    /* ---- Run-Button: Code ausführen ---- */

    btnRun.addEventListener('click', runCode);

    function runCode() {

        var html = inputHtml.value;
        var css = inputCss.value;
        var js = inputJs.value;

        /* Vollständiges HTML-Dokument für srcdoc zusammenbauen */
        var doc = [
            '<!DOCTYPE html>',
            '<html lang="de">',
            '<head>',
            '<meta charset="UTF-8">',
            '<style>',
            css,
            '</style>',
            '</head>',
            '<body>',
            html,
            '<script>',
            js,
            '<\/script>',
            '</body>',
            '</html>'
        ].join('\n');

        /* srcdoc setzt den Inhalt des iframe neu – kein src, kein externes Request */
        previewFrame.srcdoc = doc;
    }

    /* ---- Fullscreen-Button: Code in localStorage speichern, neuen Tab öffnen ---- */

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', function () {

            /* Aktuellen Stand aller Panels speichern */
            var data = {
                html: inputHtml.value,
                css: inputCss.value,
                js: inputJs.value
            };

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                /* localStorage nicht verfügbar – trotzdem öffnen, Textareas bleiben leer */
                console.warn('DPZ Live Editor: localStorage nicht verfügbar.', e);
            }

            window.open('/tutorials/javascript/javascript-projects/js-live-editor-fullscreen.html', '_blank');
        });
    }

    /* ---- Beim Laden: initiale Preview anzeigen ---- */
    runCode();

})();