develo-slider
=============

A simple, lightweight slider plugin for jQuery, that only uses CSS for animations.

### Basic Usage ###

Have your slider container and items on the page like so:

```html

<div id="slider-one" class="slider-demo">

	<img src="images/image1.png" alt="image 1">

    <img src="images/image2.png" alt="image 2">

	...

</div>

```

Initiate your slider and tell it what items to use:

```javascript

$( '#slider-one' ).develoSlider({
    items: $( '#slider-one img' )
} );

```

### Advanced Usage & Examples ###

For some more advanced usages and documentation then have a look in the the examples folder.

We have some working examples and documentation on our website: http://www.develodesign.co.uk/develo-slider/examples/


