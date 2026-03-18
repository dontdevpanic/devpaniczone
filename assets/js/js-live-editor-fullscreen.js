/* ===============================================================================
   LIVE-EDITOR-FULLSCREEN.JS - DevPanicZone
   ===============================================================================
   Standalone Fullscreen-Editor.
   Liest beim Laden den Code aus localStorage (Key: dpz_live_editor),
   füllt die Textareas und führt den Code sofort aus.
   =============================================================================== */

(function () {

    'use strict';

    /* ---- Storage Key – muss identisch mit live-editor.js sein ---- */
    var STORAGE_KEY = 'dpz_live_editor';

    /* ---- Elemente ---- */
    var btnRun = document.getElementById('fsBtnRun');
    var previewFrame = document.getElementById('fsPreviewFrame');
    var inputHtml = document.getElementById('fsInputHtml');
    var inputCss = document.getElementById('fsInputCss');
    var inputJs = document.getElementById('fsInputJs');

    /* ---- localStorage auslesen und Textareas befüllen ---- */

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

    /* ---- Slash-Fix: Browser-Schnellsuche unterdrücken ---- */
    [inputHtml, inputCss, inputJs].forEach(function (textarea) {
        textarea.addEventListener('keydown', function (e) {
            if (e.key === '/') {
                e.stopPropagation();
            }
        });
    });

    btnRun.addEventListener('click', runCode);

    /* ---- Init: laden + sofort ausführen ---- */
    loadFromStorage();
    runCode();

})();