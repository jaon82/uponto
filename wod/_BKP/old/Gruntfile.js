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
	lineremover: {
		html: {
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**/*.html'],
            dest: 'build/',
            ext: '.html'
          }
        ]
      }
    },
	concat: {
	  js: {
		src: 'js/*.js',
		dest: 'build/js/concat.js'
	  },
	  css: {
		src: 'css/*.css',
		dest: 'build/css/concat.css'
	  }
	},
	min: {
		js: {
			src: 'build/js/concat.js',
			dest: 'build/js/concat.min.js'
		  }
	},
	/*
	cssmin: {
	  css:{
		src: 'build/css/concat.css',
		dest: 'build/css/concat.min.css'
	  }
	},
	*/
	clean: {
      build: [
        'build'
      ]
    }
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-line-remover');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-min');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', 'concat min cssmin');
};