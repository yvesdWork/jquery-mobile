/*
 * Fetchlink unit tests
 */

(function($){
	
	module( "Fetchlinks", {
		setup: function(){
			//
		}
	});

	asyncTest( "Clicking a fetchlink loads remote content.", function(){
		var targetContents = $( '.loadinto' ).html();
		
		$.testHelper.pageSequence([
			function(){
				$('.foo').trigger('click');
			},
			function(){
				ok( targetContents !== $( '.loadinto' ).html() );
				start();
			}
		]);
	});

	asyncTest( "Clicking a fetchlink replaces previously loaded content with remote content.", function(){
		var targetContents = $( '.loadinto' ).html();
		
		$.testHelper.pageSequence([
			function(){
				$('.bar').trigger('click');
			},
			function(){
				ok( targetContents !== $( '.loadinto' ).html() );
				start();
			}
		]);
	});
	
	asyncTest( "Elements are properly enhanced after being fetched.", function(){		
		$.testHelper.pageSequence([
			function(){
				$('.baz').trigger('click');
			},
			function(){
				ok( $('[data-nstest-role="header"]').hasClass( 'ui-header' ), "Page header is enhanced." );
				ok( $('[data-nstest-role="content"]').hasClass( 'ui-content' ), "Page content is enhanced." );
				ok( $('[data-nstest-role="footer"]').hasClass( 'ui-footer' ), "Page footer is enhanced." );
				ok( $('[data-nstest-role="button"]').hasClass( 'ui-btn' ), "A link with a role of “button” is enhanced." );
				ok( $('[data-nstest-role="slider"]').hasClass( 'ui-slider-switch' ), "Toggles are enhanced." );
				ok( $('#test-slider').hasClass( 'ui-slider-input' ), "Slider widgets are enhanced." );
				
				start();
			}
		]);
	});
	
	

})(jQuery);