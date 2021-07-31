from app.tables import blueprint
from flask import render_template,jsonify
from flask_login import login_required


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

    for i in range(1,100):
        data["data"].append(
            {
                "ip": "192.168.0."+str(i),
                "status": "在线",
                "flag_number": 12,
                "update_time": "2022/04/25",
            },
        )
    return jsonify(data)