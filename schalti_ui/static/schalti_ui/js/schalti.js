/**
 * Schalti UI - Client-side Helpers & HTMX Bridge
 */

document.addEventListener('DOMContentLoaded', () => {
  // HTMX Integration mit Shoelace Web Components
  if (window.htmx) {
    // Wenn HTMX Inhalt geladen hat, verarbeitet Shoelace neue Tags automatisch
    document.body.addEventListener('htmx:afterSwap', (evt) => {
      // Schließt offene Dialoge nach erfolgreichem Submit falls data-close-on-success vorhanden
      const dialog = evt.detail.elt.closest('sl-dialog');
      if (dialog && dialog.dataset.closeOnSuccess) {
        dialog.hide();
      }
    });
  }
});

// Hilfsfunktion zum Öffnen/Schließen von Shoelace Dialogen
window.schaltiOpenDialog = function(dialogId) {
  const dlg = document.getElementById(dialogId);
  if (dlg && typeof dlg.show === 'function') {
    dlg.show();
  }
};

window.schaltiCloseDialog = function(dialogId) {
  const dlg = document.getElementById(dialogId);
  if (dlg && typeof dlg.hide === 'function') {
    dlg.hide();
  }
};
