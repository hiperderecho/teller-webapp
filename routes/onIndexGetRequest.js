var config  = require( '../config' );
var methods = require( '../methods' );

module.exports = function ( request, response ) {

	methods.getIndexViewResources()
	.then( function ( result ) {
		var parsedAgencies;

		parsedAgencies = methods.parseAgenciesForInterpolationFromAgenciesModel( result.agencies );
		result.questions.forEach( methods.addViewPropertiesToQuestionModel );

		response.render( 'index', { apiUrl: config.webapp.apiUrl, questions: result.questions, questionsCount: result.questionsCount, parsedAgencies: parsedAgencies, agencies: result.agencies } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};