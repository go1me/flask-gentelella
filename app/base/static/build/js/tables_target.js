
//新增target 响应
function add_new_target() {
    send_data={
                "ip":$("#add_ip_text_in_add_target_modal").val(),
                "group":$("#add_group_text_in_add_target_modal").val()
            }
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


//更新target 响应
function update_target() {
    send_data={
                "ip":$("#edit_ip_text_in_update_target_modal").val(),
                "group":$("#edit_group_text_in_update_target_modal").val()
            }
    console.log("update_target");
    console.log(send_data);
    $.ajax({
        type:"post",
        url:"/tables/update_target",
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
            alert("修改数据失败！888"+message);
                 
            }
    });
}

//清除
function clear_add_target_modal(){
    //默认保留，方便下次输入
    //$("#add_ip_text_in_add_target_modal").val('')
    //$("#add_ip_text_in_add_target_modal").val('') 
}

/**
 * 删除target
 */
 function delete_target(id) {
    send_data={
        "id":id
    }
    $.ajax({
        type:"post",
        url:"/tables/delete_target",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-target').DataTable().ajax.reload(null,false);
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert("删除数据失败！888"+id+message);
                 
            }
    });
}

function edit_target(id) {
    send_data={
        "id":id
    }
    console.log("edit_target");
    console.log(send_data)
    $.ajax({
        type:"post",
        url:"/tables/get_target_by_id",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            //设置回显用户数据
            //userId = message.userId //赋值给全局id，方便修改后使用
            console.log(message)
            console.log("update_target_modal_gogog")
            $("#edit_ip_text_in_update_target_modal").val(message.ip)
            $("#edit_group_text_in_update_target_modal").val(message.group)
            $("#update_target_modal").modal()
        },
        error: function (message) {
            console.log(message);
            alert("修改数据失败！888"+id+message);
                 
            }
    });
}


/**
 * 删除script
 */
 function delete_script(id) {
    send_data={
        "id":id
    }
    $.ajax({
        type:"post",
        url:"/tables/delete_script",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-script').DataTable().ajax.reload(null,false);
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert("删除数据失败！888"+id+message);
                 
            }
    });
}


function init_tables_target_DataTable() {
    var datatable_target = $('#datatable-target').DataTable({
        //dom: "Blfrtip",
        //https://blog.csdn.net/u010663021/article/details/114665976 参考
        dom: "<'row'<'col-md-3'B><'col-md-6'f>r<'col-md-2 text-right'l>>t<'row'<'col-md-6'i><'col-md-6 text-right'p>>",
        buttons: [
            {
                className: "btn-sm",
                text: '新建',
                action: function ( e, dt, node, config ) {
                    $("#add_target_modal").modal()
                    //https://blog.csdn.net/wsjzzcbq/article/details/107867480
                }
            },
            {
                extend: "copy",
                text: '拷贝',
                className: "btn-sm"
            },
            {
                extend: "csv",
                text: '导出csv',
                className: "btn-sm"
            },
            {
                extend: "excelHtml5",
                className: "btn-sm"
            },
            {
                text: 'Reload',
                text: '刷新',
                className: "btn-sm",
                action: function ( e, dt, node, config ) {
                    dt.ajax.reload();
                }
            }
        ],
        "ajax": {
            // "url": "static/objects2.txt", // This works for a static file
            "url": "/tables/get_targets", // This now also works
            "dataType": "json",
            "dataSrc": "data",
            "contentType":"application/json"
        },
        "columns": [
            {"data":"id",title:"id"},
            {"data":"ip", title:"ip"},
            {"data":"group", title:"分组"},
            {"data":"status",title:"在线"},
            {"data":"flag_number",title:"flag数"},
            {"data":"create_time",title:"创建时间"},
            {
                title:"操作",
                "orderable" : false,
                //"targets" : 2,//操作按钮目标列
                "data" : null,
                //"sWidth" :"250px",
                'sClass': "text-center",
                "render" : function(data, type,row,meta) {
                    var id = '"' + row.id + '"';
                    var html = "";
                    //html += "<button onclick='edit_target("+ id +")' style='margin-right:10px;'  class='down btn btn-default '>编辑</button>"
                    html += "<a href='javascript:void(0);'   onclick='edit_target("+id+ ")'  class='down btn btn-default '> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='delete_target("+id+ ")'  class='down btn btn-default '> 删除</a>"
                    return html;
                }
            }

        ],
        responsive: true,
      'order': [[ 1, 'asc' ]],
      'columnDefs': [
        {
            'targets': 0,
            'checkboxes': {
                'selectRow': true
            }
        }
      ],
      'select': {
        'style': 'multi'
     },
    });

    

    var datatable_script = $('#datatable-script').DataTable({
        //dom: "Blfrtip",
        dom: "<'row'<'col-md-3'B><'col-md-6'f>r<'col-md-2 text-right'l>>t<'row'<'col-md-6'i><'col-md-6 text-right'p>>",
        buttons: [
            {
                className: "btn-sm",
                text: '导入python',
                action: function ( e, dt, node, config ) {
                    $("#upload_script_modal").modal()
                }
            },
            {
                extend: "copy",
                text: '拷贝',
                className: "btn-sm"
            },
            {
                extend: "csv",
                text: '导出csv',
                className: "btn-sm"
            },
            {
                extend: "excelHtml5",
                className: "btn-sm"
            },
            {
                text: 'Reload',
                text: '刷新',
                className: "btn-sm",
                action: function ( e, dt, node, config ) {
                    dt.ajax.reload();
                }
            }
        ],
        "ajax": {
            // "url": "static/objects2.txt", // This works for a static file
            "url": "/tables/get_scripts", // This now also works
            "dataType": "json",
            "dataSrc": "data",
            "contentType":"application/json"
        },
        "columns": [
            {"data":"id",title:"id"},
            {"data":"script_name", title:"脚本名称"},
            {"data":"used_number",title:"使用数"},
            {"data":"create_time",title:"更新时间"},
            {
                title:"操作",
                "orderable" : false,
                //"targets" : 2,//操作按钮目标列
                "data" : null,
                //"sWidth" :"250px",
                'sClass': "text-center",
                "render" : function(data, type,row,meta) {
                    var id = '"' + row.id + '"';
                    var html = "";
                    html += "<a href='javascript:void(0);'   onclick='delete_script("+id+ ")'  class='down btn btn-default '> 删除</a>"
                    return html;
                }
            }
        ],
        responsive: true,
      'order': [[ 1, 'asc' ]],
      'columnDefs': [
        {
            'targets': 0,
            'checkboxes': {
                'selectRow': true
            }
        }
      ],
      'select': {
        'style': 'multi'
     },
    });


    //提交选择的目标和脚本到后台
    /*$('#frm-example').on('submit', function(e){
        var form = this;

        var target_selected = datatable_target.column(0).checkboxes.selected();
        var script_selected = datatable_script.column(0).checkboxes.selected();

        var script_selected_list = [];
        $.each(script_selected, function(index, rowId){
            script_selected_list.push(rowId)
        });

        var target_selected_list = [];
        $.each(target_selected, function(index, rowId){
            target_selected_list.push(rowId)

        });

        selected_data={"targets":target_selected_list,"script":script_selected_list}

        $.ajax({   
            contentType: 'application/json',
            type: 'POST',
            url: "/tables/post_select_items",
            dataType: "json",
               data: JSON.stringify(selected_data),
            success: function (message) {
                console.log(message);
                },
            error: function (message) {
                console.log(message);
                alert("提交数据失败！888"+message);
                     
                }
        }); 
    });*/

}


$(document).ready(function() {
    init_tables_target_DataTable();
});	