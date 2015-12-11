var fs   = require('fs');
var atob = require( 'atob' );

module.exports = function ( request, response ) {
	var givens     = JSON.parse( atob( request.params['givens'] ) );
	var attachment = fs.createReadStream( '../attachments/' + givens.filename );

	response.setHeader('Content-disposition', 'attachment; filename="' + givens.originalname + '"');
	response.setHeader('Content-type', givens.mimeType );

	attachment.on( 'open', function () {

		attachment.pipe( response );
	} );

	attachment.on( 'error', function ( error ) {

		response.status( 500 ).render( '500', { error: error.stack } );
	} );
};