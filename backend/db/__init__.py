import os
import importlib


def load_all_models():
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    for file in os.listdir(models_dir):
        if file.endswith(".py") and not file.startswith("_"):
            module_name = file[:-3]
            importlib.import_module(f"db.models.{module_name}")
