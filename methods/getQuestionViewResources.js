var getQuestionByQuestionId = require( './getQuestionByQuestionId' );
var getAnswersByQuestionId  = require( './getAnswersByQuestionId' );
var getListOfAgencies       = require( './getListOfAgencies' );

module.exports = function ( questionId ) {

	return Promise.all( [ getQuestionByQuestionId( questionId )
	                    , getAnswersByQuestionId( questionId )
	                    , getListOfAgencies()
	                    ] )
	.then( function ( result ) {

		return { question: result[0], answers: result[1], agencies: result[2] };
	} );
};