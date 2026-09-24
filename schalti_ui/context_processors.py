from django.conf import settings


def apps_registry(request):
    """Registry-URL für den App-Switcher (schalti_ui/app_switcher.html).
    Ohne SCHALTI_APPS_REGISTRY_URL rendert das Partial nichts."""
    return {
        "SCHALTI_APPS_REGISTRY_URL": getattr(settings, "SCHALTI_APPS_REGISTRY_URL", ""),
    }