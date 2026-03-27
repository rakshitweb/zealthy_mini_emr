import os
import importlib
from fastapi import APIRouter
from config.logger import get_logger

logger = get_logger(__name__)

def get_all_routers():
    routers = []

    base_dir = os.path.dirname(__file__)
    base_package = __name__

    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith("_route.py"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, base_dir)
                module_path = rel_path.replace(os.sep, ".").replace(".py", "")
                full_module_path = f"{base_package}.{module_path}"
                try:
                    module = importlib.import_module(full_module_path)
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if isinstance(attr, APIRouter):
                            routers.append(attr)
                except Exception as e:
                    logger.error(f"Failed to load {full_module_path}: {e}")
    return routers
