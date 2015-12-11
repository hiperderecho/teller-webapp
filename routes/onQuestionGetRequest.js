var config  = require( '../config' );
var methods = require( '../methods' );
var moment  = require( 'moment' );
var btoa    = require( 'btoa' );

module.exports = function ( request, response ) {
	var id = request.params['questionId'];

	methods.getQuestionViewResources( id )
	.then( function ( result ) {

		result.answers.forEach( function ( answer ) {

			answer.formattedDate = moment( answer.createdAt, 'YYYYMMDD').fromNow();
			if ( !!answer.attachment ) {
				answer.attachmentUrl      = '/descargar/' + btoa( answer.attachment );
				answer.attachmentMimeType = JSON.parse( answer.attachment ).mimeType;
			}
		} );

		response.render( 'question', { apiUrl: config.webapp.apiUrl, id: id, question: result.question, answers: result.answers } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};