module.exports = function ( app ) {

	app.get( '/'                           , require( './onIndexGetRequest' ) );
	app.get( '/preguntas/:questionId/:slug', require( './onQuestionGetRequest' ) );
	app.get( '/enviar-pregunta/'           , require( './onSendQuestionGetRequest' ) );
	app.get( '/descargar/:givens'          , require( './onDownloadAttachmentGetRequest' ) );
};