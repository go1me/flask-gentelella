from app.ctf import blueprint
from flask import render_template,jsonify,request
from flask_login import login_required
from app import db,scheduler,record_return_value_scheduler, get_return_value_scheduler
from app.ctf.models import Target,Script,Task,Flag
import json
import os
import imp
import pip
import uuid
import datetime

@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')


#定时更新flag的任务
@scheduler.task('interval', id='get_flag_by_timing', seconds=5)#, misfire_grace_time=900)
def get_flag_by_timing():
    return_list = get_return_value_scheduler()
    print("get_flag_by_timing------------------",len(return_list))
    need_to_commit = False
    with scheduler.app.app_context():
        for return_item in return_list:
            if "operation" in return_item.keys():
                if return_item["operation"] == "get_flag":
                    if "flag" in return_item.keys():
                        flag = return_item["flag"]
                        if "arg" in return_item.keys():
                            arg = return_item["arg"]
                            flag_status= "未发送"
                            if "result" in return_item.keys():
                                flag_status =  return_item["result"]
                            db.session.add( Flag(flag=flag,ip=arg,flag_status=flag_status))
                            #更新target的flag总数
                            target = db.session.query(Target).filter(Target.ip == arg).first()
                            target.flag_number+=1
                            need_to_commit = True
        if need_to_commit == True:
            db.session.commit()

        #清理关闭定时任务
        tasks = db.session.query(Task).filter(Task.task_run_status == "run").all()
        if len(tasks)>0:
            job_id_list = []
            jobs = scheduler.get_jobs()
            for jjob in jobs:
                if jjob.id != 'get_flag_by_timing':
                    job_id_list.append(int(jjob.id))
            need_to_commit = False

            for task in tasks:
                if task.id not in job_id_list:
                    task.task_run_status="stop"
                    need_to_commit=True
            if need_to_commit == True:
                db.session.commit()

    
 
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
    if group =="":
        group="default"
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
    #删除的时候要看是否该脚本有在使用
    script = db.session.query(Script).filter(Script.id == id).first()
    if script.used_number>0:
        return jsonify('该脚本还有任务在使用，无法删除'),400
    
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
            else:
                return jsonify('only support .py and requirements.txt'),400
        
    return jsonify('success')



@blueprint.route('/post_select_items', methods=['POST'])
@login_required
def post_select_items():
    data = json.loads(request.get_data())
    print("----------------------------",data,type(data))
    targets_id_list = data["targets_list"]
    scripts_id_list = data["scripts_list"]
    times = data["times"]
    cycle = data["cycle"]
    for target_id in targets_id_list:
        for script_id in scripts_id_list:
            target = db.session.query(Target).filter(Target.id == target_id).first()
            script = db.session.query(Script).filter(Script.id == script_id).first()
            script.used_number +=1 
            task = Task(ip=target.ip,script_name=script.script_name,times=int(times),cycle=int(cycle))
            db.session.add(task)
    db.session.commit()
    return jsonify('success')


@blueprint.route('/get_task', methods=['GET'])
@login_required
def get_task():
    data = {
        "data":[i.to_json() for i in db.session.query(Task).all()]
    } 
    return jsonify(data)


@blueprint.route('/delete_task', methods=['POST'])
@login_required
def delete_task():
    data = json.loads(request.get_data())
    id = data["id"]
    task = db.session.query(Task).filter(Task.id == id).first()
    if task.task_run_status == "run":
        return jsonify('运行中任务无法删除')
    script = db.session.query(Script).filter(Script.script_name == task.script_name).first()
    if script.used_number >0:
        script.used_number -=1
    db.session.query(Task).filter(Task.id == id).delete()
    db.session.commit()
    return jsonify('success')

