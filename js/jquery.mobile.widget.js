//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Widget factory extentions for mobile.
//>>label: Widget Factory
//>>group: Core
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

define( [ "jquery", "./jquery.mobile.ns", "depend!./jquery.ui.widget[jquery]" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$.widget( "mobile.widget", {
	// decorate the parent _createWidget to trigger `widgetinit` for users
	// who wish to do post post `widgetcreate` alterations/additions
	//
	// TODO create a pull request for jquery ui to trigger this event
	// in the original _createWidget
	_createWidget: function() {
		$.Widget.prototype._createWidget.apply( this, arguments );
		this._trigger( 'init' );
	},

	_getCreateOptions: function() {

		var elem = this.element,
			options = {};

		$.each( this.options, function( option ) {

			var value = elem.jqmData( option.replace( /[A-Z]/g, function( c ) {
							return "-" + c.toLowerCase();
						})
					);

			if ( value !== undefined ) {
				options[ option ] = value;
			}
		});

		return options;
	},

	enhanceWithin: function( target, useKeepNative ) {
		this.enhance( $( this.options.initSelector, $( target )), useKeepNative );
	},

	enhance: function( targets, useKeepNative ) {
		var page, keepNative, $widgetElements = $( targets ), self = this;

		// if ignoreContentEnabled is set to true the framework should
		// only enhance the selected elements when they do NOT have a
		// parent with the data-namespace-ignore attribute
		$widgetElements = $.mobile.enhanceable( $widgetElements );

		if ( useKeepNative && $widgetElements.length ) {
			// TODO remove dependency on the page widget for the keepNative.
			// Currently the keepNative value is defined on the page prototype so
			// the method is as well
			page = $.mobile.closestPageData( $widgetElements );
			keepNative = ( page && page.keepNativeSelector()) || "";

			$widgetElements = $widgetElements.not( keepNative );
		}

		$widgetElements[ this.widgetName ]();
	},

	raise: function( msg ) {
		throw "Widget [" + this.widgetName + "]: " + msg;
	},

	_name: function() {
		return this.namespace + "." + this.widgetName;
	},

	_register: function( opts ) {
		var opts = opts || {},
			proto = this,
			name = this._name(),
			registry = $.mobile.widget._registry;

		registry[ name ] = {
			deferred: $.Deferred(),
			dependencies: opts.dependencies || [],
			callback: function( within ) {
				(opts.callback || $.noop)( within );

				// requires that the within is set by the page
				// create or create callback
				// TODO likely have to leave this to the opts.callback
				proto.enhanceWithin(within, true);
			}
		};
	}
});

$.extend( $.mobile.widget, {
	_registry: {},

	_resetRegistry: function() {
		for( widget in this._registry) {
			this._registry[widget].deferred = $.Deferred();
		}
	},

	_resolveDependencies: function( within ) {
		var deferreds = [], obj, registry = this._registry;

		// for each widget in the registry setup a new promise
		// based on the deferreds of it's dependencies
		$.each(registry, function( name, entry ) {
			// grab all the deferreds that need to be resolved
			// for this widget to be enhanced. Where the dependency isn't defined
			// ignore it by returning undefined which $.map will discard
			deferreds = $.map(entry.dependencies, function(depName) {
				return (registry[depName] || {}).deferred;
			});

			// when all of the deferreds resolve execute the callback
			// and resolve the deferred for that specific widget
			$.when.apply($, deferreds).done(function() {
				// enhance anything passed in as a callback
				entry.callback( within );

				// once the widget is enhanced (callback) resolve it's
				// depedency deferred
				entry.deferred.resolve();
			});
		});
	}
});


})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
