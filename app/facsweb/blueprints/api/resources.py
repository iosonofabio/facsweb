# vim: fdm=indent
'''
author:     Fabio Zanini
date:       06/11/14
content:    Models for the hivwholeweb site.

            We are in a particular position, because we do not collect data
            from the users and store in a database, but we need to stream data.

            This makes our 'models' a bit odd.
'''
import os
import json
from flask_restful import Resource, abort


def get_resource_folder():
    from ... import app
    return app.static_folder+'/data/'


class TissueCellTypes(Resource):
    def get(self):
        from collections import defaultdict
        import glob
        glb = get_resource_folder()+'merged_predictor*.json'
        fns = glob.glob(glb)
        cell_types = defaultdict(set)
        for fn in fns:
            fnb = os.path.basename(fn)[len('merged_predictor_'):-len('.json')]
            sepi = fnb.find('_')
            tissue = fnb[:sepi]
            cell_type = fnb[sepi+1:]
            cell_types[tissue].add(cell_type)

        out = {
            'tissues': list(cell_types.keys()),
            'cell_types': {k: sorted(v) for k, v in cell_types.items()},
            }
        print(out)
        return out


class Merged_predictor(Resource):
    def get(self, tissue, cell_type):
        fn = get_resource_folder()+'merged_predictor_{:}_{:}.json'.format(
                tissue,
                cell_type)
        try:
            with open(fn, 'r') as f:
                return json.load(f)
        except IOError:
            msg = "No data on tissue {:} and cell type {:} found".format(
                    tissue,
                    cell_type)
            abort(404, message=msg)
