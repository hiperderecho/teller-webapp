var getListOfAgencies  = require( './getListOfAgencies' );
var getListOfQuestions = require( './getListOfQuestions' );
var getQuestionsCount  = require( './getQuestionsCount');
var config             = require( '../config' );

module.exports = function () {

	return Promise.all( [ getListOfAgencies()
	                    , getListOfQuestions( config.webapp.views.index.questionsLimit )
	                    , getQuestionsCount()
	                    ] )
	.then( function ( result ) {

		return { questions: result[1], agencies: result[0], questionsCount: result[2] };
	} );
};