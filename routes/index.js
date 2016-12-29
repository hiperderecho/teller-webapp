module.exports = function ( app ) {

	app.get( '/'                              , require( './onIndexGetRequest' ) );
	app.get( '/solicitudes/:questionId/:slug' , require( './onQuestionGetRequest' ) );
	app.get( '/nueva-solicitud/'              , require( './onSendQuestionGetRequest' ) );
	app.get( '/solicitudes-enviadas/'         , require( './onBrowseQuestionsGetRequest' ) );
	app.get( '/entidades'                     , require( './onAgenciesGetRequest' ) );
	app.get( '/descargar/:givens'             , require( './onDownloadAttachmentGetRequest' ) );
	app.get( '/como-funciona/'                , require( './onHowItWorksGetRequest' ) );
	app.get( '/creditos/'                     , require( './onCreditsGetRequest' ) );
};