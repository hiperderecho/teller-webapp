var createElement = require('virtual-dom/create-element');

var buildQuestion               = require('./utils/buildQuestion');
var buildNoResultsAndCtaMessage = require('./utils/buildNoResultsAndCtaMessage');
var substringMatcher            = require('./utils/substringMatcher');
var resetNavbarSections         = require('./utils/resetNavbarSections');

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

			searchData.push( { id        : $( serverRenderedQuestion ).data('id')
			                 , title     : $( serverRenderedQuestion ).data('title')
			                 , agencyName: $( serverRenderedQuestion ).data('agency-name')
			                 } );
		} );
	};

	buildResults = function ( results ) {
		if ( !results.length ) {
			$( createElement(  buildNoResultsAndCtaMessage() ) ).appendTo( questionsHolder );
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
	Promise.resolve( resetNavbarSections() )
	.then( function () {

		$('li.navbar-browse-questions').addClass('active');
	} );
};