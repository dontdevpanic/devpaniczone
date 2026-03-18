/* ===============================================================================
   LIVE-EDITOR.JS - DevPanicZone
   ===============================================================================
   Live Code Editor
   Funktionen:
   - Panel-Toggles: HTML / CSS / JS ein- und ausblenden
   - Run-Button: Code aus allen aktiven Panels zusammenführen
     und sicher im sandboxed iframe ausführen
   =============================================================================== */

(function () {

    'use strict';

    /* ---- Elemente ---- */
    const btnRun = document.getElementById('btnRun');
    const previewFrame = document.getElementById('previewFrame');
    const editorLayout = document.getElementById('editorLayout');

    const inputHtml = document.getElementById('inputHtml');
    const inputCss = document.getElementById('inputCss');
    const inputJs = document.getElementById('inputJs');

    const panelHtml = document.getElementById('panelHtml');
    const panelCss = document.getElementById('panelCss');
    const panelJs = document.getElementById('panelJs');

    const toggleBtns = document.querySelectorAll('.editor-toggle-btn');

    /* ---- Panel-Toggles ---- */

    toggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const panel = btn.dataset.panel;
            const isActive = btn.classList.contains('active');

            /* Mindestens ein Panel muss aktiv bleiben */
            const activeCount = document.querySelectorAll('.editor-toggle-btn.active').length;
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

    /* ---- Run-Button: Code ausführen ---- */

    btnRun.addEventListener('click', runCode);

    function runCode() {

        const html = inputHtml.value;
        const css = inputCss.value;
        const js = inputJs.value;

        /* Vollständiges HTML-Dokument für srcdoc zusammenbauen */
        const doc = [
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

        /* Preview-Höhe dynamisch an Editor-Panels anpassen */
        syncPreviewHeight();
    }

    /* ---- Preview-Höhe synchronisieren ---- */

    function syncPreviewHeight() {
        const panels = document.getElementById('editorPanels');
        /* Mindesthöhe 300px, sonst Höhe der Panels-Spalte */
        const targetHeight = Math.max(panels.offsetHeight, 300);
        previewFrame.style.minHeight = targetHeight + 'px';
    }

    /* Höhe neu berechnen wenn Textareas manuell resized werden */
    window.addEventListener('resize', syncPreviewHeight);

    /* ---- Fullscreen-Modus ---- */
    /* Wird aktiviert wenn URL den Parameter ?fullscreen=true enthält.
       Blendet Header, Footer, Hero, Sidebar-Buttons und Anleitung aus.
       Der Editor bekommt die volle Viewport-Höhe. */

    function initFullscreen() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('fullscreen') !== 'true') {
            return;
        }

        /* Elemente ausblenden */
        const hide = [
            '.site-header',
            '.site-footer',
            '.hero',
            '.sidebar-toggle',
            '.tutorial-nav-toggle',
            '#scrollTopBtn',
            '#anleitung',
            '.categories',
            '.tutorial-nav'
        ];

        hide.forEach(function (selector) {
            const el = document.querySelector(selector);
            if (el) { el.style.display = 'none'; }
        });

        /* Editor-Layout auf volle Viewport-Höhe setzen */
        const layout = document.getElementById('editorLayout');
        if (layout) {
            layout.style.height = '100vh';
        }

        /* iframe Höhe ebenfalls anpassen */
        if (previewFrame) {
            previewFrame.style.minHeight = 'calc(100vh - 40px)';
        }

        /* body: kein Scrollen im Fullscreen */
        document.body.style.overflow = 'hidden';
    }

    initFullscreen();

    /* ---- Beim Laden: initiale Preview anzeigen ---- */
    runCode();

})();