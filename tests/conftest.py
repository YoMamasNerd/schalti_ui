import django
from django.conf import settings


def pytest_configure():
    """Minimales Django-Setup für die Template-Tag-Tests (ohne pytest-django)."""
    if settings.configured:
        return
    settings.configure(
        DEBUG=True,
        DATABASES={},
        INSTALLED_APPS=["schalti_ui"],
        TEMPLATES=[
            {
                "BACKEND": "django.template.backends.django.DjangoTemplates",
                "DIRS": [],
                "APP_DIRS": True,
                "OPTIONS": {"context_processors": []},
            }
        ],
        LANGUAGE_CODE="de",
        USE_I18N=True,
        USE_TZ=True,
    )
    django.setup()
