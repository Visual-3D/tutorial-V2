// npm install grunt-contrib-less --save-dev

// Création du projet "Grunt"
module.exports = function (grunt){
    //permet de charger automatiquement les plugins depuis le package.json
    require('load-grunt-tasks')(grunt);
    //require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
    // Initialisation da la config    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),


        // Plugin JShint : Validation des javascript
        jshint: {
            production: ['/scripts/*.js', '/scripts/**/*.js'],
            developpement: ['<%= pkg.destinationPathLocal %>/scripts/*.js', '<%= pkg.destinationPathLocal %>/scripts/**/*.js']
        },

        // Plugin Uglify : minification et compression des JS
        uglify: {
            options: {
                mangle: false, //Permet de ne pas modifier les variables des js
                report: 'gzip'
            },
            developpement: { // "production" pour cibler l'environnement de production en ligne
                files: {
                    '<%= pkg.destinationPathDistant %>/scripts/built.js': ['<%= pkg.destinationPathLocal %>/scripts/*.js', '<%= pkg.destinationPathLocal %>/scripts/**/*.js']
                }
            }
        },

        /*
        less: {
            options: {
                report: 'gzip',
                cleancss: true
            },
            developpement: {
                files: {
                    "<%= pkg.destinationPathLocal %>/main.css": "<%= pkg.destinationPathLocal %>/less/config.less"
                }
            }
        },
        */

        copy: {
            developpement: {
                files: [
                    // makes all src relative to cwd
                    {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
                ],
            },
        },

        sass: { // Task
            developpement: {  // Target
                options: {  // Target options
                    style: 'expanded'
                },
                files: { // Dictionary of files
                    "<%= pkg.destinationPathLocal %>/main_dev.css": "<%= pkg.destinationPathLocal %>/sass/foundation.scss"
                }
            }
        },


        // Minification des CSS
        cssmin: {
            options: {
                report: 'gzip'
            },
            developpement: {
                files: {
                    "<%= pkg.destinationPathDistant %>/css/main.min.css": "<%= pkg.destinationPathLocal %>/*.css"
                }
            }
        },

        //FONCTION Plugin *watch*
        watch: {
            watch_js: {
                files: ['<%= pkg.destinationPathLocal %>/scripts/*.js', '<%= pkg.destinationPathLocal %>/scripts/**/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {
                    spawn: false, //fonction pour gagner du temps
                    livereload: false //permet l'actualisation auto
                },
            },
            watch_sass: {
                files: ['<%= pkg.destinationPathLocal %>/sass/*.scss', '<%= pkg.destinationPathLocal %>/sass/**/.scss'],
                tasks: ['sass','cssmin'],
                options: {
                    spawn: false,
                    livereload: true
                },
            },
        },






    
        });

        //ciblage des version de developpement ou production
        var targetDev= grunt.option('target') || 'developpement';
        var targetProd = grunt.option('target') || 'production';

        //Permet d'enchainer les functions
        grunt.registerTask('dev', ['watch:' + targetDev]);
        grunt.registerTask('prod', ['jshint:' + targetProd]);

};