module.exports = function(grunt) {

    grunt.initConfig({
        'connect': {
            demo: {
                options: {
                    open: true,
                    keepalive: true
                }
            }
        },
        'gh-pages': {
            options: {
                clone: 'bower_components/u-avatar'
            },
            src: [
                'bower_components/**/*',
                '!bower_components/u-avatar/**/*',
                'demo/*', 'src/*', 'src/js/*', 'index.html'
            ]
        },
        'jshint': {
            all: [
                'src/js/main.js'
            ],
            options: grunt.file.readJSON('.jshintrc')
        },
        'replace': {
            example: {
                src: ['src/u-avatar.html'],
                dest: 'dist/',
                replacements: [{
                    from: 'bower_components',
                    to: '..'
                }]
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/script.min.js': ['src/js/md5.min.js', 'src/js/main.js']
                }
            }
        },
        processhtml: {
            options: {
            // Task-specific options go here.
            },
            my_target: {
                files: {
                    'dist/u-avatar.html': 'dist/u-avatar.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('build',  ['replace', 'uglify', 'processhtml']);
    grunt.registerTask('deploy', ['gh-pages']);
    grunt.registerTask('server', ['connect']);

};
