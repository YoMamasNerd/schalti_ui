from decimal import Decimal

from django.template import Context, Template


def render_template(template_string, **context):
    return Template(template_string).render(Context(context))


class TestStatusPill:
    def test_success_category(self):
        html = render_template('{% load schalti_tags %}{% status_pill "bezahlt" %}')
        assert "status-pill success" in html
        assert "status-dot green" in html
        assert "bezahlt" in html

    def test_danger_category(self):
        html = render_template('{% load schalti_tags %}{% status_pill "offen" %}')
        assert "status-pill danger" in html
        assert "status-dot red" in html

    def test_warning_category(self):
        html = render_template('{% load schalti_tags %}{% status_pill "angezahlt" %}')
        assert "status-pill warning" in html
        assert "status-dot yellow" in html

    def test_unknown_status_is_neutral(self):
        html = render_template('{% load schalti_tags %}{% status_pill "ganz_neuer_status" %}')
        assert "status-pill neutral" in html
        assert "status-dot blue" in html
        assert "ganz_neuer_status" in html

    def test_none_value(self):
        html = render_template("{% load schalti_tags %}{% status_pill value %}", value=None)
        assert "status-pill neutral" in html
        assert "Unbekannt" in html

    def test_label_overrides_status_text(self):
        html = render_template(
            '{% load schalti_tags %}{% status_pill "offen" label="Rechnung offen" %}'
        )
        assert "Rechnung offen" in html
        assert "status-pill danger" in html

    def test_label_is_escaped(self):
        html = render_template(
            "{% load schalti_tags %}{% status_pill \"offen\" label=label %}",
            label='<script>alert("xss")</script>',
        )
        assert "<script>" not in html
        assert "&lt;script&gt;" in html

    def test_status_value_is_escaped(self):
        html = render_template(
            "{% load schalti_tags %}{% status_pill value %}",
            value='<img src=x onerror=alert(1)>',
        )
        assert "<img" not in html
        assert "&lt;img" in html


class TestCurrencyDe:
    def test_none(self):
        html = render_template("{% load schalti_tags %}{{ value|currency_de }}", value=None)
        assert html == "0,00 €"

    def test_empty_string(self):
        html = render_template("{% load schalti_tags %}{{ value|currency_de }}", value="")
        assert html == "0,00 €"

    def test_simple(self):
        html = render_template("{% load schalti_tags %}{{ value|currency_de }}", value=120.5)
        assert html == "120,50 €"

    def test_grouping(self):
        html = render_template("{% load schalti_tags %}{{ value|currency_de }}", value=1234567.891)
        assert html == "1.234.567,89 €"

    def test_decimal(self):
        html = render_template(
            "{% load schalti_tags %}{{ value|currency_de }}", value=Decimal("42.5")
        )
        assert html == "42,50 €"

    def test_invalid_input_passthrough(self):
        html = render_template("{% load schalti_tags %}{{ value|currency_de }}", value="kein_zahl")
        assert html == "kein_zahl €"
