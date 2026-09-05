# Schalti UI 🎨

Zentrales Design-System und Komponenten-Paket für alle Schalti-Apps (`schalti_theorie`, `schalti_termine`, `schalti_sumup`, `schalti_stundenzettel`).

Basierend auf **Shoelace Web Components**, **HTMX** und den Markenfarben von [fahrschule-schaltwerk.de](https://www.fahrschule-schaltwerk.de/).

---

## 🚀 Installation & Einbindung

### 1. In `requirements.txt` oder via pip:
```bash
pip install -e /home/jonas/Workspace/schalti_ui
# oder bei Git-Deployment:
# git+https://github.com/JonSchalti/schalti_ui.git
```

### 2. In `settings.py`:
```python
INSTALLED_APPS = [
    ...,
    "schalti_ui",
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
