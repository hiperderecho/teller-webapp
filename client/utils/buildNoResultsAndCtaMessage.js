var h = require('virtual-dom/h');

module.exports = function () {
	var domChunk;

	domChunk = h('div', { attributes: { 'class': 'no-results-search' } }
	            , [ h('h4', [ 'No encontramos una solicitud parecida' ] )
	              , h('a', { attributes: { 'href': '/nueva-solicitud' } }, [ 'Puedes enviar una ' ] )
	              , h('span', [ 'o ' ] )
	              , h('a', { attributes: { 'href': '/solicitudes-enviadas' } }, [ 'puedes hacer otra búsqueda.' ])
	              ]
	            );

	return domChunk;
};