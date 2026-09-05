from decimal import Decimal
from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.simple_tag
def status_pill(status_val, label=None):
    """Erzeugt eine passende Status-Pille."""
    status_lower = str(status_val or "").lower()
    lbl = label or status_val or "Unbekannt"

    if status_lower in ("bezahlt", "fsm_saldo_ok", "erfolgreich", "durchgefuehrt", "anwesend", "bereit", "fsm_registriert"):
        css_class = "success"
        dot = "green"
    elif status_lower in ("offen", "fehler", "ausgefallen", "unentschuldigt", "nicht_bereit", "reserviert"):
        css_class = "danger"
        dot = "red"
    elif status_lower in ("teilweise", "angezahlt", "entschuldigt", "link_gesendet", "laeuft", "in_uebertragung"):
        css_class = "warning"
        dot = "yellow"
    else:
        css_class = "neutral"
        dot = "blue"

    html = f'<span class="status-pill {css_class}"><span class="status-dot {dot}"></span>{lbl}</span>'
    return mark_safe(html)

@register.filter
def currency_de(value):
    """Formatiert Beträge deutsch (z.B. 120,50 €)."""
    if value is None:
        return "0,00 €"
    try:
        val = Decimal(str(value))
        return f"{val:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return f"{value} €"
