from app.tables import blueprint
from flask import render_template,jsonify,request
from flask_login import login_required
from app import db,scheduler,scheduler_return_list
from app.tables.models import Target,Script,Task
import json
import os
import imp
import pip
import uuid

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

@blueprint.route('/add_target', methods=['POST'])
@login_required
def add_target():
    data = json.loads(request.get_data())
    ip = data["ip"]
    group = data["group"]
    count = db.session.query(Target).filter(Target.ip == ip).count()
    if count>0:
        return jsonify(ip+"已经存在，新建失败"),400
    target = Target(ip=ip,group=group)
    db.session.add(target)
    db.session.commit()
    return jsonify('success')


@blueprint.route('/update_target', methods=['POST'])
@login_required
def update_target():
    data = json.loads(request.get_data())
    ip = data["ip"]
    group = data["group"]
    # 更新多条
    res = db.session.query(Target).filter(Target.ip == ip).update({"ip":ip,"group":group})
    print(res) # 6 res就是我们当前这句更新语句所更新的行数

    db.session.commit()
    return jsonify('success')

@blueprint.route('/delete_target', methods=['POST'])
@login_required
def delete_target():
    data = json.loads(request.get_data())
    id = data["id"]
    db.session.query(Target).filter(Target.id == id).delete()
    db.session.commit()
    return jsonify('success')

@blueprint.route('/get_target_by_id', methods=['POST'])
@login_required
def get_target_by_id():
    data = json.loads(request.get_data())
    id = data["id"]
    target = db.session.query(Target).filter(Target.id == id).first().to_json()
    print(id,target)
    return jsonify(target)


@blueprint.route('/post_select_items', methods=['POST'])
@login_required
def post_select_items():
    data = json.loads(request.get_data())
    print("----------------------------",data,type(data))
    task = Task(ip=str(data["targets"]),script_name=str(data["script"]),times=int(data["times"]),cycle=int(data["cycle"]))
    db.session.add(task)
    db.session.commit()
    return data


@blueprint.route('/get_scripts', methods=['GET'])
@login_required
def get_scripts():
    data = {
        "data": [i.to_json() for i in db.session.query(Script).all()]
    }
    return jsonify(data)


@blueprint.route('/delete_script', methods=['POST'])
@login_required
def delete_script():
    data = json.loads(request.get_data())
    id = data["id"]
    db.session.query(Script).filter(Script.id == id).delete()
    db.session.commit()
    return jsonify('success')


@blueprint.route('/upload_script', methods=['POST'])
@login_required
def upload_script():
    if request.method == 'POST':
        f = request.files.get('file')  # 获取文件对象
        file_name = f.filename
        print("----------------------------------------------------",f,"|"+file_name+"|")
        if file_name == "requirements.txt":
            basefile =  os.path.join(os.getcwd(),"plugins")
            the_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, file_name))
            the_path = os.path.join(basefile,the_uuid)
            f.save(the_path)
            try:
                pip.main(['install', '-r', the_path,'-i','https://pypi.tuna.tsinghua.edu.cn/simple'])
            except:
                pip._internal.main(['install', '-r', the_path,'-i','https://pypi.tuna.tsinghua.edu.cn/simple'])
            os.remove(the_path)
        else:
            file_split_text_tuple = os.path.splitext(file_name)
            if len(file_split_text_tuple) !=2:
                return jsonify('no split'),400
            the_split = file_split_text_tuple[-1]
            if the_split == ".py":
                #查重
                count = db.session.query(Script).filter(Script.script_name == file_name).count()
                if count>0:
                    return jsonify(file_name+"已经上传过"),400
                basefile =  os.path.join(os.getcwd(),"plugins")
                the_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, file_name))
                the_path = os.path.join(basefile,the_uuid)
                f.save(the_path)
                script = Script(script_name=file_name,script_path=the_path)
                db.session.add(script)
                db.session.commit()
                plugins = imp.load_source("plugins",the_path)
                print(plugins.plugin_name,the_path)
                print(plugins.run("text",scheduler_return_list))
                scheduler.add_job(func=plugins.run, trigger='interval', id=file_name, seconds=5, args=['text',scheduler_return_list]) 
            else:
                return jsonify('only support .py and requirements.txt'),400
        
    return jsonify('success')



@blueprint.route('/get_task', methods=['GET'])
@login_required
def get_task():
    data = {
        "data":[i.to_json() for i in db.session.query(Task).all()]
    } 
    return jsonify(data)