@blueprint.route('/run_task', methods=['POST'])
@login_required
def run_task():
    data = json.loads(request.get_data())
    id = data["id"]
    task = db.session.query(Task).filter(Task.id == id).first()
    if task.task_run_status == "stop":
        task.task_run_status = "run"
        script = db.session.query(Script).filter(Script.script_name == task.script_name).first()
        script_path = script.script_path
        plugins = imp.load_source("plugins",script_path)
        print(plugins.plugin_name,script_path)
        if task.times ==0:
            scheduler.add_job(func=plugins.run, trigger='interval', id=(str(task.id)), seconds=task.cycle, args=[task.ip,record_return_value_scheduler]) 
        elif task.times >0:
            run_time=task.cycle*task.times
            scheduler.add_job(func=plugins.run, trigger='interval', id=(str(task.id)), seconds=task.cycle, args=[task.ip,record_return_value_scheduler],
                                start_date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") , 
                                end_date=(datetime.datetime.now()+datetime.timedelta(seconds=run_time)).strftime("%Y-%m-%d %H:%M:%S")) 

            pass
    else:
        task.task_run_status = "stop"
        scheduler.remove_job(str(task.id))

    
    db.session.commit()
    return jsonify({"task_run_status":task.task_run_status})



@blueprint.route('/get_flags', methods=['GET'])
@login_required
def get_flags():
    data = {
        "data":[i.to_json() for i in db.session.query(Flag).all()]
    } 
    return jsonify(data)

@blueprint.route('/add_flag', methods=['POST'])
@login_required
def add_flag():
    data = json.loads(request.get_data())
    flag = data["flag"]
    ip = data["ip"]
    flag_status = data["flag_status"]
    
    count = db.session.query(Flag).filter(Flag.flag == flag).count()
    if count>0:
        return jsonify(ip+"已经存在，新增失败"),400
    db.session.add( Flag(flag=flag,ip=ip,flag_status=flag_status))
    db.session.commit()
    return jsonify('success')


@blueprint.route('/delete_flag', methods=['POST'])
@login_required
def delete_flag():
    data = json.loads(request.get_data())
    id = data["id"]
    flag = db.session.query(Flag).filter(Flag.id == id).first()
    #更新target的flag总数
    target = db.session.query(Target).filter(Target.ip == flag.ip).first()
    if target.flag_number>0:
        target.flag_number-=1

    db.session.query(Flag).filter(Flag.id == id).delete()
    db.session.commit()
    return jsonify('success')

#这些重复函数可以合并，后续考虑
@blueprint.route('/get_flag_by_id', methods=['POST'])
@login_required
def get_flag_by_id():
    data = json.loads(request.get_data())
    id = data["id"]
    flag = db.session.query(Flag).filter(Flag.id == id).first().to_json()
    return jsonify(flag)

@blueprint.route('/update_flag', methods=['POST'])
@login_required
def update_flag():
    data = json.loads(request.get_data())
    flag = data["flag"]
    flag_status = data["flag_status"]
    # 更新多条
    print("-------------",flag,flag_status)
    res = db.session.query(Flag).filter(Flag.flag == flag).update({"flag":flag,"flag_status":flag_status})
    print(res) # 6 res就是我们当前这句更新语句所更新的行数
    db.session.commit()
    return jsonify('success')                   
@blueprint.route('/get_flag_for_bar_y_category_stack', methods=['POST'])
@login_required
def get_flag_for_bar_y_category_stack():
    ips=[]
    flags_send=[]
    flags_un_send=[]
    flags_send_error=[]
    flags = db.session.query(Flag).all()
    for flag in flags:
        ip = flag.ip
        flag_status = flag.flag_status
        try:
            the_index = ips.index(ip)      
        except:
            the_index = len(ips)
            ips.append(ip)
            flags_send.append(0)
            flags_un_send.append(0)
            flags_send_error.append(0)

        if flag_status == "已发送":
            flags_send[the_index]+=1
        elif flag_status=="未发送":
            flags_un_send[the_index]+=1
        elif flag_status=="发送失败":
            flags_send_error[the_index]+=1
        else:
            dddd

    targets = db.session.query(Target).all()
    for target in targets:
        if target.ip not in ips:
            ips.append(target.ip)
            flags_send.append(0)
            flags_un_send.append(0)
            flags_send_error.append(0)

    return jsonify(ips = ips,
                   flags_send = flags_send,
                   flags_un_send = flags_un_send,
                   flags_send_error = flags_send_error)