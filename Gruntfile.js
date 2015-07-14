var packageJSON   = require('./package.json'),
    merge         = require('lodash').merge,
    defaultOption = {
      dir:           './',
      name:          packageJSON.name,
      version:       '0.29.2',
      arch:          'x64',
      'app-version': packageJSON.version,
    };

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-electron');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['./dist'],
    electron: {
      osx:{
        options: merge({
          icon:     './icons/idobata.icns',
          out:      './dist/darwin',
          platform: 'darwin',
          prune:    true
        }, defaultOption)
      },
      linux: {
        options: merge({
          out:           './dist/linux',
          platform:      'linux',
          prune:         true
        }, defaultOption)
      }
    }
  });

  grunt.registerTask('default', ['clean', 'electron']);
};
