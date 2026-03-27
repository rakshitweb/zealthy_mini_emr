import logging
import sys


def setup_logger(log_level=logging.INFO):
    root = logging.getLogger()
    root.setLevel(log_level)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)
    formatter = logging.Formatter(
        "<%(levelname)s> [%(asctime)s] p%(process)s {%(pathname)s:%(lineno)d} - %(message)s",
        "%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    if not root.handlers:
        root.addHandler(handler)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
