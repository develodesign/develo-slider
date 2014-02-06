/**
 * Creates a slider.
 *
 * Requires Jquery
 */
(function( $ ){

	// Store the class name
	var className;

	// Store timeout for auto slider
	var autoSlide;

	/**
	 * @constructor
	 *
	 * Merge our options with a set of default options,
	 * then render, setup the bindings and populate the slider.
	 *
	 * @param $el {object}
	 * @param options {object}
	 */
	var DeveloSlider = function( $el, options ){

		this.options = $.extend( true, {
			autoSlide: false,
			className: 'develo-slider',
			colourClass: null,
			controls: {
				colourClass: null,
				display: true,
				next: {
					content: '&gt;'
				},
				previous: {
					content: '&lt;'
				}
			},
			items: [],
			moveAmount: 100 // px
		}, options );

		this.$el = $el;

		this.items = [];

		className = this.options.className;

		this.setMoveAmount( this.options.moveAmount );

		this.render();
		this.setupBindings();

		this.populateSlider();

		if( this.options.autoSlide ) {

			this.setupAutoSlideBindings();
			this.autoSlide();
		}
	};

	/**
	 * Render the element and add the required class names
	 */
	DeveloSlider.prototype.render = function(){

		this.$el
			.addClass( className + '-viewport' )
			.empty()
		;

		this.$container = $( '<div/>' )
			.addClass( className + '-container' )
			.prependTo( this.$el )
		;

		if( this.options.colourClass )
			this.$el.addClass( this.options.colourClass );

		this.renderControls();
	};

	/**
	 * Renders the controls and the required class names
	 */
	DeveloSlider.prototype.renderControls = function(){

		this.$next = $( '<a/>' )
			.addClass( className + '-control' )
			.addClass( 'next' )
			.html( this.options.controls.next.content )
			.appendTo( this.$el )
		;

		this.$previous = $( '<a/>' )
			.addClass( className + '-control' )
			.addClass( 'previous' )
			.html( this.options.controls.previous.content )
			.appendTo( this.$el )
		;

		switch( this.options.controls.display ) {

			case 'hover':
				this.$el.addClass( 'display-controls-on-hover' );
				break;

			case false:
				this.$el.addClass( 'hide-controls' );
				break;
		}

		if( this.options.controls.colourClass ) {
			this.$next.addClass( this.options.controls.colourClass );
			this.$previous.addClass( this.options.controls.colourClass );
		}
	};

	/**
	 * Set up all the bindings that are used in the plugin.
	 */
	DeveloSlider.prototype.setupBindings = function(){

		this.$next.on( 'click tap', $.proxy( this.moveSliderRight, this ) );
		this.$previous.on( 'click tap', $.proxy( this.moveSliderLeft, this ) );
	};

	DeveloSlider.prototype.setupAutoSlideBindings = function(){

		this.$el.on( 'mouseenter', $.proxy( this.autoSlideStop, this ) );
		this.$el.on( 'mouseleave', $.proxy( this.autoSlide, this ) );
	};

	/**
	 * Move the slider left
	 */
	DeveloSlider.prototype.moveSliderLeft = function(){

		return this.moveSlider( this.moveAmount );
	};

	/**
	 * Move the slider right by the specified move amount
	 */
	DeveloSlider.prototype.moveSliderRight = function(){

		return this.moveSlider( -Math.abs( this.moveAmount ) );
	};

	/**
	 * Move the slider by updating the margin left position on the slider container.
	 * Returns the amount moved.
	 *
	 * @param offsetLeft int
	 *
	 * @return {Number}
	 */
	DeveloSlider.prototype.moveSlider = function( offsetLeft ){

		var currentMarginLeft = this.$container[0].style.marginLeft;

		var newMarginLeft = currentMarginLeft ?
			parseInt( currentMarginLeft  ) + offsetLeft :
			offsetLeft;

		var constraints = this.getMarginConstraints();

		if( newMarginLeft > constraints.max )
			newMarginLeft = constraints.max;

		if( newMarginLeft < constraints.min )
			newMarginLeft = constraints.min;

		this.$container[0].style.marginLeft = newMarginLeft + 'px';

		return parseInt( newMarginLeft ) - parseInt( currentMarginLeft );
	};

	/**
	 * Resets the slider to the start point
	 */
	DeveloSlider.prototype.resetSliderPosition = function(){

		this.moveSlider( this.getContainerWidth() );
	};

	/**
	 * Sets the amount (in px) the slider will move.
	 *
	 * @param moveAmount {Number}
	 */
	DeveloSlider.prototype.setMoveAmount = function( moveAmount ) {

		this.moveAmount = moveAmount;
	};

	/**
	 * Populates the slider with a load of items.
	 *
	 * @param items array
	 */
	DeveloSlider.prototype.populateSlider = function( items ){

		items = items || this.options.items;

		for( var i = 0; i < items.length; i++ ){

			var item = items[i];
			this._add( item );
		}

		this.$container.append( $( this.items ) );

		this.updateContainerWidth();
	};

	/**
	 * @private
	 *
	 * Adds the item class and adds it to our item array
	 *
	 * @param item html element
	 *
	 * @returns item
	 */
	DeveloSlider.prototype._add = function( item ) {

		$( item ).addClass( className + '-item' );

		this.items.push( item );

		return item;
	};

	/**
	 * Add an item to the slider and update the containers width
	 *
	 * @param item
	 */
	DeveloSlider.prototype.addItem = function( item ){

		var $item = this._add( item )
			.appendTo( this.$container )
		;

		var width = parseInt( $item.outerWidth( true ) );
		var newWidth = this.getContainerWidth() + width;

		this.setContainerWidth( newWidth );

		return item;
	};

	/**
	 * Removes an item from the slider and update the containers width
	 *
	 * @param item
	 */
	DeveloSlider.prototype.removeItem = function( item ){

		var $item = $( item );
		var index = this.items.indexOf( item );

		if( index > -1 ) {

			var width = parseInt( $item.outerWidth( true ) );

			this.$container.width( this.getContainerWidth() - width );

			this.items.splice( index, 1 );

			$item.remove();
		}
	};

	/**
	 * Get the constraints for the margin left property
	 *
	 * @returns {{max: number, min: number}}
	 */
	DeveloSlider.prototype.getMarginConstraints = function(){

		return {
			max: 0,
			min: -( this.getContainerWidth() - this.$el.width() )
		}
	};

	/**
	 * Get the container width
	 *
	 * @returns {Number}
	 */
	DeveloSlider.prototype.getContainerWidth = function(){

		return this.$container.width();
	};

	/**
	 * Updates the containers with the total width of all the items
	 */
	DeveloSlider.prototype.updateContainerWidth = function(){

		var newWidth = 0;

		for( var i = 0; i < this.items.length; i++ ){

			newWidth = newWidth + this.items[i].offsetWidth;
		}

		this.setContainerWidth( newWidth );
	};

	/**
	 * Sets the width on the container
	 *
	 * @param width {Number}
	 */
	DeveloSlider.prototype.setContainerWidth = function( width ){

		this.$container.width( width );
	};

	/**
	 * Gets the number of items in the slider
	 *
	 * @returns {Number}
	 */
	DeveloSlider.prototype.getNumberOfItems = function(){

		return this.items.length;
	};

	/**
	 * Starts the auto slide, and checks if the slide has moved. If it hasn't moved it presumes
	 * we need to reset the slider.
	 */
	DeveloSlider.prototype.autoSlide = function(){

		var amountMoved = this.moveSliderRight();

		if( amountMoved == 0 )
			this.resetSliderPosition();

		autoSlide = setTimeout( $.proxy( this.autoSlide, this ), this.options.autoSlide );
	};

	/**
	 * Stop the auto slide
	 */
	DeveloSlider.prototype.autoSlideStop = function(){

		clearTimeout( autoSlide );
	};

	/**
	 * Initialise the plugin
	 *
	 * @param options {object}
	 *
	 * @returns {fn}
	 */
	$.fn.develoSlider = function( options ) {

		this.each( function(){

			var $el = $( this );

			if( ! $el.data( 'develoSlider' ) ){
				$el.data( 'develoSlider', new DeveloSlider( $el, options ) );
			}
		} );

		return this;
	};


})( jQuery );
