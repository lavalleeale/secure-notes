#!/bin/ash
gunicorn --chdir src core:app -c gunicorn_config.py