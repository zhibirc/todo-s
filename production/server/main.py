"""
The place where Web Server lives.
"""
from aiohttp import web
import aiohttp_jinja2
import jinja2

from config import *
from routes import routes


# create application instance
app = web.Application()

aiohttp_jinja2.setup(
    app,
    loader=jinja2.FileSystemLoader(f'{SERVER_ROOT}/templates')
)

# setup routes for application
app.router.add_routes(routes)

if __name__ == '__main__':
    web.run_app(app, port=PORT)
