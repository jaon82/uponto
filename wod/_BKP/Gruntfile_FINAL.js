module.exports = function(grunt) {
  grunt.initConfig({
    cssmin: {
      production: {
        expand: true,
        cwd: 'css',
        src: ['*.css'],
        dest: 'build/css'
      }
    },
	imagemin: {
      dist: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: 'res/',
            src: ['**/*.jpg'],
            dest: 'build/res/',
            ext: '.jpg'
          },
          {
            expand: true,
            cwd: 'res/',
            src: ['**/*.png'],
            dest: 'build/res/',
            ext: '.png'
          }
        ]
      }
    },
	minifyHtml: {
        options: {
            cdata: true
        },
        dist: {
            files: {
                'build/index.html': 'index.html'
            }
        }
    },
	uglify : {
	  uglify : {
		src : 'js/class/**/*.js', dest : 'build/js/class.js'
	  },
	  uglify2 : {
		src : 'js/utils/**/*.js', dest : 'build/js/utils.js'
	  },
	  uglify3 : {
		files : {
			'build/js/background.js' : 'js/background.js',
			'build/js/hrs.helpers.js' : 'js/hrs.helpers.js',
			'build/js/hrs.dao.js' : 'js/hrs.dao.js',
			'build/js/hrs.timestamp.js' : 'js/hrs.timestamp.js',
			'build/js/hrs.ui.month.js' : 'js/hrs.ui.month.js',
			'build/js/hrs.ui.holiday.js' : 'js/hrs.ui.holiday.js',
			'build/js/hrs.ui.main.js' : 'js/hrs.ui.main.js' 
		}
	  }
	},
	clean: {
      build: [
        'build'
      ]
    }
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-minify-html');
  
  grunt.registerTask('default', ['minifyHtml']);
};