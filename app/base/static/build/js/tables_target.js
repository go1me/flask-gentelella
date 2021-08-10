
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
            alert(message.responseJSON);
                 
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
            alert(message.responseJSON);
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
            alert(message.responseJSON);
            }
    });
}


/**
 * 删除script
 */
 function delete_task(id) {
    send_data={
        "id":id
    }
    $.ajax({
        type:"post",
        url:"/tables/delete_task",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-task').DataTable().ajax.reload(null,false);
            $('#datatable-script').DataTable().ajax.reload(null,false);
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert("删除数据失败！888"+id+message);
                 
            }
    });
}


var task_status = 0;
function run_task(id) {
    send_data={
        "id":id
    }
    $.ajax({
        type:"post",
        url:"/tables/run_task",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            console.log(message);
            //post请求返回值改变按钮状态
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
                "data" : "",
                //"sWidth" :"250px",
                'sClass': "text-center",
                "render" : function(data, type,row,meta) {
                    var id = '"' + row.id + '"';
                    var html = "";
                    //html += "<button onclick='edit_target("+ id +")' style='margin-right:10px;'  class='down btn btn-default '>编辑</button>"
                    html += "<a href='javascript:void(0);'   onclick='edit_target("+id+ ")'  class='down btn btn-primary btn-xs'> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='delete_target("+id+ ")'  class='down btn btn-dark btn-xs'> 删除</a>"
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
            {"data":"create_time",title:"创建时间"},
            {
                title:"操作",
                "orderable" : false,
                //"targets" : 2,//操作按钮目标列
                "data" : "",
                //"sWidth" :"250px",
                'sClass': "text-center",
                "render" : function(data, type,row,meta) {
                    var id = '"' + row.id + '"';
                    var html = "";
                    html += "<a href='javascript:void(0);'   onclick='delete_script("+id+ ")'  class='down btn btn-dark btn-xs'> 删除</a>"
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



    var datatable_task = $('#datatable-task').DataTable({
        //dom: "Blfrtip",
        dom: "<'row'<'col-md-3'B><'col-md-6'f>r<'col-md-2 text-right'l>>t<'row'<'col-md-6'i><'col-md-6 text-right'p>>",
        buttons: [
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
            "url": "/tables/get_task", // This now also works
            "dataType": "json",
            "dataSrc": "data",
            "contentType":"application/json"
        },
        "columns": [
            {"data":"id",title:"id"},
            {"data":"ip", title:"ip地址"},
            {"data":"script_name", title:"脚本名称"},
            {"data":"times",title:"运行次数"},
            {"data":"cycle",title:"运行周期"},
            {"data":"task_run_status",title:"状态"},
            {"data":"create_time",title:"创建时间"},
            {
                title:"操作",
                "orderable" : false,
                //"targets" : 2,//操作按钮目标列
                "data" : "",
                //"sWidth" :"250px",
                'sClass': "text-center",
                "render" : function(data, type,row,meta) {
                    var id = '"' + row.id + '"';
                    var html = "";
                    html += "<a href='javascript:void(0);'   onclick='edit_task("+id+ ")'  class='down btn btn-primary btn-xs'> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='run_task("+id+ ")'  class='down btn btn-success btn-xs'> 启动</a>"
                    //html += "<a href='javascript:void(0);'   onclick='edit_target("+id+ ")'  class='down btn btn-danger btn-xs'> 停止</a>"
                    html += "<a href='javascript:void(0);'   onclick='delete_task("+id+ ")'  class='down btn btn-dark btn-xs'> 删除</a>"
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



    var dropzone_upload_script_modal=$("#dropzone_upload_script_modal").dropzone({
        url: "/tables/upload_script", //必须填写
        method:"post",  //也可用put
        //paramName:"Filedata", //默认为file
        maxFiles: 10, //最大上传数量
        maxFilesize:5, // MB 单个文件大小上限
        filesizeBase:1024,
        acceptedFiles: ".py,.txt,.zip",
        addRemoveLinks: true,
        clickable: true,
        autoProcessQueue: true, // true:自动上传，一次性上传parallelUploads个文件，上传成功后后面排队的其他队伍也会继续排队上传。false:关闭自动上传, 手动调度 ,但每次需要点击“上传”按钮才会触发上传，排队的其他文件不会自动上传。 
        parallelUploads: 2, //最大并行处理量（一次同时上传的个数，不设置的话，默认：2个）
        dictInvalidFileType: '仅支持以下格式文件：.py,.txt,.zip',
        dictFileTooBig: '文件超出最大5M约束',
        dictMaxFilesExceeded: '超出最大上传数量',
        dictCancelUpload: '取消上传',
        dictRemoveFile: '删除',
        dictCancelUploadConfirmation: '确认取消上传',
        dictResponseError:"文件上传失败!",
        dictDefaultMessage:"<span class='bigger-150 bolder'><i class='icon-caret-right red'></i>拖动文件</span>上传\ <span class='smaller-80 gre'>(或者点击上传)<br>支持 .py, requiremets.txt</span> <br /> \ <i class='upload-icon icon-cloud-upload blue icon-3x'></i>",
        init:function(){
            this.on("addedfile", function(file) { 
            //上传文件时触发的事件
            //console.log("addedfile");
            });
            this.on("queuecomplete",function(file) {
                //上传完成后触发的方法
                console.log("queuecomplete");
                alertify.notify(file.file+'上传成功.', 'success', 5);
            });
            this.on("removedfile",function(file){
                //删除文件时触发的方法
                console.log("removedfile");
                 });
            this.on("success", function (file, data) {
            //假设服务器返回data:{id:88}
            //file.id=data.id;
            
            });

            var _this = this;
            document.querySelector("#upload_script_modal_close_button").addEventListener("click", function() {
                // Using "_this" here, because "this" doesn't point to the dropzone anymore
                _this.removeAllFiles();
                datatable_script.ajax.reload();
                // If you want to cancel uploads as well, you
                // could also call _this.removeAllFiles(true);
              });
        

            
        }
 
    });
    
    //提交选择的目标和脚本到后台
    $('#target_scrip_frm').on('submit', function(e){
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

        var script_run_times = $('#script_run_times').val();
        var script_run_cycle = $('#script_run_cycle').val();

        selected_data={
            "targets_list":target_selected_list,
            "scripts_list":script_selected_list,
            "times":script_run_times,
            "cycle":script_run_cycle}

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
    });

}


$(document).ready(function() {
    init_tables_target_DataTable();
});	