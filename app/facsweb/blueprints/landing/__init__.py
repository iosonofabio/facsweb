# vim: fdm=indent
'''
author:     Fabio Zanini
date:       11/06/15
content:    Blueprint for the welcome page.
'''
# Modules
from flask import Blueprint, render_template
# from ...models import PatientTableModel


# Blueprint
landing = Blueprint('landing', __name__,
                    url_prefix='/',
                    static_folder='static',
                    template_folder='templates',
                    static_url_path='/static/landing',
                    )


# Views
@landing.route('/', methods=['GET'])
def index():
    # table = PatientTableModel().get_table()
    return render_template(
            'landing.html',
            title='Landing page',
            )
