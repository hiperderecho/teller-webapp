var createElement = require('virtual-dom/create-element');

var config                      = require('../config');
var buildQuestion               = require('./utils/buildQuestion');
var buildNoResultsAndCtaMessage = require('./utils/buildNoResultsAndCtaMessage');
var substringMatcher            = require('./utils/substringMatcher');
var resetNavbarSections         = require('./utils/resetNavbarSections');

module.exports = function ( app ) {
	var questionsHolder = $('div.js-questions')
	  , questionList    = $('div.js-question')
	  , questionSearch  = $('input.js-question-search')
	  , filterBtns      = $('label.js-btn-filter')
	  , filterResetBtn  = $('label.js-btn-filter-reset')
	  , filterData      = []
	  , metaStatuses    = {}
	// fn declarations
	  , buildResults
	  , populateFilterData
	  , resetFilter
	  ;

	populateFilterData = function () {

		filterData = questionList.toArray().map( function ( serverRenderedQuestion ) {

			return { id        : $( serverRenderedQuestion ).data('id')
				     , title     : $( serverRenderedQuestion ).data('title')
				     , agencyName: $( serverRenderedQuestion ).data('agency-name')
				     , status    : $( serverRenderedQuestion ).data('status')
				     };
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

	resetFilter = function () {

		questionsHolder.empty();
		buildResults( filterData );
	};

	filterResetBtn.on('click', resetFilter);
	filterBtns.on('click', function () {
		var $this = $(this)
		  , filteredData
		  ;

		questionsHolder.empty();
		filteredData = filterData.filter( function ( question ) {

			return config.webapp.metaStatuses[ question.status ] === $this.data('filter-type') ? question : null;
		} );
		buildResults( filteredData );
	} );
	populateFilterData();
	Promise.resolve( resetNavbarSections() )
	.then( function () {

		$('li.navbar-browse-questions').addClass('active');
	} );
};