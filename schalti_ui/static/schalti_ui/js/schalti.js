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
window.schaltiOpenDialog = async function(dialogId) {
  const dlg = document.getElementById(dialogId);
  if (!dlg) return;
  if (typeof dlg.show === 'function') {
    dlg.show();
  } else {
    await customElements.whenDefined('sl-dialog');
    if (typeof dlg.show === 'function') {
      dlg.show();
    }
  }
};

window.schaltiCloseDialog = async function(dialogId) {
  const dlg = document.getElementById(dialogId);
  if (!dlg) return;
  if (typeof dlg.hide === 'function') {
    dlg.hide();
  } else {
    await customElements.whenDefined('sl-dialog');
    if (typeof dlg.hide === 'function') {
      dlg.hide();
    }
  }
};

// Mobile Navigation Drawer Toggle, Backdrop & Escape-Handler
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.schalti-header');
  if (!header) return;

  const toggle = header.querySelector('.schalti-nav-toggle');
  const closeBtn = header.querySelector('.schalti-nav-close');
  const backdrop = header.querySelector('.schalti-nav-backdrop');
  const navList = header.querySelector('.schalti-nav-links');

  function openNav() {
    header.classList.add('nav-open');
    document.body.classList.add('schalti-nav-locked');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('name', 'x-lg');
    }
  }

  function closeNav() {
    header.classList.remove('nav-open');
    document.body.classList.remove('schalti-nav-locked');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('name', 'list');
    }
  }

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (header.classList.contains('nav-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeNav();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeNav);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      closeNav();
    }
  });

  // Automatisches Schließen bei Klick auf normale Links
  if (navList) {
    navList.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && !link.closest('sl-dropdown')) {
        closeNav();
      }
    });
  }
});
