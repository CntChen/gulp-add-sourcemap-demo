## gulp构建流程添加sourcemap
>这篇文章介绍在gulp构建中添加sourcemap，对打包后压缩后的代码方便地进行debug。

## 背景
公司的前端工程使用gulp进行构建，构建流程经过**webpack打包**和**[gulp-uglify][gulp-uglify]代码压缩**。打包和压缩后的代码在浏览器的出错，很难定位到源码位置。所以需要使用sorcemap来映射导源码，方便debug。

## 引入
* sourcemaps
关于sourcemaps可以看这篇文章：[JavaScript Source Map 详解][JavaScript Source Map 详解]

## webpack添加sourcemap
* webpack配置
```
webpackConfig.output = {
    ...
    sourceMapFilename: '[file].map.js',
  };
webpackConfig.devtool = 'source-map';
```

* 使用pulgin的方式
```
webpackConfig.plugins.push(new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
        }));
```

### gulp-uglify添加sourcemap
使用[gulp-sourcemaps][sulp-sourcemaps]
[sulp-sourcemaps]:https://www.npmjs.com/package/gulp-sourcemaps
```
gulp.task('uglify:' + channel, function() {
return gulp.src('_tmp/**/*.js')
  .pipe(sourcemaps.init({
    loadMaps: true, // 关键配置
  }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest));
});
```



## References
[gulp-uglify]:https://github.com/terinjokes/gulp-uglify

* JavaScript Source Map 详解
>http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
[JavaScript Source Map 详解]:http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
