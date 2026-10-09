# Schalti UI 🎨

Zentrales Design-System und Komponenten-Paket für alle Schalti-Apps (`schalti_theorie`, `schalti_termine`, `schalti_sumup`, `schalti_stundenzettel`).

Basierend auf **Shoelace Web Components**, **HTMX** und den Markenfarben von [fahrschule-schaltwerk.de](https://www.fahrschule-schaltwerk.de/).

Alle vier Consumer-Repos sind auf `requirements.txt`-Ebene per Commit-Hash gepinnt und tracken diesen Branch automatisch per Renovate (`git-refs`-Datasource) - ein neuer Commit hier löst dort jeweils einen PR mit aktualisiertem Hash aus.

---

## 🚀 Installation & Einbindung

### 1. In `requirements.txt` oder via pip:
```bash
pip install -e /home/jonas/Workspace/schalti_ui
# oder bei Git-Deployment:
# git+https://github.com/YoMamasNerd/schalti_ui.git
```

### 2. In `settings.py`:
```python
INSTALLED_APPS = [
    ...,
    "schalti_ui",
]

TEMPLATES = [
    {
        # ...
        "OPTIONS": {
            "context_processors": [
                # ...
                "schalti_ui.context_processors.apps_registry",
            ],
        },
    },
]
```

### 3. In Templates:
```html
{% extends "schalti_ui/base.html" %}
{% load schalti_tags %}

{% block app_title %}Theoriekurs-Manager{% endblock %}

{% block content %}
  <sl-card>
    <div slot="header">
      <strong>Kurs-Übersicht</strong>
      {% status_pill "offen" %}
    </div>
    <p>Inhalt im Schaltwerk-Design!</p>
  </sl-card>
{% endblock %}
```

---

## ⚙️ Optionale Settings

| Setting | Default | Zweck |
| --- | --- | --- |
| `SCHALTI_APPS_REGISTRY_URL` | `""` (leer) | JSON-Registry für den App-Switcher; ohne Wert wird der Switcher nicht gerendert |
| `SCHALTI_ADMIN_URL` | `"/admin/"` | Ziel des „Django Admin"-Eintrags im User-Menü |
| `SCHALTI_LOGOUT_URL` | `"/accounts/logout/"` | Ziel des „Abmelden"-Eintrags im User-Menü |
| `SCHALTI_SITE_NAME` | `SITE_NAME` | App-Name für Titel, Header und Footer |

---

## 🧪 Tests & Lint

```bash
pip install -e . pytest ruff
pytest -v
ruff check .
```

CI läuft auf jedem Push und Pull Request (`.github/workflows/ci.yml`, Python 3.11–3.13).

---

## 💡 Hinweise für Consumer-Apps

- **Browser-Support:** `schalti.css` nutzt `light-dark()` und `color-mix()`
  (Chrome/Edge ≥ 123, Firefox ≥ 120, Safari ≥ 17.5). Dark Mode folgt weiterhin
  der Systemeinstellung; `data-theme="dark"`/`"light"` auf `<html>` erzwingt
  das Theme wie gehabt, das Theme-Skript in `base.html` synchronisiert
  `.sl-theme-dark` unverändert mit.
- **htmx & Schalti-Script laden mit `defer`:** Wer in Templates inline
  `htmx.config.*` setzt, muss das in einen `DOMContentLoaded`-Listener
  verpacken. Für `hx-*`-Attribute im Markup ändert sich nichts.
- **Cache-Busting:** Statt manueller `?v=`-Parameter lässt sich in der
  jeweiligen Consumer-App Djangos `ManifestStaticFilesStorage` aktivieren:
```python
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.ManifestStaticFilesStorage"},
}
```
  Dann greifen gehashte Dateinamen und die `?v=`-Suffixe können entfallen.
