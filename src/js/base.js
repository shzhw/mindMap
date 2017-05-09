;"use strict";
$(function($){
    var mind = {},
        options,
        jm;

    options = {
      container:'jsmind_container',
      theme:'default',
      editable:true
    }
   mind = {
    "meta":{
        "name":"example",
        "author":"hizzgdev@163.com",
        "version":"0.2"
    },
    "format":"node_array",
    "data":[
            {"id":"root", "isroot":true, "topic":"中心主题"},
            {"id":"easy", "parentid":"root", "topic":"子主题", "direction":"left"}
           ]
    };

    jm = new jsMind(options);
    jm.show(mind); 

    $("#jsmind_container").draggable({cancel:"jmnode"});

    $(document).on("keydown mousewheel",function(e){
      var e = e || window.event;
      if( e.originalEvent.ctrlKey ){
        if(e.originalEvent.wheelDelta>0){
          jm.view.zoomIn();
        }else if(e.originalEvent.wheelDelta<0){
          jm.view.zoomOut()
        }
        return false
      }
     
    })
    .on("click","#resetZoom",function(){
      jm.view.setZoom(1);
    })

    //右键菜单
    
    //主菜单
    .on("click","#logo_icon",function(){
      $("#main_menu").animate({
        "width":"620",
      },200)
      return false
    })
    .on("click","#close_menu",function(e){
      closeMainMenu();
    })
    .on("click","body",function(){
      closeMainMenu();
    })
    .on("click","#main_menu",function(e){
      e.stopPropagation();
    })
    .on("mousedown","#save,#open",function(){
      //saveJm(jm);
      closeMainMenu()
      return false
    })
    //保存
    .on("click","#save_confirm",function(){
      var selected = getSelectResult(".option","active");
      if(selected == 0 ){
        savePng(jm);
      }else if(selected == 1){
        saveJm(jm);
      }else if(selected == -1){
        alert("请选择文件类型");
        return
      }
      $(this).parents(".modal").find(".close").click();
    })
     //打开jm文件
    .on("click","#open_confirm",function(){
      open_file(jm);
    })
    //主菜单 保存 弹出
    .on("click",".option",function(){

      if(!$(this).hasClass("active")){
        $(this).addClass("active").find(".option_icon").removeClass("fa-square-o").addClass("fa-check-square-o");

      }else{
        $(this).removeClass("active").find(".option_icon").removeClass("fa-check-square-o").addClass("fa-square-o");
      }
    })
    //双击编辑
    .on("dblclick",function(){
      var node = jm.get_selected_node();
      jm.begin_edit(node)
    })
    // //test
    // .on("keydown",function(e){
    //   console.log(e.keyCode);
    // })
});

function closeMainMenu(e){
  $("#main_menu").animate({
        "width":"0",
      },200);
}

function saveJm(jm){
  var mind_data = jm.get_data('node_array');
  var mind_name = mind_data.meta.name;
  var mind_str = jsMind.util.json.json2string(mind_data);
  jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.jm');
}

function savePng(jm){
  jm.screenshot.shootDownload();
}

function getSelectResult(elems,className){
  var result = -1
  $(elems).each(function(i,e){
    if($(e).hasClass(className)) 
      result = i
  })
  return result
}

function open_file(jm){
  var file_input = $("#toOpenFile")[0];
  var files = file_input.files;
  if(files.length > 0){
      var file_data = files[0];
      jsMind.util.file.read(file_data,function(jsmind_data, jsmind_name){
          var mind = jsMind.util.json.string2json(jsmind_data);
          if(!!mind){
              jm.show(mind);
          }else{
              alert('can not open this file as mindmap');
          }
      });
  }else{
      alert('please choose a file first')
  }
}