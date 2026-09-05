/**
 * Schalti UI - Shoelace Component Loader & Bundle
 *
 * Registriert alle wesentlichen Shoelace Web-Components,
 * setzt den dynamischen Pfad für Shoelace Assets (z.B. Icons)
 * und startet den Autoloader für weitere Komponenten.
 */

import { setBasePath } from '../shoelace/utilities/base-path.js';

// Automatische Ermittlung des Shoelace-Asset-Pfads relativ zum Bundle
try {
  const bundleUrl = new URL(import.meta.url);
  const basePath = new URL('../shoelace', bundleUrl).pathname;
  setBasePath(basePath);
} catch (e) {
  setBasePath('/static/schalti_ui/shoelace');
}

// Direkte Registrierung der am häufigsten genutzten Komponenten
import '../shoelace/components/button/button.js';
import '../shoelace/components/button-group/button-group.js';
import '../shoelace/components/icon/icon.js';
import '../shoelace/components/icon-button/icon-button.js';
import '../shoelace/components/dialog/dialog.js';
import '../shoelace/components/input/input.js';
import '../shoelace/components/select/select.js';
import '../shoelace/components/option/option.js';
import '../shoelace/components/card/card.js';
import '../shoelace/components/badge/badge.js';
import '../shoelace/components/tag/tag.js';
import '../shoelace/components/dropdown/dropdown.js';
import '../shoelace/components/menu/menu.js';
import '../shoelace/components/menu-item/menu-item.js';
import '../shoelace/components/menu-label/menu-label.js';
import '../shoelace/components/switch/switch.js';
import '../shoelace/components/checkbox/checkbox.js';
import '../shoelace/components/textarea/textarea.js';
import '../shoelace/components/progress-bar/progress-bar.js';
import '../shoelace/components/spinner/spinner.js';
import '../shoelace/components/alert/alert.js';
import '../shoelace/components/tab/tab.js';
import '../shoelace/components/tab-group/tab-group.js';
import '../shoelace/components/tab-panel/tab-panel.js';
import '../shoelace/components/divider/divider.js';
import '../shoelace/components/tooltip/tooltip.js';
import '../shoelace/components/details/details.js';

// Autoloader für alle weiteren <sl-*> Komponenten
import '../shoelace/shoelace-autoloader.js';
