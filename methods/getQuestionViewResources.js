var getQuestionByQuestionId = require( './getQuestionByQuestionId' );
var getAnswersByQuestionId   = require( './getAnswersByQuestionId' );

module.exports = function ( questionId ) {

	return Promise.all( [ getQuestionByQuestionId( questionId )
	                    , getAnswersByQuestionId( questionId )
	                    ] )
	.then( function ( result ) {

		return { question: result[0], answers: result[1] };
	} );
};