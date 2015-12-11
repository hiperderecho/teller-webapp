var getListOfAgencies  = require( './getListOfAgencies' );
var getListOfQuestions = require( './getListOfQuestions' );

module.exports = function () {

	return Promise.all( [ getListOfAgencies()
	                    , getListOfQuestions()
	                    ] )
	.then( function ( result ) {

		return { questions: result[1], agencies: result[0] };
	} );
};