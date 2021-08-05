import datetime
#from uuid import uuid4
from sqlalchemy import DateTime, Column, Integer, String, event
from app import db

class Target(db.Model):
    __tablename__ = 'Target'

    #uuid = Column(String(36), primary_key=True, unique=True, nullable=False, default=lambda: str(uuid4()), comment='uuid')
    id = Column(Integer, primary_key=True, autoincrement=True, comment='target_id')
    ip = Column(String(46), nullable=False, unique=True, comment='ip地址')
    status = Column(String(4), default="down", comment='ip地址')
    flag_number = Column(Integer,default=0,comment="flag数")
    create_time = Column(DateTime, default=datetime.datetime.now, comment='修改时间')
    #update_at = db.Column(db.DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)

    def __repr__(self):
        return str(self.ip)+str(self.create_time)
    def to_json(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
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
    for i in range(15):
        dict_list.append({'ip': "192.168.1."+str(i)})
    connection.execute(target.insert(), *dict_list)
    #connection.execute(target.insert(), {'ip': "192.168.1.1"}, {'ip': "192.168.1.2"}, {'ip': "192.168.1.3"})


class Script(db.Model):
    __tablename__ = 'Script'

    #uuid = Column(String(36), primary_key=True, unique=True, nullable=False, default=lambda: str(uuid4()), comment='uuid')
    id = Column(Integer, primary_key=True, autoincrement=True, comment='script_id')
    script_name = Column(String(46), nullable=False, unique=True, comment='脚本名称')
    used_number = Column(Integer,default=0,comment="使用数")
    create_time = Column(DateTime, default=datetime.datetime.now, comment='修改时间')

    def __repr__(self):
        return str(self.ip)
    def to_json(self):
        dict = self.__dict__
        if "_sa_instance_state" in dict:
            del dict["_sa_instance_state"]
        return dict


#初始化数据
@event.listens_for(Script.__table__, 'after_create')
def create_Script(target, connection, **kw):
    dict_list =[]
    for i in range(11):
        dict_list.append({'script_name': "t"+str(i)+".py"})
    connection.execute(target.insert(), *dict_list)
