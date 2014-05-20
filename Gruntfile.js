module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'target/js/<%= pkg.name %>.js',
        dest: 'target/js/<%= pkg.name %>.min.js'
      }
    },

    typescript: {
      base: {
        src: ['*.ts'],
        dest: 'target/js/<%= pkg.name %>.js',
        options: {
          target: 'es5', //or es3
          basePath: '/',
          sourceMap: true,
          declaration: true
        }
      }
    },

    jasmine: {
        test: {
            src: 'target/js/<%= pkg.name $>.min.js',
            options: {
                specs: 'src/test/Spec*.js'
            }
        }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-typescript');
//  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['typescript', 'uglify']);

};
