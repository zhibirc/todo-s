"""
The place where Web Server lives.
"""
from aiohttp import web
from .routes import routes


# create application instance
app = web.Application()

# setup routes for application
app.router.add_routes(routes)

if __name__ == '__main__':
    web.run_app(app)
