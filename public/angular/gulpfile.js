var gulp    = require('gulp');
var fs      = require('fs');
var plugins = require('gulp-load-plugins')();
var es      = require('event-stream');
var del     = require('del');

var publicFolderPath = '..';

var paths = {
  appJavascript:     ['src/app/app.js', 'src/app/**/*.js'],
  appTemplates:      'src/views/**/*.html',
  appMainSass:       'src/scss/main.scss',
  appStyles:         'src/css/**/*.css',
  appImages:         'src/images/**/*',
  appMainTemplates:  'src/views/**/*.html',
  appBower:          'src/bower_components/**/*',
  indexHtml:         'src/index.html',
  finalAppJsPath:    '/js/app.js',
  finalAppCssPath:   '/css/app.css',
  publicFolder:      publicFolderPath,
  publicJavascript:  publicFolderPath + '/js',
  publicAppJs:       publicFolderPath + '/js/app.js',
  publicCss:         publicFolderPath + '/css',
  publicImages:      publicFolderPath + '/images',
  publicTemplates:   publicFolderPath + '/views',
  publicIndex:       publicFolderPath + '/angular.html',
  publicBower:       publicFolderPath + '/bower_components',
  publicJsManifest:  publicFolderPath + '/js/rev-manifest.json',
  publicCssManifest: publicFolderPath + '/css/rev-manifest.json'
};

gulp.task('scripts-dev', function() {
  return gulp.src(paths.appJavascript)
    //.pipe(plugins.if(/html$/, buildTemplates()))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('app.js'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.publicJavascript));
});
gulp.task('scripts-prod', function() {
  return gulp.src(paths.appJavascript)
    //.pipe(plugins.if(/html$/, buildTemplates()))
    .pipe(plugins.concat('app.js'))
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify())
    .pipe(plugins.rev())
    .pipe(gulp.dest(paths.publicJavascript))
    .pipe(plugins.rev.manifest({path: 'rev-manifest.json'}))
    .pipe(gulp.dest(paths.publicJavascript));
});

gulp.task('styles-dev', function() {
  return gulp.src(paths.appStyles)
    //.pipe(plugins.if(/scss$/, plugins.sass()))
    //.pipe(plugins.concat('src.css'))
    .pipe(gulp.dest(paths.publicCss));
});

gulp.task('styles-prod', function() {
  return gulp.src(paths.appStyles)
    //.pipe(plugins.if(/scss$/, plugins.sass()))
    //.pipe(plugins.concat('app.css'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rev())
    .pipe(gulp.dest(paths.publicCss))
    .pipe(plugins.rev.manifest({path: 'rev-manifest.json'}))
    .pipe(gulp.dest(paths.publicCss));
});

gulp.task('images', function() {
  return gulp.src(paths.appImages)
    .pipe(gulp.dest(paths.publicImages));
});

gulp.task('templates-dev', function() {
  return gulp.src(paths.appMainTemplates)
      .pipe(gulp.dest(paths.publicTemplates));
});

gulp.task('indexHtml-dev', ['scripts-dev', 'styles-dev'], function() {
  var manifest = {
    js: paths.finalAppJsPath,
    css: paths.finalAppCssPath
  };

  return gulp.src(paths.indexHtml)
    .pipe(plugins.template({css: manifest['css'], js: manifest['js']}))
    .pipe(plugins.rename('angular.html'))
    .pipe(gulp.dest(paths.publicFolder));
});

gulp.task('indexHtml-prod', ['scripts-prod', 'styles-prod'], function() {
  var jsManifest  = JSON.parse(fs.readFileSync(paths.publicJsManifest, 'utf8'));
  var cssManifest = JSON.parse(fs.readFileSync(paths.publicCssManifest, 'utf8'));

  var manifest = {
    js: '/js/' + jsManifest['app.js'],
    css: '/css/' + cssManifest['app.css']
  };

  return gulp.src(paths.indexHtml)
    .pipe(plugins.template({css: manifest['css'], js: manifest['js']}))
    .pipe(plugins.rename(paths.publicIndex))
    .pipe(gulp.dest(paths.publicFolder));
});

gulp.task('bower-dev', function() {
  return gulp.src(paths.appBower)
      .pipe(gulp.dest(paths.publicBower));
});

gulp.task('testem', function() {
  return gulp.src(['']) // We don't need files, that is managed on testem.json
    .pipe(plugins.testem({
      configFile: 'testem.json'
    }));
});

gulp.task('clean', function(cb) {
  del([paths.publicJavascript, paths.publicImages, paths.publicCss, paths.publicIndex], {force: true}, cb);
});

gulp.task('watch', ['indexHtml-dev', 'images', 'templates-dev', 'bower-dev', 'scripts-dev'], function() {
  gulp.watch(paths.appJavascript, ['scripts-dev']);
  gulp.watch(paths.appImages, ['images-dev']);
  gulp.watch(paths.indexHtml, ['indexHtml-dev']);
  gulp.watch(paths.appStyles, ['styles-dev']);
  gulp.watch(paths.appMainTemplates, ['templates-dev']);
  gulp.watch(paths.appBower, ['bower-dev']);
});

gulp.task('default', ['watch']);
gulp.task('production', ['scripts-prod', 'styles-prod', 'images', 'indexHtml-prod','templates-dev']);

function buildTemplates() {
  return es.pipeline(
    plugins.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }),
    plugins.angularTemplatecache({
      module: 'app'
    })
  );
}
