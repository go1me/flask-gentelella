
//新增flag 响应
function add_new_flag() {
    send_data={
                "flag":$("#add_flag_text_in_add_flag_modal").val(),
                "ip":$("#add_ip_text_in_add_flag_modal").val(),
                "flag_status":$("#flag_status_in_add_flag_modal").val()
            }
    $.ajax({
        type:"post",
        url:"/ctf/add_flag",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-flag').DataTable().ajax.reload(null,false);
            //清空添加表单数据
            clear_add_flag_modal();
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert(message.responseJSON);
                 
            }
    });
}


//更新flag 响应
function update_flag() {
    send_data={
                "flag":$("#edit_flag_text_in_update_flag_modal").val(),
                "flag_status":$("#flag_status_in_update_flag_modal").val()
            }
    $.ajax({
        type:"post",
        url:"/ctf/update_flag",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-flag').DataTable().ajax.reload(null,false);
            //清空添加表单数据
            clear_add_flag_modal();
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert("修改数据失败！888"+message);
                 
            }
    });
}

//清除
function clear_add_flag_modal(){
    //默认保留，方便下次输入
    //$("#add_ip_text_in_add_flag_modal").val('')
    //$("#add_ip_text_in_add_flag_modal").val('') 
}

/**
 * 删除flag
 */
 function delete_flag(id) {
    send_data={
        "id":id
    }
    if (!confirm("确认要删除？就怕您点错了")) { 
        return
    } 
    
    $.ajax({
        type:"post",
        url:"/ctf/delete_flag",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            // 刷新表格数据，分页信息不会重置
            $('#datatable-flag').DataTable().ajax.reload(null,false);
            console.log(message);
        },
        error: function (message) {
            console.log(message);
            alert(message.responseJSON);
            }
    });
}

function edit_flag(id) {
    send_data={
        "id":id
    }
    $.ajax({
        type:"post",
        url:"/ctf/get_flag_by_id",
        dataType: "json",
        contentType:"application/json",
        async:true,
        data:JSON.stringify(send_data),
        success:function(message){
            //设置回显用户数据
            //userId = message.userId //赋值给全局id，方便修改后使用
            console.log(message)
            console.log("update_flag_modal_gogog")
            $("#edit_flag_text_in_update_flag_modal").val(message.flag)
            $("#flag_status_in_update_flag_modal").val(message.flag_status)
            $("#update_flag_modal").modal()
        },
        error: function (message) {
            console.log(message);
            alert("修改数据失败！888"+id+message);
                 
            }
    });
}



function init_tables_flag_DataTable() {
    var datatable_flag = $('#datatable-flag').DataTable({
        //dom: "Blfrtip",
        //https://blog.csdn.net/u010663021/article/details/114665976 参考
        dom: "<'row'<'col-md-3'B><'col-md-6'f>r<'col-md-2 text-right'l>>t<'row'<'col-md-6'i><'col-md-6 text-right'p>>",
        buttons: [
            {
                className: "btn-sm",
                text: '新增',
                action: function ( e, dt, node, config ) {
                    $("#add_flag_modal").modal()
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
            "url": "/ctf/get_flags", // This now also works
            "dataType": "json",
            "dataSrc": "data",
            "contentType":"application/json"
        },
        "columns": [
            {"data":"id",title:"id"},
            {"data":"flag", title:"flag"},
            {"data":"ip", title:"ip"},
            {"data":"flag_status",title:"状态"},
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
                    //html += "<button onclick='edit_flag("+ id +")' style='margin-right:10px;'  class='down btn btn-default '>编辑</button>"
                    html += "<a href='javascript:void(0);'   onclick='edit_flag("+id+ ")'  class='down btn btn-primary btn-xs'> 编辑</a>"
                    html += "<a href='javascript:void(0);'   onclick='send_flag("+id+ ")'  class='down btn btn-info btn-xs'> 发送</a>"
                    html += "<a href='javascript:void(0);'   onclick='delete_flag("+id+ ")'  class='down btn btn-dark btn-xs'> 删除</a>"
                    return html;
                }
            }

        ],
        responsive: true,
        "autoWidth": false,
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

    



    var dropzone_upload_send_flag_modal=$("#dropzone_upload_send_flag_modal").dropzone({
        url: "/ctf/upload_send_flag", //必须填写
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
            document.querySelector("#upload_send_flag_modal_close_button").addEventListener("click", function() {
                // Using "_this" here, because "this" doesn't point to the dropzone anymore
                _this.removeAllFiles();
                //datatable_send_flag.ajax.reload();
                // If you want to cancel uploads as well, you
                // could also call _this.removeAllFiles(true);
              });
        

            
        }
 
    });

}

function init_flag_echarts() {
    if ($('#flag_echart_bar_y_category_stack').length ){
			  
        var echartBar = echarts.init(document.getElementById('flag_echart_bar_y_category_stack'));

        option ={
          title: {
            text: 'Graph title',
            subtext: 'Graph Sub-text'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // Use axis to trigger tooltip
                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            data: ['已发送', '未发送', '发送失败']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                name: '已发送',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: []
            },
            {
                name: '未发送',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: []
            },
            {
                name: '发送失败',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: []
            }
        ]
        };

        $.ajax({
            cache: false,
            type: "POST",
            url: "/get_flag_for_bar_y_category_stack", //把表单数据发送到/viewdata
            data: null, // 发送的数据
            dataType : "json",  //返回数据形式为json
            async: false,
            error: function(request) {
                console.log(request);
                echartBar.setOption(option);
                alert(request.responseJSON);
            },
            success: function(result) {
                //console.log(result);
                for (i = 0, max = result.ips.length; i < max; i++) { //注意：result.Goods_name.length
                    option.yAxis[0].data.push(result.ips[i]);
                    option.series[0].data.push(result.flags_send[i]);//已发送
                    option.series[1].data.push(result.flags_un_send[i]);//未发送
                    option.series[2].data.push(result.flags_send_error[i]);//发送失败
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        });

        

    }
}


$(document).ready(function() {
    init_tables_flag_DataTable();
    init_flag_echarts();
});	