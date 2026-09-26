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

  // Smart Sticky Subnavbar (Hide on scroll down, Reveal on scroll up)
  const subnav = document.querySelector('.schalti-subnav');
  const header = document.querySelector('.schalti-header');

  if (subnav && header) {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;
    const scrollThreshold = 8; // Mindestabstand in px, um Zickzack-Flackern zu vermeiden

    function updateHeaderHeight() {
      const h = header.offsetHeight;
      document.documentElement.style.setProperty('--schalti-header-height', `${h}px`);
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    window.addEventListener('load', updateHeaderHeight, { passive: true });
    if (window.ResizeObserver) {
      new ResizeObserver(updateHeaderHeight).observe(header);
    }

    function onScroll() {
      const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
      const headerHeight = header.offsetHeight;
      const scrollDiff = currentScrollY - lastScrollY;

      // Dropdown-Interaktion nicht unterbrechen
      if (subnav.querySelector('sl-dropdown[open]')) {
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Ganz oben auf der Seite immer sichtbar
      if (currentScrollY <= headerHeight) {
        subnav.classList.remove('schalti-subnav--hidden');
      } else if (Math.abs(scrollDiff) >= scrollThreshold) {
        if (scrollDiff > 0) {
          // Nach unten gescrollt -> ausblenden
          subnav.classList.add('schalti-subnav--hidden');
        } else {
          // Nach oben gescrollt -> einblenden
          subnav.classList.remove('schalti-subnav--hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
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

// Globale Toast-Benachrichtigung via Shoelace sl-alert
window.schaltiToast = function(message, variant = 'primary', icon = 'info-circle', duration = 3000) {
  const alert = Object.assign(document.createElement('sl-alert'), {
    variant: variant,
    closable: true,
    duration: duration,
    innerHTML: `
      <sl-icon name="${icon}" slot="prefix"></sl-icon>
      ${message}
    `
  });
  document.body.append(alert);
  return alert.toast();
};

// CSRF-Token aus Meta-Tag, Cookie oder Hidden-Input ermitteln
window.schaltiGetCsrfToken = function() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (meta && meta.content) return meta.content;

  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

  const input = document.querySelector('input[name="csrfmiddlewaretoken"]');
  if (input && input.value) return input.value;

  return '';
};

// Fetch-Wrapper mit automatischer Beifügung von X-CSRFToken bei State-Mutationen (POST, PUT, PATCH, DELETE)
window.schaltiFetch = function(url, options = {}) {
  const opts = Object.assign({}, options);
  const method = (opts.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const headers = new Headers(opts.headers || {});
    if (!headers.has('X-CSRFToken')) {
      const csrf = window.schaltiGetCsrfToken();
      if (csrf) {
        headers.set('X-CSRFToken', csrf);
      }
    }
    opts.headers = headers;
  }
  return fetch(url, opts);
};

// Hilfsfunktion: Selektiert aktivierte Shoelace Switches oder Checkboxen
// (vermeidet den Fehler mit :checked CSS-Pseudoklassen auf Custom Elements)
window.schaltiGetChecked = function(containerOrSelector, selector = 'sl-switch, sl-checkbox') {
  const root = typeof containerOrSelector === 'string'
    ? document.querySelector(containerOrSelector)
    : (containerOrSelector || document);
  if (!root) return [];
  return Array.from(root.querySelectorAll(selector)).filter(el => Boolean(el.checked));
};

// Hilfsfunktion: Shoelace Switches oder Checkboxen gesammelt an-/abwählen
window.schaltiSetAllChecked = function(containerOrSelector, state, selector = 'sl-switch, sl-checkbox') {
  const root = typeof containerOrSelector === 'string'
    ? document.querySelector(containerOrSelector)
    : (containerOrSelector || document);
  if (!root) return;
  root.querySelectorAll(selector).forEach(el => {
    el.checked = Boolean(state);
  });
};
