//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Create an array of DOM elements from a JSON description
//>>label: createDom
//>>group: Core

define( [ "jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

//el can be one of two things:
// 1. [ tagname, { attr: value, ... }, [ children ] ]
// 2. "a string"
var mkEl = function( el ) {
		var ret, key, attr, children, child;

		if ( $.type( el ) === "string" ) {
			ret = document.createTextNode( el );
		} else {
			ret = document.createElement( el[ 0 ] );
			for( attr in el[ 1 ] ) {
				ret.setAttribute( attr, el[ 1 ][ attr ] );
			}
			children = mkChildren( el[ 2 ] );
			for( child in children ) {
				ret.appendChild( children[ child ] );
			}
		}

		return ret;
	},

	mkChildren = function( c ) {
		var ret = [], idx;

		for ( idx in c ) {
			ret.push( mkEl( c[ idx ] ) );
		}

		return ret;
	};

$.mobile.createDom = mkEl;
$.mobile.createDomElements = mkChildren;

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
