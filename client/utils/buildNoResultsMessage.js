var h = require('virtual-dom/h');

module.exports = function () {
	var domChunk;

	domChunk = h('div', { attributes: { 'class': 'no-results-search' } }
	            , [ h('h4', [ 'No hay resultados' ] )
	              , h('p', ['Puedes revisar ', h('a', { attributes: { 'href': '/solicitudes-enviadas' } }, [ 'todas las preguntas' ] ) ] )
	              , h('p', ['o puedes ', h('a', { attributes: { 'href': '/nueva-solicitud' } }, [ 'enviar una pregunta' ] ) ] )
	              ]
	            );

	return domChunk;
};