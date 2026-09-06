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

// Bootstrap-Style Navbar Collapse
document.addEventListener('DOMContentLoaded', () => {
  const togglers = document.querySelectorAll('.schalti-nav-toggler');
  togglers.forEach((toggler) => {
    const targetId = toggler.getAttribute('aria-controls') || 'schalti-nav-collapse';
    const target = document.getElementById(targetId);
    if (!target) return;

    toggler.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggler.getAttribute('aria-expanded') === 'true';
      toggler.setAttribute('aria-expanded', String(!isExpanded));
      target.classList.toggle('show');
    });
  });

  // Klick außerhalb schließt Collapse (ignoriert Klicks innerhalb des Collapse oder Toggler)
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.schalti-nav-collapse.show').forEach((collapse) => {
      const toggler = document.querySelector(`.schalti-nav-toggler[aria-controls="${collapse.id}"]`) || document.querySelector('.schalti-nav-toggler');
      if (!collapse.contains(e.target) && (!toggler || !toggler.contains(e.target))) {
        collapse.classList.remove('show');
        if (toggler) toggler.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Klick auf Links schließt Collapse
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.schalti-nav-collapse a');
    if (link && !link.closest('sl-dropdown')) {
      document.querySelectorAll('.schalti-nav-collapse.show').forEach((collapse) => {
        collapse.classList.remove('show');
      });
      document.querySelectorAll('.schalti-nav-toggler[aria-expanded="true"]').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Shoelace sl-select (z. B. Abmelden / Profil im sl-menu) schließt Collapse
  document.addEventListener('sl-select', () => {
    document.querySelectorAll('.schalti-nav-collapse.show').forEach((collapse) => {
      collapse.classList.remove('show');
    });
    document.querySelectorAll('.schalti-nav-toggler[aria-expanded="true"]').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Escape-Taste schließt Collapse
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.schalti-nav-collapse.show').forEach((collapse) => {
        collapse.classList.remove('show');
      });
      document.querySelectorAll('.schalti-nav-toggler[aria-expanded="true"]').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
});
