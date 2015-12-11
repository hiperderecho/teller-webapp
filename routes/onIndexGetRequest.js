var config  = require( '../config' );
var methods = require( '../methods' );
var getSlug = require( 'speakingurl' );
var moment  = require( 'moment' );

moment.locale('es');

module.exports = function ( request, response ) {

	methods.getIndexViewResources()
	.then( function ( result ) {
		var parsedAgencies = {};

		result.agencies.forEach( function ( agency ) {
			parsedAgencies[ agency.id ] = agency.name;
		} );

		result.questions.forEach( function ( question ) {
			question.slug          = getSlug( question.title );
			question.formattedDate = moment( question.createdAt, 'YYYYMMDD').fromNow();
		} );

		response.render( 'index', { apiUrl: config.webapp.apiUrl, questions: result.questions, agencies: parsedAgencies } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};