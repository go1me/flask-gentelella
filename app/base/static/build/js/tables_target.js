
//新增target 响应
function add_new_target() {
    send_data={"ip":$("#add_ip_text_in_add_target_modal").val()}
    $.ajax({
        type:"post",
        url:"/tables/add_target",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-target').DataTable().ajax.reload(null,false);
            //清空添加表单数据
            clear_add_target_modal();
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert("提交数据失败！888"+message);
                 
            }
    });
}

function clear_add_target_modal(){
    $("#add_ip_text_in_add_target_modal").val('')
}

