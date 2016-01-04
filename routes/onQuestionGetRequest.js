var config   = require( '../config' );
var methods  = require( '../methods' );
var moment   = require( 'moment' );
var btoa     = require( 'btoa' );
var filesize = require('file-size');

module.exports = function ( request, response ) {
	var id = request.params['questionId'];

	methods.getQuestionViewResources( id )
	.then( function ( result ) {
		var lastAnswerType;
		var parsedAgencies;

		if ( result.question.status === config.webapp.flaggedStatus ) {
			response.status('404').render( '404' );
			return;
		}

		parsedAgencies = methods.parseAgenciesForInterpolationFromAgenciesModel( result.agencies );

		result.answers.forEach( function ( answer ) {

			answer.formattedDate = moment( answer.createdAt ).fromNow();
			lastAnswerType = answer.type;

			if ( !!answer.attachments ) {
				answer.attachments.forEach( function ( attachment ) {
					attachment.attachmentUrl = '/descargar/' + btoa( JSON.stringify( attachment ) );
					// Legacy fail safe
					if ( attachment.size ) {
						attachment.humanFileSize = filesize( attachment.size ).human('si');
					}
				} );
			}
		} );

		result.question.agencyName      = parsedAgencies[ result.question.agencyId ];
		result.question.formattedDate   = moment( result.question.createdAt ).fromNow();
		result.question.localizedStatus = config.webapp.localizedStatus[ result.question.status ];

		response.render( 'question', { apiUrl: config.webapp.apiUrl, id: id, question: result.question, answers: result.answers, lastAnswerType: lastAnswerType } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};