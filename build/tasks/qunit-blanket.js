module.exports = function( grunt ) {
	'use strict';

	var _ = grunt.util._;
	var path = require( "path" );
	var	phantomjs = require( 'grunt-lib-phantomjs' ).init( grunt );
	var Handlebars = require( "handlebars" );
	var alreadyReported = [];
	var reporters = {
			console: function consoleReporter( data ) {
				var filepath,
					lines,
					loc,
					cloc,
					percentage;
				for ( filepath in data.files ) {
					if ( _.contains( alreadyReported, filepath ) ) {
						continue;
					}
					lines = data.files[ filepath ];
					loc = lines.filter( function( l ) { return l !== null; } );
					cloc = loc.filter( function( l ) { return l !== 0; } );

					percentage = (Math.round(((cloc.length/loc.length) * 100)*100)/100);

					grunt.log.writeln( "  |");
					grunt.log.write(   "  |--> " + filepath + " ( " );
					grunt.log.write( String(percentage + "%" ).green );
					grunt.log.writeln( " )" );
					alreadyReported.push( filepath );
				}
			},
			lcov: function lcovReporter( data, options ) {
				var output = options.output,
					lcov = "",
					append = function( filename, fileData ) {
						lcov += 'SF:' + filename + '\n';

						fileData.forEach(
							function(line, num) {
								// increase the line number, as JS arrays are zero-based
								num++;

								if (fileData[num] !== undefined) {
									lcov += 'DA:' + num + ',' + fileData[num] + '\n';
								}
							}
						);

						lcov += 'end_of_record\n';
					};

				for (var filename in data.files) {
					append( filename, data.files[ filename ] );
				}

				grunt.file.write( output, lcov );
			},
			cobertura: function coberturaReporter( data, options ) {
				var output = options.output,
					template = Handlebars.compile( grunt.file.read( "build/tasks/templates/coverage.tmpl" ) ),
					o = {},
					filePath,
					lines,
					loc,
					cloc,
					percentage,
					parts,
					packageName,
					packageStats,
					className,
					classStats,
					indexOfFirstPathPart,
					xml = "";

				o.timestamp = new Date(data.stats.end ).getTime(); // to unix time
				o.packages = [];
				for ( filePath in data.files ) {
					parts = filePath.split( "/" );
					className = parts.pop();
					indexOfFirstPathPart = _.indexOf( parts, _.find( parts, function( v ) { return v !== ".."; } ) );
					parts = parts.slice( indexOfFirstPathPart );
					packageName = parts.join( "/" );
					packageStats = { packageName: packageName };
					o.packages.push( packageStats );
					packageStats.klasses = packageStats.klasses || [];
					classStats = { className: className, fileName: filePath };
					packageStats.klasses.push( classStats );
					lines = data.files[ filePath ];
					loc = lines.filter( function( l ) { return l !== null; } );
					cloc = loc.filter( function( l ) { return l !== 0; } );

					classStats.lineRate = (Math.round(((cloc.length/loc.length) * 100)*100)/100);
					classStats.lines = [];
					lines.forEach( function( value, index ){
						if ( value !== null ) {
							classStats.lines.push({
								number: index,
								hits: value,
								branch: "false"
							})
						}
					});

				}

				xml = template( _.extend({
					lineRate: 0,
					branchRate: 0,
					timestamp: 0,
					rootPath: ""
				}, o ));

				grunt.file.write( output, xml );
			}
		};

	grunt.registerTask( "qunit-blanket", function() {
		var options = _.clone( this.options({
				reporters: [ "console" ]
			}) ),
			qunit = grunt.config( "qunit" );

		if ( qunit.http ) {
			qunit.http.options.urls.forEach( function( url, i ) {
				qunit.http.options.urls[i] += "?coverage=true";
			});
		}
		grunt.config( "qunit", qunit );


		grunt.event.on( "qunit.coverageReport",
			function( coverageData ) {
				grunt.event.on( "qunit.done", function() {
					options.reporters.forEach( function( reporter ) {
						if ( typeof reporter === "string" ) {
							reporters[ reporter ]( coverageData );
						} else if ( typeof reporter === "object" ) {
							reporters[ reporter.name ]( coverageData, reporter.options );
						}
					});
				})
			}
		);
	});
}