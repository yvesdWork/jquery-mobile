//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Create an array of DOM elements from a JSON description
//>>label: createDom
//>>group: Core

define( [ "jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

//el can be one of two things:
// 1. { tagname: [ { attr: value, ... }, [ children ]] }
// 2. "a string"
function mkEl( el ) {
	var ret, key, idx, attr, children, child;

	if ( $.type( el ) === "string" ) {
		ret = document.createTextNode( el );
	} else {
		for ( key in el ) {
			ret = document.createElement( key );
			for( idx in el[ key ] ) {
				if ( $.type( el[ key ][ idx ] ) === "object" ) {
					for( attr in el[ key ][ idx ] ) {
						ret.setAttribute( attr, el[ key ][ idx ][ attr ] );
					}
				} else if ( $.type( el[ key ][ idx ] ) === "array" ) {
					children = mkChildren( el[ key ][ idx ] );
					for( child in children ) {
						ret.appendChild( children[ child ] );
					}
				}
			}
		}
	}

	return ret;
}

function mkChildren( c ) {
	var ret = [], idx;

	for ( idx in c ) {
		ret.push( mkEl( c[ idx ] ) );
	}

	return ret;
}

$.mobile.createDom = function( j ) {
	return ( ( $.type( j ) === "object" ) ? mkEl( j ) :
		( ( $.type( j ) === "array" ) ? mkChildren( j ) :
			undefined ) );
};

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
