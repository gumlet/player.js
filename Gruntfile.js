/*global module:false, es5:true*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost.com:8004/test/player_test.html'
          ]
        }
      }
    },
    compass: {
      all: {
        options: {
          sassDir: 'sass',
          cssDir: 'dist/css'
        }
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
          ' Licensed <%= _.pluck(pkg.license, "type").join(", ") %> */\n'
      },
      local: {
        src: ['src/core.js', 'src/keeper.js', 'src/player.js', 'src/receiver.js', 'src/adapters/*.js'],
        dest: 'dist/player.js'
      },
      release: {
        src: [
          'src/intro.js', 'src/core.js', 'src/keeper.js',
          'src/player.js', 'src/receiver.js', 'src/adapters/*.js', 'src/outro.js'
        ],
        dest: 'dist/player.js'
      }
    },
    uglify: {
      release: {
        files: {
          'dist/player.min.js': ['dist/player.js']
        }
      }
    },
    connect: {
      parent: {
        options: {
          port: 8004,
          base: '.'
        }
      },
      child: {
        options: {
          port: 8003,
          base: '.'
        }
      }
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['concat:local']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: false,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        es3:true,
        ignores: ['src/intro.js', 'src/outro.js']
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js']
    }
  });

  // Tasks
  grunt.registerTask("test", ["connect", "qunit"]);
  grunt.registerTask("default", ["concat:local", "connect:parent", "connect:child", "watch"]);
  // grunt.registerTask("package", ["jshint", "test", "concat:release", "uglify:release"]);
  grunt.registerTask("package", ["jshint", "concat:release", "uglify:release"]);
  grunt.registerTask("release", ["package"]);
};
