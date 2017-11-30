# vim: fdm=indent
'''
author:     Fabio Zanini
date:       24/11/17
content:    facsweb: better markers for FACS machines.
'''
#def application(environ, start_response):
#    status = '200 OK'
#    output = 'Hello World from within the facsweb app, after all that!'
#
#    response_headers = [('Content-type', 'text/plain'),
#                        ('Content-Length', str(len(output)))]
#
#    start_response(status, response_headers)
#
#    return [output]
import os
from flask import Flask
import jinja2


## TODO: fix static folder, this requires adapting HTML templates
app = Flask(
        __name__,
        static_folder=os.path.dirname(__file__)+'/shared/static',
        template_folder=os.path.dirname(__file__)+'/shared/templates',
        )
app.config.from_object('config')


# index page
from .blueprints.landing import landing
app.register_blueprint(
        landing,
        url_prefix='')

# REST API
from .blueprints.api import api_bp
app.register_blueprint(api_bp)
