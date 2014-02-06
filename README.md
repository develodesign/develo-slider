develo-slider
=============

A simple, lightweight slider plugin for jQuery, that only uses CSS for animations.

### Basic Usage ###

Have your slider container and items on the page like so:

```html
&lt;div id=&quot;slider-one&quot;&gt;

	&lt;img src=&quot;images/image1.png&quot;&gt;

	&lt;img src=&quot;images/image2.png&quot;&gt;

	...

&lt;/div&gt;
```

Initiate your slider and tell it what items to use:

```javascript

$( '#slider-one' ).develoSlider({
    items: $( '#slider-one img' )
} );

```


