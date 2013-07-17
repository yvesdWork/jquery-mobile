'use strict';

// Send messages to the parent PhantomJS process via alert! Good times!!
function sendMessage() {
	var args = [].slice.call(arguments);
	alert(JSON.stringify(args));
}

if ( "blanket" in window ) {
	var blanketReport = blanket.report;
	blanket.report = function( data ) {
		blanketReport( data );
		sendMessage('qunit.coverageReport', data );
	};
}