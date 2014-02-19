module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      root: './',
      jade: '<%= dirs.root %>/views',
      less: '<%= dirs.root %>/public/less',
      js: '<%= dirs.root %>/public/js',
      css: '<%= dirs.root %>/public/css',
      tests: '<%= dirs.root %>/tests'
    },

    watch: {
      options: {
        livereload: 35729
      },
      less: {
        files: '<%= dirs.less %>/**/*.less',
        tasks: []
      },
      jade: {
        files: '<%= dirs.jade %>/**/*.jade',
        tasks: []
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
}
