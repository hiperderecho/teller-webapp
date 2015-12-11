var config  = require( '../config' );
var methods = require( '../methods' );
var moment  = require( 'moment' );

module.exports = function ( request, response ) {

	methods.getListOfAgencies()
	.then( function ( result ) {

		response.render( 'sendQuestion', { apiUrl: config.webapp.apiUrl, agencies: result } );
	} )
	.catch( function ( error ) {

		response.status(500).render( '500', { error: error.stack } );
	} );
};