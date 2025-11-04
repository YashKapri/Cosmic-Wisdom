# This file is now used to run the application.
# (You can rename this file from 'server.py' to 'run.py' if you like)

from app import create_app

app = create_app()

if __name__ == '__main__':
    # The port and debug settings are moved here
    app.run(debug=True, port=5000)