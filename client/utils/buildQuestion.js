var h = require('virtual-dom/h');

module.exports = function ( question, agencies ) {
	var domChunk;

	moment.tz.setDefault('America/Lima');
	domChunk = h('div', { attributes: { 'data-id': question.id, 'class': 'question js-question', 'data-title': question.id } }
	            , [ h('a', { attributes: { 'href': '/solicitudes/' + question.id + '/' + getSlug( question.title ) } }
	                 , [ h('h4', [ question.title ] )
	                   , h('span.for', [ agencies[ question.agencyId ] || question.agencyId ] )
	                   , h('p', [ moment( question.createdAt ).fromNow() ] )
	                   ]
	                 )
	              ]
	            );

	return domChunk;
};