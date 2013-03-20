//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Orders enhancement hooks by dependency
//>>label: Registry of enhancers
//>>group: Widgets

define( [ "jquery", "./jquery.mobile.ns" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

var doc = $( document );

function Enhancer() {
	this._callbacks = [],
	this._dependencies = {},
	this._defines = {},
	this._document = doc;
}

$.extend( Enhancer.prototype, {
	_addWidget: function( fullName ) {
		var idx,
			depinfo = this._dependencies[ fullName ];

		if ( depinfo && !depinfo.added ) {
			for ( idx in depinfo.deps ) {
				this._addWidget( depinfo.deps[ idx ] );
			}
			this._callbacks.push( { name: fullName, cb: depinfo.callback, needsDefine: depinfo.needsDefine } );
			depinfo.added = true;
		}
	},

	_defaultCallback: function( widget ) {
		var entry,
			parts = widget.split( "." ),
			ns = parts[ 0 ],
			name = parts[ 1 ],
			self = this,
			ret = function( targetEl ) {
				var targets = { length: 0 };

				// If the widget is not defined, and we have an initSelector associated
				// with it, then we need to define it if the initSelector applies
				if ( !( $[ ns ] && $[ ns ][ name ] ) ) {
					entry = self._defines[ widget ];

					if ( entry && entry.initSelector ) {
						targets = $.mobile.widget.prototype.enhanceables( $( entry.initSelector, targetEl ), true );
					}

					if ( targets.length > 0 ) {
						self.define( widget );
						targets[ name ]();
					}
				} else {
					$[ ns ][ name ].prototype.enhanceWithin( targetEl, true );
				}
			};

		return ret;
	},

	define: function( widget ) {
		var idx, parts, widgetns, widgetname, base, basens, basename,
			entry = this._defines[ widget ];

		if ( entry ) {
			parts = widget.split( "." );
			widgetns = parts[ 0 ];
			widgetname = parts[ 1 ];

			// First, define the superclass
			if ( entry.base ) {
				if ( $.type( entry.base ) === "string" ) {
					this.define( entry.base );
					parts = entry.base.split( "." );
					basens = parts[ 0 ];
					basename = parts[ 1 ];
					base = $[ basens ][ basename ];
				} else {
					base = entry.base;
				}
			}

			// Then, stack each proto onto the namespace
			if ( entry.protos ) {
				for ( idx in entry.protos ) {
					$.widget( widget, base, entry.protos[ idx ] );
					base = $[ widgetns ][ widgetname ];
				}
			}

			// Get rid of this widget definition so we don't run it again
			this._defines[ widget ] = undefined;
			$( document ).trigger( widgetname + "define" );
		}
	},

	addDefinition: function( name, options ) {
		var entry = this._defines[ name ] || {},
			base = options.base,
			proto = options.proto,
			initSelector = options.initSelector;

		// base can only be set once
		if ( !entry.base && base ) {
			entry.base = base;
		}

		if ( proto ) {
			// subsequent protos can override the initSelector of protos added earlier
			if ( proto.options && proto.options.initSelector ) {
				entry.initSelector = proto.options.initSelector;
			}

			if ( !entry.protos ) {
				entry.protos = [];
			}
			entry.protos.push( proto );
		}

		// initSelector can also be specified directly inside options, in which case
		// it will take precedence over the value inside the proto
		if ( initSelector ) {
			entry.initSelector = initSelector;
		}

		this._defines[ name ] = entry;
	},

	add: function( widget, widgetDeps, callback ) {
		var needsDefine;

		if ( !widgetDeps ) {
			widgetDeps = { dependencies: [] };
		}

		if ( !callback ) {
			callback = this._defaultCallback( widget );
		} else {
			// If we're using a custom callback, we need to define the widget before
			// we call the callback for the first time
			needsDefine = true;
		}

		this._dependencies[ widget ] = {
			deps: widgetDeps.dependencies,
			callback: callback,
			needsDefine: needsDefine
		};

		return this;
	},

	enhance: function( targetEl ) {
		var idx, cb,
			deps = this._dependencies,
			cbs = this._callbacks;

		if ( deps ) {
			for ( idx in deps ) {
				this._addWidget( idx );
			}
			this._dependencies = null;
		}

		for ( idx in cbs ) {
			cb = cbs[ idx ];
			if ( cb.needsDefine ) {
				this.define( cb.name );
				cb.needsDefine = false;
			}
			cb.cb( targetEl );
		}

		return this;
	}
});

$.mobile._enhancer = new Enhancer();

// Support triggering "create" on an element
doc.bind( "create", function( e ) {
	$.mobile._enhancer.enhance( e.target );
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
