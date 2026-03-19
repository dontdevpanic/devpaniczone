/* ===============================================================================
   JS-LIVE-EDITOR-FULLSCREEN.JS - DevPanicZone
   ===============================================================================
   Standalone Fullscreen-Editor / iframe-Embed.
   Priorität beim Befüllen der Textareas:
   1. URL-Parameter (?html=...&css=...&js=...)  → für Tutorial-Einbettung
   2. localStorage (Key: dpz_live_editor)       → für "Im neuen Tab öffnen"
   3. Leer (nur Placeholder)                    → direkter Aufruf
   =============================================================================== */

(function () {

    'use strict';

    /* ---- Storage Key – muss identisch mit js-live-editor.js sein ---- */
    var STORAGE_KEY = 'dpz_live_editor';

    /* ---- Elemente ---- */
    var btnRun = document.getElementById('fsBtnRun');
    var btnClear = document.getElementById('fsBtnClear');
    var previewFrame = document.getElementById('fsPreviewFrame');
    var inputHtml = document.getElementById('fsInputHtml');
    var inputCss = document.getElementById('fsInputCss');
    var inputJs = document.getElementById('fsInputJs');

    /* ---- 1. URL-Parameter auslesen ---- */
    /* Starter-Code kann per ?html=...&css=...&js=... übergeben werden.
       encodeURIComponent() beim Schreiben, decodeURIComponent() hier beim Lesen. */

    function loadFromUrl() {
        var params = new URLSearchParams(window.location.search);
        var hasParams = false;

        if (params.has('html')) {
            inputHtml.value = decodeURIComponent(params.get('html'));
            hasParams = true;
        }
        if (params.has('css')) {
            inputCss.value = decodeURIComponent(params.get('css'));
            hasParams = true;
        }
        if (params.has('js')) {
            inputJs.value = decodeURIComponent(params.get('js'));
            hasParams = true;
        }

        return hasParams;
    }

    /* ---- 2. localStorage auslesen ---- */
    /* Wird nur genutzt wenn keine URL-Parameter vorhanden sind. */

    function loadFromStorage() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) { return; }

            var data = JSON.parse(raw);

            if (data.html !== undefined) { inputHtml.value = data.html; }
            if (data.css !== undefined) { inputCss.value = data.css; }
            if (data.js !== undefined) { inputJs.value = data.js; }

        } catch (e) {
            console.warn('DPZ Live Editor Fullscreen: Fehler beim Lesen aus localStorage.', e);
        }
    }

    /* ---- Code ausführen ---- */

    function runCode() {
        var html = inputHtml.value;
        var css = inputCss.value;
        var js = inputJs.value;

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

        previewFrame.srcdoc = doc;
    }

    /* ---- Clear: alle Textareas leeren + localStorage löschen + Preview zurücksetzen ---- */

    function clearEditor() {
        inputHtml.value = '';
        inputCss.value = '';
        inputJs.value = '';
        previewFrame.srcdoc = '';

        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            /* localStorage nicht verfügbar – kein Problem */
        }
    }

    /* ---- Panel-Toggles ---- */

    var fsToggleBtns = document.querySelectorAll('.fs-toggle-btn');
    var fsPanelHtml = document.getElementById('fsPanelHtml');
    var fsPanelCss = document.getElementById('fsPanelCss');
    var fsPanelJs = document.getElementById('fsPanelJs');

    fsToggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var panel = btn.dataset.panel;
            var isActive = btn.classList.contains('active');

            /* Mindestens ein Panel muss aktiv bleiben */
            var activeCount = document.querySelectorAll('.fs-toggle-btn.active').length;
            if (isActive && activeCount <= 1) {
                return;
            }

            btn.classList.toggle('active');
            btn.setAttribute('aria-pressed', btn.classList.contains('active'));

            if (panel === 'html') { fsPanelHtml.classList.toggle('hidden', !btn.classList.contains('active')); }
            if (panel === 'css') { fsPanelCss.classList.toggle('hidden', !btn.classList.contains('active')); }
            if (panel === 'js') { fsPanelJs.classList.toggle('hidden', !btn.classList.contains('active')); }
        });
    });

    /* ---- Slash-Fix: Browser-Schnellsuche unterdrücken ---- */
    [inputHtml, inputCss, inputJs].forEach(function (textarea) {
        textarea.addEventListener('keydown', function (e) {
            if (e.key === '/') {
                e.stopPropagation();
            }
        });
    });

    /* ---- Event Listener ---- */
    btnRun.addEventListener('click', runCode);
    btnClear.addEventListener('click', clearEditor);

    /* ---- Init: Priorität URL → localStorage → leer ---- */
    var loadedFromUrl = loadFromUrl();
    if (!loadedFromUrl) {
        loadFromStorage();
    }
    runCode();

})();