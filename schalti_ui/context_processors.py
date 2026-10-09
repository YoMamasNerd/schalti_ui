from django.conf import settings


def apps_registry(request):
    """Zentrale Context-Werte für schalti_ui-Templates (base.html, app_switcher).

    Ohne SCHALTI_APPS_REGISTRY_URL rendert das Partial app_switcher.html nichts.
    Admin-/Logout-Links lassen sich pro App überschreiben, falls die Pfade
    von den Defaults abweichen. Der Funktionsname bleibt bewusst stabil,
    da Consumer-Apps ihn in TEMPLATES OPTIONS referenzieren.
    """
    return {
        "SCHALTI_APPS_REGISTRY_URL": getattr(settings, "SCHALTI_APPS_REGISTRY_URL", ""),
        "SCHALTI_ADMIN_URL": getattr(settings, "SCHALTI_ADMIN_URL", "/admin/"),
        "SCHALTI_LOGOUT_URL": getattr(settings, "SCHALTI_LOGOUT_URL", "/accounts/logout/"),
        "SCHALTI_SITE_NAME": getattr(settings, "SCHALTI_SITE_NAME", None)
        or getattr(settings, "SITE_NAME", None),
    }
