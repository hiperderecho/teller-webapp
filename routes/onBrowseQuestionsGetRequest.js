var config  = require( '../config' );
var methods = require( '../methods' );

module.exports = function ( request, response ) {

	methods.getBrowseQuestionsViewResources()
	.then( function ( result ) {
		var parsedAgencies;

		parsedAgencies = methods.parseAgenciesForInterpolationFromAgenciesModel( result.agencies );
		result.questions.forEach( methods.addViewPropertiesToQuestionModel );

		response.render( 'browseQuestions', { apiUrl: config.webapp.apiUrl, questions: result.questions, parsedAgencies: parsedAgencies, agencies: result.agencies } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};