#Live List Web Component
##a self updating unordered list.

##Installing

`bower intall live-list`

##Usage

Live-List is an extention of an unordered list. To use it, the `as` attribute must be used.

	<ul is="live-list">
	</ul>

There are two additional attibutes that can be added to the `<live-list>`. 

###endpoint

The `endpoint` attribute is where the magic happens. The value of this attribute is a valid API endpoint that returns a JSON array.

	<ul is="live-list" endpoint="/api/endpoint/list/">
	</ul>

The `<live-list>` will hit the endpoint at element instantiation and display the results of the call in child `<li>`s.

###frequency

The `frequency` attribute can be used to poll the endpoint periodically. The value of the attribute represents the number of seconds between polls. Fractional seconds are permissable.

	<ul is="live-list" endpoint="/api/endpoint/list/" frequency="10">
	</ul>

###templates

Dumping items from an array to a list is nice, but most API responses don't return `array`s of `string`s but of `object`s. That's why live-list allows for data binding with __Domingo__. __Domingo__ is simple data-binding on DOM elements. You can bind to the text-content of elemnts as well as attribute values and attribute names.

	<ul is="live-list" endpoint="/api/endpoint/list/" frequency="10">

		<template>
			<li class="live-list__item--{{category}}" data-{{foo}}="{{bar}}">{{text}}</li>
		</template>
	</ul>

Downward object traversal is also supported

	<ul is="live-list" endpoint="/api/endpoint/list/" frequency="10">

		<template>
			<li class="live-list__item--{{category}}" data-{{foo}}="{{bar}}">{{values.text}}</li>
		</template>
	</ul>