var createElement = require('virtual-dom/create-element');

var buildQuestion         = require('./utils/buildQuestion');
var buildNoResultsMessage = require('./utils/buildNoResultsMessage');
var substringMatcher      = require('./utils/substringMatcher');

module.exports = function ( app ) {
	var questionsHolder = $('div.js-questions')
	  , questionList    = $('div.js-question')
	  , questionSearch  = $('input.js-question-search')
	  , searchData      = []
	// fn declarations
	  , buildResults
	  , populateSearchData
	  ;

	populateSearchData = function () {

		questionList.each( function ( i, serverRenderedQuestion ) {

			searchData.push( { id    : $( serverRenderedQuestion ).data('id')
			                 , title : $( serverRenderedQuestion ).data('title')
			                 } );
		} );
	};

	buildResults = function ( results ) {
		if ( !results.length ) {
			$( createElement(  buildNoResultsMessage() ) ).appendTo( questionsHolder );
			return;
		}

		results.forEach( function ( result ) {
			var questions
			  , question
			  ;

			questions = questionsHolder.data('questions');
			question  = _.find( questions, function ( question ) { return question.id === result.id; } );
			$( createElement( buildQuestion( question, questionsHolder.data('parsed-agencies') ) ) ).appendTo( questionsHolder );
		} );
	};

	questionSearch.on( 'input', function () {
		var $this = $(this);

		questionsHolder.empty();
		substringMatcher( searchData )( $this.val(), buildResults );
	} );

	populateSearchData();
};