//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Create an array of DOM elements from a JSON description
//>>label: createDom
//>>group: Core

define( [ "jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$.mobile.makeDom = function( o ) {
	var prop,
		ele = document.createElement( o[ 0 ] );
	for ( prop in o[ 1 ] ) {
		ele.setAttribute( prop, o[ 1 ][ prop ] );
	}
	ele.innerHTML = o[ 2 ];
	return ele;
};

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
