var getListOfAgencies = require( './getListOfAgencies' );

module.exports = function () {

	return Promise.all( [ getListOfAgencies( {orderBy:'sent'} )
	                    , getListOfAgencies( {orderBy:'answered'} )
	                    ] )
	.then( function ( result ) {

		return { agenciesBySentMetaStatus: result[0], agenciesByAnsweredMetaStatus: result[1] };
	} );
};