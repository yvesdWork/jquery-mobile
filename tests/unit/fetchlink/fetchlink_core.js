/*
 * Fetchlink unit tests
 */

(function($){
	
	module( "Fetchlinks", {
		setup: function(){
		//	$.testHelper.openPage("#fetchlink-test1");
		}
	});

	asyncTest( "Clicking a fetchlink loads remote content.", function(){
		var targetContents = $( '.loadinto' ).html();
		
		$.testHelper.pageSequence([
			function(){
				$('.standalone').trigger('click');
			},
			function(){
				ok( targetContents !== $( '.loadinto' ).html() );
				start();
			}
		]);
	});

	asyncTest( "Clicking a grouped fetchlink loads remote content.", function(){
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
	
	asyncTest( "When no remote fragment is specified, the remote “page” element’s contents are pulled in instead.", function(){		
		$.testHelper.pageSequence([
			function(){
				$('.remote-page').trigger('click');
			},
			function(){
				var headerFirst = $('.loadinto').find('div:first').attr('data-nstest-role') === 'header',
					footerLast = $('.loadinto').find('div:last').attr('data-nstest-role') === 'footer';
					
				ok( headerFirst && footerLast, "First and last items within the page wrapper match the first and last items in the target container." );
				start();
			}
		]);
	});
	
	asyncTest( "Elements are properly enhanced after being fetched.", function(){		
		$.testHelper.pageSequence([
			function(){
				ok( $('.loadinto').find('[data-nstest-role="header"]').hasClass( 'ui-header' ), "Page header is enhanced." );
				ok( $('.loadinto').find('[data-nstest-role="content"]').hasClass( 'ui-content' ), "Page content is enhanced." );
				ok( $('.loadinto').find('[data-nstest-role="footer"]').hasClass( 'ui-footer' ), "Page footer is enhanced." );
				ok( $('.loadinto').find('[data-nstest-role="button"]').hasClass( 'ui-btn' ), "A link with a role of “button” is enhanced." );
				ok( $('.loadinto').find('[data-nstest-role="slider"]').hasClass( 'ui-slider-switch' ), "Toggles are enhanced." );
				ok( $('.loadinto').find('#test-slider').hasClass( 'ui-slider-input' ), "Slider widgets are enhanced." );
				
				start();
			}
		]);
	});
	
	asyncTest( "Fetchlinks within remote content function normally.", function(){		
		var targetContents = $( '.secondtarget' ).html();
		
		$.testHelper.pageSequence([
			function() {
				$('.remote-fetchlink').trigger('click');
			},
			function(){
				ok( $('.loadinto').html() !== targetContents, "Target container has been updated with remote content." );
				start();
			}
		]);
	});
	
	
	

})(jQuery);