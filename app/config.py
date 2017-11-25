# vim: fdm=indent
'''
author:     Fabio Zanini
date:       24/11/17
content:    Main config file for the facsweb web application.
'''
def find_tmp_folder():
    import os

    # Try standard webserver location first
    fn = '/home/facsweb/tmp/'
    if os.path.isdir(fn):
        return fn

    # Try OS standard
    fn = '/tmp/'
    if os.path.isdir(fn):
        return fn


DEBUG = False
CSRF_ENABLED = True
SECRET_KEY = 'pure forgetfulness'
TMP_ROOT_FOLDER = find_tmp_folder()
TIMEOUT_TMP = '1d'
BLUEPRINTS = {}

# Globals
DATA_SUBFOLDER = 'data'
TISSUES = [
        'pancreas',
        'brain',
        ]
