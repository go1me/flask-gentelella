import datetime
import uuid
plugin_name = "getflag1" #插件名称，重要，不能重复，必选
plugin_version = "v1.1"
plugin_author = "1me"
plugin_time = "20210813"
plugin_test_in=""#测试用例的输入，结合导入测试用例功能使用
plugin_test_out=""#测试用例的输出
plugin_info = "获取flag的Demo" #插件信息，可以写一些demo，必选

#插件运行函数
def run(arg,record_return_value_scheduler):

    result = str(uuid.uuid4())
    result_dict = {
        "plugin_name":plugin_name,
        "plugin_version":plugin_version,
        "plugin_run_time":datetime.datetime.now(),
        "plugin_run_result":{"arg":arg,"flag":result},
    }
    record_return_value_scheduler(result_dict)
    print("--------",result_dict)
    return result_dict