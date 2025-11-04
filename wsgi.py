import os
from app import create_app

# Determine the configuration to use from the FLASK_CONFIG environment variable.
# Defaults to 'production' if the variable is not set.
config_name = os.getenv('FLASK_CONFIG') or 'production'
app = create_app(config_name)

if __name__ == '__main__':
    # This allows running the application directly using `python wsgi.py`,
    # which is useful for debugging but not for production.
    app.run()