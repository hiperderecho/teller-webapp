var createElement = require('virtual-dom/create-element');

var config                      = require('../config');
var buildQuestion               = require('./utils/buildQuestion');
var buildNoResultsAndCtaMessage = require('./utils/buildNoResultsAndCtaMessage');
var substringMatcher            = require('./utils/substringMatcher');
var resetNavbarSections         = require('./utils/resetNavbarSections');

module.exports = function ( app ) {
	var questionsHolder    = $('div.js-questions')
	  , questionList       = $('div.js-question')
	  , agenciesList       = $('select.js-agencies-list')
	  , questionSearch     = $('input.js-question-search')
	  , questionSearchForm = $('form.js-question-search-form')
	  , filterBtns         = $('label.js-btn-filter')
	  , filterResetBtn     = $('label.js-btn-filter-reset')
	  , paginationPage     = $('a.js-pagination-page')
	  , filterData         = []
	  , metaStatuses       = {}
	  , criteria
	  , criteriaItems
	// fn declarations
	  , buildResults
	  , main
	  , navigateToPage
	  , onFilterBtnsClicked
	  , onSearchFormSubmitted
	  , populateFilterData
	  , resetFilter
	  , testValidSearchCriteria
	  , setCriteriaStatusToHtmlElements
	  ;

	testValidSearchCriteria = function ( criteriaItem ) {

		return !_.includes( ['page','pagina','q','entidad','agency'], criteriaItem )
	};

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

	onFilterBtnsClicked = function () {
		var $this = $(this)
		  , filteredData
		  ;

		questionsHolder.empty();
		filteredData = filterData.filter( function ( question ) {

			return config.webapp.metaStatuses[ question.status ] === $this.data('filter-type') ? question : null;
		} );
		buildResults( filteredData );
	};

	onSearchFormSubmitted = function ( e ) {

		e.preventDefault();
		if ( agenciesList.find('option:selected').val() ) {
			criteria.entidad = agenciesList.find('option:selected').val();
			criteria.pagina  = 1;
		} else {
			delete criteria.entidad;
		}
		if ( questionSearch.val() ) {
			criteria.q      = questionSearch.val();
			criteria.pagina = 1;
		} else {
			delete criteria.q;
		}
		console.log('criteria to send', criteria);
		window.location.href = '?criteria=' + JSON.stringify( criteria );
		return;
	};

	navigateToPage = function ( e ) {
		var $this = $(this);

		e.preventDefault();
		criteria.pagina = $this.data('page');
		window.location.href = '?criteria=' + JSON.stringify( criteria );
		return;
	};

	setCriteriaStatusToHtmlElements = function () {
		var agency = criteria.entidad || criteria.agency;
		var page   = criteria.pagina  || criteria.page;

		if ( criteria.q ) {
			questionSearch.val( criteria.q );
		}
		if ( agency ) {
			agenciesList.find('option[value="'+agency+'"]').prop('selected','selected');
		}
		if ( page ) {
			$('a.js-pagination-page').parent().removeClass('active');
			$('a.js-pagination-page[data-page="'+page+'"]').parent().addClass('active');
		} else {
			$('a.js-pagination-page[data-page="1"]').parent().addClass('active');
		}
	};

	if ( window.location.search === '?error' ) {
		$('p.js-error-alert').removeClass('collapse');
		criteria = {};
	} else {
		if ( window.location.search === '?sin-resultados' ) {
			questionsHolder.empty();
			paginationPage.parent().parent().hide();
			filterBtns.parent().parent().hide()
			$( createElement(  buildNoResultsAndCtaMessage() ) ).appendTo( questionsHolder );
		} else {
			try {
				criteria = !!window.location.search ? JSON.parse( decodeURI( window.location.search.split('=')[1] ) ) : {};
				console.log('criteria try', criteria);
			} catch ( e ) {
				console.log('sup');
				window.location.href = '/solicitudes-enviadas/?error';
			}
		}
	}
	criteriaItems = criteria && Object.keys( criteria );
	if ( criteriaItems.length > 3 || criteriaItems.some( testValidSearchCriteria ) ) {
		window.location.href = '/solicitudes-enviadas/?error';
	}

	main = function () {

		setCriteriaStatusToHtmlElements();
		questionSearchForm.on('submit', onSearchFormSubmitted );
		filterResetBtn.on('click', resetFilter );
		filterBtns.on('click', onFilterBtnsClicked );
		paginationPage.on('click', navigateToPage );
		populateFilterData();
		Promise.resolve( resetNavbarSections() )
		.then( function () {

			$('li.navbar-browse-questions').addClass('active');
		} );
	};

	main();
};