"""
Global application configuration. Can store run-time options, API urls, paths, execution flags and so on.
"""

import os


API_VERSION = 'v1'
SERVER_ROOT = os.path.dirname(__file__)
STATIC_ROOT = os.path.join(SERVER_ROOT, '../client')
PORT = 9000
