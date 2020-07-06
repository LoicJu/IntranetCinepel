# Generated by Django 3.0.6 on 2020-07-03 08:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('intranetapp', '0008_auto_20200622_1148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='id_create',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='template',
            name='template_content',
            field=jsonfield.fields.JSONField(default='[\n    {\n        "Date" : "lundi 01",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mardi 02",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mercredi 03",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "jeudi 04",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "vendredi 05",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "samedi 06",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "dimanche 07",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "lundi 08",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mardi 09",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mercredi 10",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "jeudi 11",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "vendredi 12",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "samedi 13",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "dimanche 14",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "lundi 15",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mardi 16",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mercredi 17",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "jeudi 18",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "vendredi 19",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "samedi 20",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "dimanche 21",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "lundi 22",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mardi 23",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "mercredi 24",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "jeudi 25",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "vendredi 26",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "samedi 27",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    },\n    {\n        "Date" : "dimanche 28",\n        "Vacance Scolaire" : "",\n        "Evenement" : "",\n        "Appolo" : \n        {\n            "Appolo Caisse Techn" : "",\n            "Appolo Caisse 1" : "",\n            "Appolo Caisse 2" : "",\n            "Appolo Bar" : "",\n            "Appolo Placeur 1" : "",\n            "Appolo Placeur 2" : ""\n\n        },\n        "Arcade" : \n        {\n            "Arcade Caisse 1" : "",\n            "Arcade Bar" : "",\n            "Arcade Placeur 1" : ""\n        },\n        "Bio" : \n        {\n            "Bio Caisse" : ""\n        },\n        "Rex" :\n        {\n            "Rex Caisse" : "",\n            "Rex Bar" : ""\n        },\n        "Studio" : \n        {\n            "Studio Caisse" : "",\n            "Studio Bar" : ""\n        }\n    }\n  ]'),
        ),
    ]