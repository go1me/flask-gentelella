import datetime
from uuid import uuid4
import random
from sqlalchemy import DateTime, Column, Integer, String, event
from app import db
import os,shutil
import uuid
class Target(db.Model):
    __tablename__ = 'Target'

    #uuid = Column(String(36), primary_key=True, unique=True, nullable=False, default=lambda: str(uuid4()), comment='uuid')
    id = Column(Integer, primary_key=True, autoincrement=True, comment='target_id')
    ip = Column(String(46), nullable=False, unique=True, comment='ip地址')
    group = Column(String(48), default="default",nullable=False, comment='分组')
    status = Column(String(4), default="down",nullable=False, comment='状态')
    flag_number = Column(Integer,default=0,comment="flag数")
    create_time = Column(DateTime, default=datetime.datetime.now, comment='修改时间')
    #update_at = db.Column(db.DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)

    def __repr__(self):
        return str(self.ip)+str(self.create_time)
    def to_json(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        if "create_time" in dict:
            dict["create_time"] = dict["create_time"].strftime("%Y-%m-%d %H:%M:%S")
        return dict

#初始化数据
@event.listens_for(Target.__table__, 'after_create')
def create_Target(target, connection, **kw):
    '''
    for i in range(5):
        ip="192.168.12."+str(i)
        target.add(Target(ip=ip))
    target.commit()
    '''
    dict_list =[]
    for i in range(3):
        dict_list.append({'ip': "192.168.1."+str(i)})
    connection.execute(target.insert(), *dict_list)
    #connection.execute(target.insert(), {'ip': "192.168.1.1"}, {'ip': "192.168.1.2"}, {'ip': "192.168.1.3"})


class Script(db.Model):
    __tablename__ = 'Script'

    #uuid = Column(String(36), primary_key=True, unique=True, nullable=False, default=lambda: str(uuid4()), comment='uuid')
    id = Column(Integer, primary_key=True, autoincrement=True, comment='script_id')
    script_name = Column(String(46), nullable=False, unique=True, comment='脚本名称')
    script_path = Column(String, nullable=False, unique=True, comment='脚本路径')
    used_number = Column(Integer,default=0,comment="使用数")
    create_time = Column(DateTime, default=datetime.datetime.now, comment='修改时间')

    def __repr__(self):
        return str(self.ip)
    def to_json(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        if "create_time" in dict:
            dict["create_time"] = dict["create_time"].strftime("%Y-%m-%d %H:%M:%S")
        return dict


#初始化数据
@event.listens_for(Script.__table__, 'after_create')
def create_Script(target, connection, **kw):
    basefile =  os.path.join(os.getcwd(),"plugins")
    if not os.path.exists(basefile):
        os.mkdir(basefile)
    dict_list =[]
    for root,dirs,files in os.walk(basefile):  
        for file in files: 
            file_split_text_tuple = os.path.splitext(file)
            if len(file_split_text_tuple) !=2:
                continue
            if file_split_text_tuple[-1]!=".py":
                continue
            file_path =  os.path.join(root,file); 
            the_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, file))
            the_path = os.path.join(basefile,the_uuid)
            shutil.copyfile(file_path,the_path)
            dict_list.append({'script_name': file,'script_path':the_path})
    if len(dict_list) >0:
        connection.execute(target.insert(), *dict_list)


class Task(db.Model):
    __tablename__ = 'Task'

    #uuid = Column(String(36), primary_key=True, unique=True, nullable=False, default=lambda: str(uuid4()), comment='uuid')
    id = Column(Integer, primary_key=True, autoincrement=True, comment='task_id')
    ip = Column(String(46), nullable=False, comment='ip地址')
    script_name = Column(String(46), nullable=False, comment='脚本名称')
    times = Column(Integer, nullable=False, default=1, comment='运行次数')
    cycle = Column(Integer,default=0,comment="运行周期")
    task_run_status = Column(String(4),default="stop",comment="使用数")
    create_time = Column(DateTime, default=datetime.datetime.now, comment='创建时间')

    def __repr__(self):
        return str(self.ip+"|"+self.script_name)
    def to_json(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        if "create_time" in dict:
            dict["create_time"] = dict["create_time"].strftime("%Y-%m-%d %H:%M:%S")
        return dict



class Flag(db.Model):
    __tablename__ = 'Flag'

    #uuid = Column(String(36), primary_key=True, unique=True, nullable=False, default=lambda: str(uuid4()), comment='uuid')
    id = Column(Integer, primary_key=True, autoincrement=True, comment='flag_id')
    flag = Column(String(46), nullable=False, unique=True, comment='flag')
    ip = Column(String(46), nullable=False, comment='ip地址')
    flag_status = Column(String(8), default="未发送",nullable=False, comment='状态')
    create_time = Column(DateTime, default=datetime.datetime.now, comment='创建时间')

    def __repr__(self):
        return str(self.ip+"|"+self.flag)
    def to_json(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        if "create_time" in dict:
            dict["create_time"] = dict["create_time"].strftime("%Y-%m-%d %H:%M:%S")
        return dict

    #初始化数据
@event.listens_for(Flag.__table__, 'after_create')
def create_Flag(target, connection, **kw):
    pass
    '''
    iplist=["1","2","3","4"]
    flag_status_list =["未发送","已发送","发送失败"]
    dict_list =[]
    for i in range(65):
        flag_status =flag_status_list[random.randint(0,len(flag_status_list)-1)]
        ip =iplist[random.randint(0,len(iplist)-1)]
        dict_list.append({'ip': "192.168.1."+ip,"flag":str(uuid4()),"flag_status":flag_status})
    connection.execute(target.insert(), *dict_list)
    '''