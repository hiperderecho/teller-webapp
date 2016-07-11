var h       = require('virtual-dom/h');
var getSlug = require('speakingurl');

module.exports = function ( headingText ) {
	var domChunk;

	domChunk = h('li'
	            , [ h('a', { attributes: { 'href': '#' + getSlug( headingText ) } }, [ headingText ] )
	            	]
	            );
	return domChunk;
};