module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      'dist-server': {
        options: {
          port: 8000,
          keepalive: true,
          base: 'dist',
          middleware: function (connect, options) {
            return [
              // Serve static files.
              connect.static(options.base[0]),
              // Make empty directories browsable.
              connect.directory(options.base[0])
            ];
          }
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'build/app.js': [
            'js/controllers.js',
            'js/router.js'
          ]
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'build/app.css': [
            'css/style.css'
          ]
        }
      }
    },
    concat: {
      dist: {
        files: {
          'dist/app.js': [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-route/angular-route.min.js',
            'build/app.js'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [
          {expand: true, src: ['partials/*'], dest: 'dist/'},
          {expand: true, src: ['index.html'], dest: 'dist/'},
          {expand: true, src: ['app.css'], dest: 'dist/', cwd: 'build'}
        ]
      }
    },
    processhtml: {
      dist: {
        files: [
          {expand: true, src: ['index.html'], dest: 'dist/'}
        ]
      }
    }
  });
  
  grunt.registerTask('run', ['connect:dist-server']); // http://localhost:8000/
  grunt.registerTask('dist-test', ['dist', 'connect:dist-server']);
  grunt.registerTask('dist', ['uglify:dist', 'cssmin:dist', 'concat:dist', 'copy:dist', 'processhtml:dist']);
};