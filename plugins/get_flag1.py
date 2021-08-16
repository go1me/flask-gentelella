import datetime
import uuid
import random
plugin_name = "getflag1" #插件名称，重要，不能重复，必选
plugin_version = "v1.1"
plugin_author = "1me"
plugin_time = "20210813"
plugin_test_in=""#测试用例的输入，结合导入测试用例功能使用
plugin_test_out=""#测试用例的输出
plugin_info = "获取flag的Demo" #插件信息，可以写一些demo，必选

#插件运行函数
def run(arg,record_return_value_scheduler):
    #arg为ip

    #获取flag
    flag = str(uuid.uuid4())
    send_result= "未发送"

    #发送flag

    send_result_list = ["已发送","发送失败"]
    send_result =send_result_list[random.randint(0,len(send_result_list)-1)]

    result_dict = {
        "plugin_name":plugin_name,
        "plugin_version":plugin_version,
        "plugin_run_time":datetime.datetime.now(),
        "arg":arg,
        "flag":flag,
        "operation":"get_flag",#如果是获取flag，这个标签不变
        "result":send_result
    }
    record_return_value_scheduler(result_dict)
    print("--------",result_dict)
    return result_dict