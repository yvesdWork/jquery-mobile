(function( $, undefined ) {

$.widget( "mobile.fetchlink", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(target)"
	},
	_create: function() {
		var self = $( this.element ),
			target = self.attr( "href" ) ? self : self.find( "a" ).not( ":jqmData(target)" );
			
		 target.bind("click", function(e) {			 
			var el			= $( this ),
				url		    = el.attr( "href" ),
				target		= self.jqmData( "target" ),
				targetEl	= target && $( target ) || self,
				fragment    = self.jqmData( "fragment" ),
				load		= fragment || ":jqmData(role='page')",
				threshold	= screen.width > parseInt( el.jqmData( "breakpoint" ) || 0 ),
				methods		= [ "append", "prepend", "replace", "before", "after" ],
				method      = "html",
				url;

			if ( threshold ) {
				
				for( var ml = methods.length, i = 0; i < ml; i++ ){
					if( el.is( ":jqmData(method='" + methods[ i ] + "')" ) ){
						method	= methods[ i ];
					}
				}

				if ( method === "replace" ){
					method += "With";
				}

				if ( url && method ) {
					
					targetEl.ajaxStart(function(){
						var $el = $(this);

						$el
							.addClass('ui-loading-inline')
							.trigger('inlineLoader', { method: method })
							.height( $el.height() );
					 });
					
					$.get( url, function( resp ) {
						var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
							data = $( $("<div/>").append( resp.replace( rscript, "" ) ).find( load ) )
							responseEl = !fragment ? $( data.html() ) : data,
							normalizePath = function( sel, attr ) {
								responseEl.find( sel ).each(function() {
									var $el = $(this),
										oPath = $el.attr( attr );

									 $el.attr( attr, $.mobile.path.parseUrl( url ).directory + oPath );
								});
							};

						normalizePath( 'img', 'src' );
						normalizePath( 'a', 'href');
						
						setTimeout(function() {		
							targetEl[ method ]( responseEl.addClass('fade in') );

							targetEl.filter( ':jqmData(role="listview")' ).length && targetEl.listview( "refresh" );

							targetEl
								.removeClass('ui-loading-inline')
								.height('auto');
							
							responseEl.trigger( "create" );
					
						}, 300);
					});
				}
			}
			return false;
		});

	}
});

$( document ).bind( "inlineLoader", function( e, ui ){	
		if( ui.method === "html" ) {
			//$( e.target ).children().removeClass('fade in').addClass('fade out');
			
			setTimeout(function() {
				//$( e.target ).html( "<div class='ui-loader-inline fade in'><span class='ui-icon ui-icon-loading spin'></span></div>" );
			}, 300);
		}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.fetchlink.prototype.options.initSelector, e.target ).fetchlink();
});

})( jQuery );
