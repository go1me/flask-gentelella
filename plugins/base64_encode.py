import base64
import datetime
plugin_name = "base64加密" #插件名称，重要，不能重复，必选
plugin_version = "v1.1"
plugin_author = "1me"
plugin_time = "20200429"
plugin_test_in="flag"#测试用例的输入，结合导入测试用例功能使用
plugin_test_out="ZmxhZw=="#测试用例的输出
plugin_info = "base64加密，需要import base64" #插件信息，可以写一些demo，必选

#插件运行函数
def run(arg,return_list):

    result = base64.b64encode(arg.encode('utf-8'))
    result_dict = {
        "plugin_name":plugin_name,
        "plugin_version":plugin_version,
        "plugin_run_time":datetime.datetime.now(),
        "plugin_run_arg":arg,
        "plugin_run_result":result,
    }
    return_list.append(result_dict)
    print("--------",return_list)
    return result_dict