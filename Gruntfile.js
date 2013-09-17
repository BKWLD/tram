module.exports = function(grunt) {

  // Config helpers
  var js = '.js'
    , distPath = 'dist/'
    , distFile = distPath + '<%= pkg.name %>'
    , banner = '/*!\n' +
      '  * <%= pkg.name %>.js v<%= pkg.version %><%= flag %>\n' +
      '  * <%= pkg.description %>\n' +
      '  * <%= pkg.homepage %>\n' +
      '  * <%= pkg.license %> License\n' +
      '  */\n'
    , bannerFlag = function (flag) {
      return banner.replace('<%= flag %>', flag);
    }
  ;
  
  // Grunt configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pjs: grunt.file.readJSON('node_modules/pjs/package.json'),
    
    concat: {
      options: {
        banner: banner
      },
      global: {
        options: { banner: bannerFlag('-global') },
        src: [
          'support/global/1.js',
          'src/p.js',
          'src/easing.js',
          'src/<%= pkg.name %>.js',
          'support/global/2.js'
        ],
        dest: distFile + js
      },
      amd: {
        options: { banner: bannerFlag('-amd') },
        src: [
          'support/amd/1.js',
          'src/p.js',
          'src/easing.js',
          'src/<%= pkg.name %>.js',
          'support/amd/2.js'
        ],
        dest: distFile + '-amd' + js
      },
      commonjs: {
        options: { banner: bannerFlag('-commonjs') },
        src: [
          'support/commonjs/1.js',
          'src/p.js',
          'src/easing.js',
          'src/<%= pkg.name %>.js',
          'support/commonjs/2.js'
        ],
        dest: distFile + '-cjs' + js
      },
      
      readme: {
        options: { banner: '<a style="float:right" href="https://github.com/bkwld/tram">[view on github]</a> v<%= pkg.version %>\n\n' },
        src: ['README.md'],
        dest: 'index.md'
      }
    },
    
    uglify: {
      options: {
        banner: bannerFlag('-global'),
        mangle: true,
        compress: true,
        report: 'gzip'
      },
      global: {
        src: distFile + js,
        dest: distFile + '-min' + js
      }
    },
    
    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['clean', 'concat:global']
      }
    },
    
    markdown: {
      all: {
        files: ['index.md'],
        dest: './',
        options: {
          gfm: true,
          highlight: 'auto'
        }
      }
    }
  });
  
  // Load the plugin tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-markdown');
  
  // Default task - trigger global concat and watch for dev.
  grunt.registerTask('default', ['clean', 'concat:global', 'watch']);
  
  // Build task - concat and minify all.
  grunt.registerTask('build', ['clean', 'concat', 'uglify', 'markdown', 'clean-readme']);
  
  // Clean tasks
  grunt.registerTask('clean', 'Clean dist files.', function () {
    grunt.file.delete(distPath);
    grunt.log.ok();
  });
  grunt.registerTask('clean-readme', 'Clean readme index file.', function () {
    grunt.file.delete('index.md');
    grunt.log.ok();
  });
  
};
