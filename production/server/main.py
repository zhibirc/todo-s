"""
The place where Web Server lives.
"""
from aiohttp import web
#from .routes import setup as setup_routes

routes = web.RouteTableDef()


# serve static assets
@routes.get('/')
async def test(request):
    return web.Response(text='OK')


# process authorization actions
@routes.post('api/sessions')
async def authorize(request):
    return web.Response(text='OK')

app = web.Application()
app.add_routes(routes)

web.run_app(app)
