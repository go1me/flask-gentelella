from app.tables import blueprint
from flask import render_template,jsonify,request
from flask_login import login_required
import json

@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')


@blueprint.route('/get_targets', methods=['GET'])
@login_required
def get_targets():
    # Assume data comes from somewhere else
    data = {
        "data": []
    }

    for i in range(1,6):
        data["data"].append(
            {
                "target_id":i,
                "ip": "192.168.0."+str(i),
                "status": "在线",
                "flag_number": i,
                "update_time": "2022/04/25",
            },
        )
    return jsonify(data)

@blueprint.route('/get_scripts', methods=['GET'])
@login_required
def get_scripts():
    # Assume data comes from somewhere else
    data = {
        "data": []
    }

    for i in range(1,6):
        data["data"].append(
            {
                "script_id":i+100,
                "script_name": "t"+str(i)+".py",
                "used_number": i,
                "update_time": "2022/04/25",
            },
        )
    return jsonify(data)


@blueprint.route('/post_select_items', methods=['POST'])
@login_required
def post_select_items():
    data = json.loads(request.get_data())
    print(data,type(data))
    return data