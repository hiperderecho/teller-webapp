var getSlug = require('speakingurl');

var config  = require( '../config' );
var methods = require( '../methods' );

var addSlugName = function ( agency ) {

	agency.slug = getSlug( agency.name );
	return agency;
};

module.exports = function ( request, response ) {

	methods.getAgenciesViewResources()
	.then( function ( result ) {

		result.agenciesBySentMetaStatus.forEach( addSlugName );
		result.agenciesByAnsweredMetaStatus.forEach( addSlugName );
		response.render( 'agencies', { agenciesBySentMetaStatus    : result.agenciesBySentMetaStatus
		                             , agenciesByAnsweredMetaStatus: result.agenciesByAnsweredMetaStatus
		                             } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};