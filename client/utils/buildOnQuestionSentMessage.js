var h = require('virtual-dom/h');

module.exports = function ( authorSecret, questionId, questionTitle ) {
	var domChunk;

	domChunk = h('div', { attributes: { 'class': 'on-question-sent-message' } }
	            , [ h('h4', [ 'Gracias por enviar tu pregunta' ] )
	              , h('p', [ 'Apunta el siguiente código que también ha sido enviado a tu correo para que puedas hacer futuros cambios:' ] )
	              , h('p', [ authorSecret ] )
	              , h('a', { attributes: { 'href': '/solicitudes/' + questionId + '/' + getSlug( questionTitle ) } } , [ 'Ir a la pregunta' ] )
	              ]
	            );

	return domChunk;
};