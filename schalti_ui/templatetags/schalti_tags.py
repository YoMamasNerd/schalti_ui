from decimal import Decimal, InvalidOperation

from django import template
from django.utils.formats import number_format
from django.utils.html import format_html

register = template.Library()

# Status-Werte je Kategorie. Nicht gelistete Werte fallen auf "neutral" zurück.
STATUS_CATEGORIES = {
    "success": {
        "bezahlt", "fsm_saldo_ok", "erfolgreich", "durchgefuehrt",
        "anwesend", "bereit", "fsm_registriert",
    },
    "danger": {
        "offen", "fehler", "ausgefallen", "unentschuldigt",
        "nicht_bereit", "reserviert",
    },
    "warning": {
        "teilweise", "angezahlt", "entschuldigt", "link_gesendet",
        "laeuft", "in_uebertragung",
    },
}

STATUS_DOTS = {"success": "green", "danger": "red", "warning": "yellow", "neutral": "blue"}


def _status_category(status_val):
    """Ordnet einem Status-Wert seine Kategorie (success/danger/warning/neutral) zu."""
    status_lower = str(status_val or "").lower()
    for category, values in STATUS_CATEGORIES.items():
        if status_lower in values:
            return category
    return "neutral"


@register.simple_tag
def status_pill(status_val, label=None):
    """Erzeugt eine passende Status-Pille.

    Label und Status-Wert werden HTML-escaped (format_html), damit
    nutzergenerierte Inhalte keine HTML-Injection ermöglichen.
    """
    category = _status_category(status_val)
    lbl = label or status_val or "Unbekannt"
    return format_html(
        '<span class="status-pill {}"><span class="status-dot {}"></span>{}</span>',
        category,
        STATUS_DOTS[category],
        lbl,
    )


@register.filter
def currency_de(value):
    """Formatiert Beträge deutsch (z.B. 1.234,56 €) über Djangos l10n-Maschinerie."""
    if value is None or value == "":
        return "0,00 €"
    try:
        return f"{number_format(Decimal(str(value)), decimal_pos=2, force_grouping=True)} €"
    except (InvalidOperation, ValueError, TypeError):
        return f"{value} €"
