## gulp构建流程添加Source Map
>这篇文章介绍在gulp构建中添加source map，对打包和压缩后的代码方便地进行debug和生产上的异常定位。

## 背景
公司的前端工程使用[gulp][gulp]进行构建，构建流程经过**[webpack][webpack]打包**和**[gulp-uglify][gulp-uglify]代码压缩**。打包和压缩后的代码在浏览器的出错，很难定位到源码位置。所以需要使用source map来映射到源码，方便开发debug和生产上的异常定位。

### 为什么不在webpack中直接uglify？
源文件中的`js`和`css`等资源带有一些用于构建的注释代码，使用`new webpack.optimize.UglifyJsPlugin()`导致有用的注释代码丢失。所以webpack不进行uglify，uglify在构建完成后使用gulp-uglify进行。

### 关于Source Map
关于sourcemaps可以看这篇文章：[JavaScript Source Map 详解][JavaScript Source Map 详解]

## webpack添加sourcemap
* 使用webpack配置
```
webpackConfig.output = {
    ...
    sourceMapFilename: '[file].map.js',
  };
webpackConfig.devtool = 'source-map';
```

* 或使用pulgin的方式
```
webpackConfig.plugins.push(new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
        }));
```

### gulp-uglify添加sourcemap
使用[gulp-sourcemaps][sulp-sourcemaps]
[sulp-sourcemaps]:https://www.npmjs.com/package/gulp-sourcemaps
```
gulp.task('uglify', function() {
return gulp.src('_tmp/**/*.js')
  .pipe(sourcemaps.init({
    loadMaps: true, // 关键配置
  }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest));
});
```

## 坑
### `gulp.dest`未生成文件就执行下一个任务
问题场景：webpack构建后文件是放在`_tmp`临时文件夹，然后复制到`dist`发布目录，在复制后在`dist`中对`js`和`css`进行uglify，结果uglify没有匹配到文件，所以没有uglify。
我的代码是这样：
```
gulp.task('uglify', function(done) {
   gulp.src('_tmp/**/*.js')
  .pipe(sourcemaps.init({
    loadMaps: true, // 关键配置
  }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest));

  done();
});
```
github 已经有issue：[task not waiting for dependency to finish][task not waiting for dependency to finish]
问题原因：`gulp.dest`触发后并不等待文件存储完成，而直接调用了`done`，所以下一个`uglify`的任务在匹配文件时，文件还未生成完毕，所以没有执行uglify。

## TODO
* 开启测试服务器
* https://github.com/isaacs/node-glob 用来优化工程的sourcemap构建选择
* gulp-change 优化构建时间
* 不构建使用require来引入的文件 `重点`


## References
[gulp]:https://github.com/gulpjs/gulp
[webpack]:https://github.com/webpack/webpack
[gulp-uglify]:https://github.com/terinjokes/gulp-uglify

* JavaScript Source Map 详解
>http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
[JavaScript Source Map 详解]:http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html

[task not waiting for dependency to finish]:https://github.com/gulpjs/gulp/issues/899
