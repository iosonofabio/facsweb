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

#from .blueprints.tutorial import tutorial
#hiv.register_blueprint(tutorial, url_prefix='/tutorial')
#
#from .blueprints.patient import patient
#hiv.register_blueprint(patient)
#
#from .blueprints.region import region
#hiv.register_blueprint(region)
#
#from .blueprints.data import data
#hiv.register_blueprint(data)
#
#from .blueprints.method import method
#hiv.register_blueprint(method)
#
#from .blueprints.static import static
#hiv.register_blueprint(static)
#
#from .blueprints.download import download
#hiv.register_blueprint(download)
#
## RESTful API
#from .blueprints.api import api_bp
#hiv.register_blueprint(api_bp)
#
#
#from .blueprints.xsectional import xsectional;
#hiv.register_blueprint(xsectional)
