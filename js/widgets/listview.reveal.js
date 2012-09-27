/*
messy behavioral prototype
*/
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Extends the listview with swipe (or click) revealable content
//>>label: Listview: Reveal
//>>group: Widgets


define( [ "jquery", "./listview" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$( document ).delegate( ":jqmData(role='listview')", "listviewcreate", function() {

	var list = $( this ),
		lis = list.find( "li:jqmData(reveal)" );

	lis.addClass( "ui-li-reveal" );
		
	if( !$.support.touch ){
		lis.addClass( "ui-li-reveal-mouse" );
	}
		
	lis.find( ":jqmData(reveal-disclose)" )
		.addClass( "ui-li-reveal-disclose" )
		.bind( "click", function(){
			$( this ).closest( "li" ).toggleClass( "ui-reveal-disclose-expanded" );
			return false;
		} )
		.each(function(){
			$( this )
				.closest( "li" )
				.append( this )
				.find( ".ui-btn-inner:first" )
				.append( "<span class='ui-reveal-curl'></span>" );
		});
	
	/* drag prototype */
	var origin,
		data = {},
		setData = function( e ){
			var touches = e.touches || e.originalEvent.touches,
				$elem = $( e.target ).closest( "li" );
						
			if( e.type === "touchstart" ){
				origin = {
					x : touches[ 0 ].pageX,
					y: touches[ 0 ].pageY
				};
			}

			if( touches[ 0 ] && touches[ 0 ].pageX ){
				data.deltaX = touches[ 0 ].pageX - origin.x;
				data.deltaY = touches[ 0 ].pageY - origin.y;
				data.w = $elem.width();
				data.h = $elem.height();
			}
		};

	list
		.bind( "touchstart", function( e ){
			$( e.target ).closest( "li" ).addClass( "ui-reveal-hover no-trans" );
			setData( e );
		})
		.bind( "touchmove", function( e ){
			setData( e );
			if( data.deltaX < 0){
				$( e.target ).closest( "li" ).find( ".ui-btn-inner:first" ).css( { right: -data.deltaX } );
			}
		})
		.bind( "touchend", function( e ){
			var li =	$( e.target ).closest( "li" );
			li.removeClass( "no-trans" );
			if( data.deltaX < -35 )	{
				li.addClass("ui-reveal-disclose-expanded" );
				li
					.find( ".ui-btn-inner:first" )
					.animationComplete(function(){
						li.addClass("ui-reveal-disclose-expanded" );
					})
					.css( { right: data.w  } );
			}
			else {
				li
					.find( ".ui-btn-inner:first" )
					.animationComplete(function(){
						$(this).css("right", "");
					})
					.css( { right: "0"  } );
			}
			li.removeClass( "ui-reveal-hover" );
		} );
});
})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");