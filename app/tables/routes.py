from app.tables import blueprint
from flask import render_template,jsonify,request
from flask_login import login_required
from app import db
from app.tables.models import Target,Script
import json

@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')


@blueprint.route('/get_targets', methods=['GET'])
@login_required
def get_targets():
    data = {
        "data":[i.to_json() for i in db.session.query(Target).all()]
    } 
    return jsonify(data)

@blueprint.route('/get_scripts', methods=['GET'])
@login_required
def get_scripts():
    data = {
        "data": [i.to_json() for i in db.session.query(Script).all()]
    }
    return jsonify(data)


@blueprint.route('/post_select_items', methods=['POST'])
@login_required
def post_select_items():
    data = json.loads(request.get_data())
    print(data,type(data))
    return data