# Generated by Django 3.0.6 on 2020-06-05 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('intranetapp', '0004_auto_20200604_1120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='content',
            field=models.TextField(default='[\n    {\n      "Header": "Date"\n    },\n    {\n      "Header": "Appolo",\n      "columns": [\n        {\n          "Header": "Caisse Tech",\n          "accessor": "caissetech"\n        },\n        {\n          "Header": "Caisse 1",\n          "accessor": "caisse1appolo"\n        },\n        {\n          "Header": "Caisse 2",\n          "accessor": "caisse2appolo"\n        },\n        {\n          "Header": "Bar",\n          "accessor": "barappolo"\n        },\n        {\n          "Header": "Placeur 1",\n          "accessor": "placeur1appolo"\n        },\n        {\n          "Header": "Placeur2",\n          "accessor": "placeur2appolo"\n        }\n      ]\n    },\n    {\n      "Header": "Arcades",\n      "columns": [\n        {\n          "Header": "Caisse 1",\n          "accessor": "caisse1arcades"\n        },\n        {\n          "Header": "Bar",\n          "accessor": "bararcades"\n        },\n        {\n          "Header": "Placeur 1",\n          "accessor": "placeur1arcades"\n        }\n      ]\n    },\n    {\n      "Header": "Bio",\n      "columns": [\n        {\n          "Header": "Caisse 1",\n          "accessor": "caisse1bio"\n        }\n      ]\n    },\n    {\n      "Header": "Rex",\n      "columns": [\n        {\n          "Header": "Caisse 1",\n          "accessor": "caisse1rex"\n        },\n        {\n          "Header": "Bar",\n          "accessor": "barrex"\n        }\n      ]\n    },\n    {\n      "Header": "Studio",\n      "columns": [\n        {\n          "Header": "Caisse 1",\n          "accessor": "caisse1studio"\n        },\n        {\n          "Header": "Bar",\n          "accessor": "barstudio"\n        }\n      ]\n    }\n  ]'),
        ),
    ]