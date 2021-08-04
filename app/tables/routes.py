from app.tables import blueprint
from flask import render_template,jsonify,request
from flask_login import login_required
from app import db
from app.tables.models import Target
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

    #构造数据
    for i in range(5):
        ip="192.168.12."+str(i)
        target = Target(ip=ip)
        db.session.add(target)
        print("test",i)
    db.session.commit()

    target_list = db.session.query(Target).all()
    print("test",target_list)
    for target in target_list:
        data["data"].append(
            {
                "target_id":target.id,
                "ip": target.ip,
                "status": target.status,
                "flag_number": target.flag_number,
                "create_time": target.create_time
            }
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