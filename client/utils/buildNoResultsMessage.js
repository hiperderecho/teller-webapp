var h = require('virtual-dom/h');

module.exports = function () {
	var domChunk;

	domChunk = h('div', { attributes: { 'class': 'no-results-search' } }
	            , [ h('h4', [ 'No hay resultados' ] )
	              , h('p', ['Puedes revisar ', h('a', { attributes: { 'href': '/buscar-preguntas' } }, [ 'todas las preguntas' ] ) ] )
	              , h('p', ['o puedes ', h('a', { attributes: { 'href': '/enviar-pregunta' } }, [ 'enviar una pregunta' ] ) ] )
	              ]
	            );

	return domChunk;
};