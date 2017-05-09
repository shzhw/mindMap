"use strict"
var gulp = require("gulp"),
    uglify = require("gulp-uglify"),//js压缩
    less = require("gulp-less"),//编译less
    minCss = require("gulp-clean-css"),//css压缩
    imageMin = require("gulp-imagemin"),//压缩图片
    htmlmin = require("gulp-htmlmin"),
    rename = require("gulp-rename"),//重命名 
    connect = require("gulp-connect"),//刷新
    rev = require("gulp-rev"),//给文件+MD5后缀
    revCollector = require("gulp-rev-collector"),//替换路径
    concat = require("gulp-concat");//合并文件

var config ={
  _src:{
        js:["src/js/*.js","!src/js/*.min.js"],
        minJs:"src/js/*.min.js",
        css:["src/css/*.css","!src/css/*.min.css"],
        less:"src/css/*.less",
        images:["src/images/*.*","!src/images/*.psd"],
        html:"src/*.html"
       },
  _task:[ "dealPic",
          "dealJs",
          "dealLess",
          "dealCss",
          "dealHtml"
        ]
}

//js 合并 压缩
gulp.task("dealJs",function(){
  // gulp.src(config._src.minJs)
  //   .pipe(gulp.dest("dist/js/"))
  //   .pipe(connect.reload());

  gulp.src(config._src.js)
    .pipe(concat("base.js"))
    .pipe(uglify())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/js/"))
})
//less
.task("dealLess",function(){
  gulp.src(config._src.less)
    .pipe(less())
    .pipe(gulp.dest("src/css/"))
})
//css 合并 压缩
.task("dealCss",function(){
  gulp.src(config._src.css)
    .pipe(concat("common.css"))
    .pipe(minCss())
    .pipe(rename(function(path){
      path.basename += ".min"
    }))
    .pipe(gulp.dest("dist/css/"))
})
//pic
.task("dealPic",function(){
  gulp.src(config._src.images)
    .pipe(imageMin())
    .pipe(gulp.dest("dist/images/"))
})
//html 压缩
.task("dealHtml",function(){
  gulp.src(config._src.html)
    // .pipe(htmlmin())
    .pipe(gulp.dest("dist/"))
})
//webserver
.task("connect",function(){
  connect.server({
    port:8066,
    livereload:true,
    root:"src",
    livereload: true
  })
})
.task("refresh",function(){
  gulp.src("*")
      .pipe(connect.reload());
})
//监听
.task("_watch",function(){
  var _url = [];
  for(var key in config._src){
    _url.push(config._src[key])
  }
  gulp.watch(config._src.less,["dealLess"])
  gulp.watch(_url,["refresh"])
  // gulp.watch(config._src.js,["dealJs"])
  // gulp.watch(config._src.css,["dealCss"])
  // gulp.watch(config._src.less,["dealLess"])
  // gulp.watch(config._src.images,["dealPic"])
  // gulp.watch(config._src.html,["dealHtml"]);
})

.task('dist',["dealLess","dealCss","dealJs","dealPic","dealHtml"])
.task('default',["connect","_watch"]);





