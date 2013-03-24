module.exports = function(grunt) {

  // Private vars
  var js = '.js'
    , distFile = 'dist/<%= pkg.name %>'
    , banner = '/*!\n' +
      '  * <%= pkg.name %>.js v<%= pkg.version %><%= flag %>\n' +
      '  * <%= pkg.description %>\n' +
      '  * <%= pkg.homepage %>\n' +
      '  * <%= pkg.license %> License\n' +
      '  */\n'
  ;
  
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: {
        banner: banner
      },
      global: {
        src: ['support/p.js', 'src/<%= pkg.name %>.js'],
        dest: distFile + js
      },
      amd: {
        options: {
          banner: banner.replace('<%= flag %>', '-amd')
        },
        src: ['src/amd-pre.js', 'src/<%= pkg.name %>.js', 'src/amd-post.js'],
        dest: distFile + '-amd' + js
      }
    },
    
    uglify: {
      options: {
        banner: banner,
        mangle: true,
        compress: true,
        report: 'gzip'
      },
      global: {
        src: distFile + js,
        dest: distFile + '-min' + js
      }
    }
  });

  // Load the plugin tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register tasks
  grunt.registerTask('default', ['concat', 'uglify']);

};
