/**
 * Creates a slider.
 *
 * Requires Jquery
 */
(function( $ ){

	'use strict';

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
			controls: {
				indicators: {
					content: '',
					display: true
				},
				next: {
					content: '&gt;',
					display: true
				},
				previous: {
					content: '&lt;',
					display: true
				}
			},
			items: [],
			keepItemWidth: true,
			moveAmount: 100 // px
		}, options );

		this.$el = $el;

		this.items = [];

		className = this.options.className;

		this.setMoveAmount( this.options.moveAmount );

		this.render();
		this.setupBindings();

		this.populateSlider();

		if( this.options.controls.indicators.display )
			this._initialiseIndicators();

		if( this.options.autoSlide ) {

			this.setupAutoSlideBindings();
			this.autoSlideStart();
		}
	};

	/**
	 * Render the element and add the required class names
	 */
	DeveloSlider.prototype.render = function(){

		this.$el
			.addClass( className )
		;

		this.$viewport = $( '<div/>' )
			.addClass( className + '-viewport' )
			.appendTo( this.$el )
		;

		this.$container = $( '<div/>' )
			.addClass( className + '-container' )
			.prependTo( this.$viewport )
		;

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

		switch( this.options.controls.next.display ) {

			case 'hover':
				this.$el.addClass( 'display-controls-on-hover' );
				break;

			case false:
				this.$el.addClass( 'hide-controls' );
				break;
		}

		if( this.options.controls.indicators.display ) {

			this.$indicators = $( '<ol/>' )
				.addClass( className + '-indicators' )
				.appendTo( this.$el )
			;
		}
	};

	/**
	 * Add a list item to the indicators
	 *
	 * @private
	 */
	DeveloSlider.prototype._addIndicator = function(){

		var $indicator = $( '<li>' )
				.html( this.options.controls.indicators.content )
				.appendTo( this.$indicators )
			;
	};

	/**
	 * Updates the indicators and selects the correct one.
	 *
	 * @param indexToSelect
	 * @private
	 */
	DeveloSlider.prototype._updateIndicators = function( indexToSelect ){

		if( typeof indexToSelect === 'undefined' )
			indexToSelect = this._findSelectedIndicator() + 1;

		this.$indicators.find( 'li' ).removeClass( 'selected' );
		return this.$indicators.find( 'li:eq( ' + indexToSelect + ')' ).addClass( 'selected' );
	};

	/**
	 * Find the currently selected indicatior
	 *
	 * @returns {number}
	 * @private
	 */
	DeveloSlider.prototype._findSelectedIndicator = function(){

		for( var i = 0; i < this.$indicators.find( 'li' ).length; i++ ) {

			if( $( this.$indicators.find( 'li' )[i] ).hasClass( 'selected' ) )
				return i;
		}
	};

	/**
	 * Initialise the indicators, just select the first one.
	 *
	 * @private
	 */
	DeveloSlider.prototype._initialiseIndicators = function(){

		this._updateIndicators( 0 );
	};

	/**
	 * Set up all the bindings that are used in the plugin.
	 */
	DeveloSlider.prototype.setupBindings = function(){

		this.$next.on( 'click tap', $.proxy( this.moveSliderRight, this ) );
		this.$previous.on( 'click tap', $.proxy( this.moveSliderLeft, this ) );
	};

	/**
	 * Sets up the auto slide bindings
	 */
	DeveloSlider.prototype.setupAutoSlideBindings = function(){

		this.$viewport.on( 'mouseenter', $.proxy( this.autoSlideStop, this ) );
		this.$viewport.on( 'mouseleave', $.proxy( this.autoSlideStart, this ) );
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

		var currentMarginLeft = this.$container[0].style.marginLeft ?
			parseInt( this.$container[0].style.marginLeft ) :
			0;

		var newMarginLeft = currentMarginLeft ?
			currentMarginLeft + offsetLeft :
			offsetLeft;

		var constraints = this.getMarginConstraints();

		if( newMarginLeft > constraints.max )
			newMarginLeft = constraints.max;

		if( newMarginLeft < constraints.min )
			newMarginLeft = constraints.min;

		this.$container[0].style.marginLeft = newMarginLeft + 'px';

		var amountMoved = newMarginLeft - currentMarginLeft;

		if( this.options.controls.indicators.display ) {

			if( amountMoved != 0 ) {

				var indexToSelect = this._findSelectedIndicator();

				if( amountMoved > 0 )
					indexToSelect--; // Move backward

				else
					indexToSelect++; // Move forward

				this._updateIndicators( indexToSelect );
			}
		}


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

		var $item = $( item );

		$item.addClass( className + '-item' );

		this.items.push( item );

		// Fluid item width fix... Probably need to look at a nicer way of doing this.
		if( this.options.keepItemWidth )
			$item.width( parseInt( $item.width() ) );

		// Add indicator if we are displaying them
		if( this.options.controls.indicators.display )
			this._addIndicator();

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

		if( this.options.keepItemWidth )
			$item.width( parseInt( $item.width() ) );

		// Add indicator if we are displaying them
		if( this.options.controls.indicators.display )
			this._addIndicator();

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
			min: -( this.getContainerWidth() - this.$viewport.width() )
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

			newWidth = newWidth + $( this.items[i] ).outerWidth( true );
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
	 *
	 */
	DeveloSlider.prototype.autoSlideStart = function(){

		autoSlide = setTimeout( $.proxy( this.autoSlide, this ), this.options.autoSlide );
	};

	/**
	 * Starts the auto slide, and checks if the slide has moved. If it hasn't moved it presumes
	 * we need to reset the slider.
	 */
	DeveloSlider.prototype.autoSlide = function(){

		var amountMoved = this.moveSliderRight();

		if( amountMoved == 0 )
			this.resetSliderPosition();

		this.autoSlideStart();
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