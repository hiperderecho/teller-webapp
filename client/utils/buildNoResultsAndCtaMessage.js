var h = require('virtual-dom/h');

module.exports = function () {
	var domChunk;

	domChunk = h('div', { attributes: { 'class': 'no-results-search' } }
	            , [ h('h4', [ 'No encontramos una pregunta parecida' ] )
	              , h('a', { attributes: { 'href': '/nueva-solicitud' } }, [ 'Puedes enviar una' ] )
	              ]
	            );

	return domChunk;
};