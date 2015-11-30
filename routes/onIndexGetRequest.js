var config = require( '../config' );

module.exports = function ( request, response ) {

	response.render( 'index', { apiUrl: config.webapp.apiUrl } );
};