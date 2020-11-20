"""
Place for application routes.
"""
from aiohttp import web
from config import *
from views import guest, user

routes = web.RouteTableDef()


@routes.get('/')
async def get_index(request):
    # return web.Response(
    #     status=200,
    #     text='OK',
    #     headers={}
    # )
    return web.HTTPOk(text='OK')


# serve static resources (yes, nginx or apache are much better for this)
#@routes.static('/static/', STATIC_ROOT, name='static')
@routes.post(f'/api/{API_VERSION}/auth')
async def auth(request):
    # return web.json_response()
    pass


@routes.get(f'/api/{API_VERSION}/projects')
async def get_projects(request):
    # return web.json_response()
    pass


@routes.get(f'/api/{API_VERSION}/tasks')
async def get_tasks(request):
    # return web.json_response()
    pass


@routes.post(f'/api/{API_VERSION}/projects')
async def add_project(request):
    data = await request.post()
    pass


@routes.post(f'/api/{API_VERSION}/tasks')
async def add_task(request):
    data = await request.post()
    pass
