'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig( {

		watch: {
			jsx: {
				files: [ 'server/react/**/*.jsx' ],
				tasks: [ 'clean:react', 'react' ]
			},
			js: {
				files: [ 'public/js/**/*.js' ],
				tasks: [ 'browserify', 'exorcise:bundle' ],
				options: {
					livereload: true,
					interrupt: true,
					spawn: true,
				},
			},
			scss: {
				files: [ 'public/scss/**/*.scss' ],
				tasks: [ 'compass' ],
				options: {
					interrupt: true,
					spawn: true,
				},
			},
			css: {
				files: [ 'public/css/*.css' ],
				options: {
					livereload: true,
					interrupt: true,
					spawn: true,
				},
			},
			svg: {
				files: [ 'public/fonts/fontcustom/icons/*.svg' ],
				tasks: [ 'webfont' ]
			}
		},

		exorcise: {
			bundle: {
				options: {},
				files: {
					'public/output/bundle.map': [ 'public/output/bundle.js' ],
				}
			}
		},

		browserify: {
			options: {
				transform: [ require( 'grunt-react' ).browserify ],
				browserifyOptions: {
					debug: true
				},
				plugin: [
					[
						'remapify', [ {
							src: '**/*.js',
							expose: 'app',
							cwd: 'public/js'
						}, {
							src: '**/*.js',
							expose: 'views',
							cwd: 'public/js/react'
						}, {
							src: '**/*.js',
							expose: 'libs',
							cwd: 'public/js/libs'
						}, {
							src: '**/*.js',
							expose: 'helpers',
							cwd: 'public/js/helpers'
						}, {
							src: '**/*.js',
							expose: 'controllers',
							cwd: 'public/js/controllers'
						} ]
					]
				]
			},
			dist: {
				files: {
					'public/output/bundle.js': [ 'public/js/main.js' ]
				}
			}
		},

		react: {
			options: {
				harmony: true
			},
			dynamic_mappings: {
				files: [ {
					expand: true,
					cwd: 'server/react',
					src: [ '**/*.jsx' ],
					dest: 'public/js/react',
					ext: '.js'
				} ]
			}
		},

		compass: {
			options: {
				sassDir: 'public/scss',
				cssDir: 'public/css',
				fontsDir: 'public/fonts',
				imagesDir: 'public/images',
				generatedImagesDir: 'public/images/generated',
				relativeAssets: true,
				noLineComments: true,
				assetCacheBuster: true,
				watch: false,
				require: [ 'breakpoint' ]
			},
			development: {
				options: {
					outputStyle: 'nested', //nested, expanded, compact, compressed
					environment: 'development',
				}
			},
			production: {
				options: {
					outputStyle: 'compressed', //nested, expanded, compact, compressed
					environment: 'production',
				}
			},
		},

		webfont: {
			icons: {
				src: 'public/fonts/fontcustom/icons/*.svg',
				dest: 'public/fonts/fontcustom',
				destCss: 'public/scss',
				options: {
					stylesheet: 'scss',
					htmlDemo: true,
					hashes: true,
					engine: 'node',
					templateOptions: {
						baseClass: 'icon',
						classPrefix: 'icon-',
						mixinPrefix: 'icon-'
					}
				}
			}
		},

		nodemon: {
			development: {
				script: 'server.js'
			},
			production: {
				script: '../release/server.js'
			}
		},

		concurrent: {
			development: {
				tasks: [ 'nodemon:development', 'watch' ],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		symlink: {
			options: {
				overwrite: true,
				expand: false
			},
			expanded: {
				files: [ {
					cwd: './',
					src: 'server/helpers',
					dest: 'public/js/helpers'
				} ]
			},
		},

		clean: {
			options: {
				force: true
			},
			release: {
				src: [ '../release/**/*', '!../release/.gitkeep' ],
				dot: true
			},
			hidden: {
				src: [ '../release/.DS_Store', '../release/.sass-cache' ],
				dot: true
			},
			react: {
				src: [ 'public/js/react/**/*' ]
			}
		},

		copy: {
			release: {
				files: [ {
					expand: true,
					cwd: './',
					src: [
						'**',
						'!node_modules/**',
						'!Gemfile.lock',
						'!Gemfile',
						'!Gruntfile.js',
						'!public/js/**',
						'!public/scss/**',
						'!public/output/bundle.map',
						'!public/images/icons/**',
						'!public/images/icons-2x/**',
						'!public/images/ui/**',
						'!public/images/ui-2x/**',
						'!public/fonts/fontcustom/icons',
					],
					dest: '../release',
					filter: 'isFile',
					dot: true
				}, {
					cwd: './',
					src: 'public/output/bundle.js',
					dest: '../release/public/output/bundle.debug.js'
				} ]
			}
		},

		uglify: {
			options: {
				preserveComments: false,
				mangle: true,
				compress: {
					drop_console: true
				}
			},
			release: {
				files: {
					'../release/public/output/bundle.js': [ '../release/public/output/bundle.js' ]
				}
			}
		},

		zip: {
			release: {
				cwd: '../release/',
				src: [ '../release/**/*' ],
				dest: '../release/andysawards-release-<%= new Date().getTime() %>.zip',
				dot: true
			}
		},

	} );

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-exorcise' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-compass' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-symlink' );
	grunt.loadNpmTasks( 'grunt-react' );
	grunt.loadNpmTasks( 'grunt-webfont' );
	grunt.loadNpmTasks( 'grunt-nodemon' );
	grunt.loadNpmTasks( 'grunt-concurrent' );
	grunt.loadNpmTasks( 'grunt-zip' );

	// Tasks.
	grunt.registerTask( 'development', [
		'symlink',
		'compass:development',
		'webfont',
		//'clean:react',
		'react',
		'browserify',
		'exorcise:bundle',
		'concurrent:development'
	] );

	grunt.registerTask( 'release', [
		'symlink',
		'compass:production',
		'webfont',
		'clean:react',
		'react',
		'browserify',
		'exorcise:bundle',
		'clean:release',
		'copy',
		'clean:hidden',
		'uglify:release',
		'zip:release'
	] );
};