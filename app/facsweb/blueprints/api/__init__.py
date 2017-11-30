# vim: fdm=indent
'''
author:     Fabio Zanini
date:       11/06/15
content:    Blueprint for the RESTful API.

            The API is basically used to GET the data in JSON format for further
            web-friendly manipulation. No PUT, DELETE, HEAD methods are supported.
            The API gives access to a number of data including:
                - viral load
                - CD4+ cell count
                - reference sequences
                - phylogenetic trees
                - coverage
                - single nucleotide polymorphism counts
                - haplotype counts
'''
# Modules
from flask import Blueprint
from flask_restful import Api
from .resources import Merged_predictor, TissueCellTypes


# API blueprint
api_bp = Blueprint('api', __name__,
                   url_prefix='/api',
                   template_folder='templates')

api = Api(api_bp)

api.add_resource(
        Merged_predictor,
        '/data/merged_predictor/<tissue>/<cell_type>',
        )

api.add_resource(
        TissueCellTypes,
        '/data/tissues_cell_types')
