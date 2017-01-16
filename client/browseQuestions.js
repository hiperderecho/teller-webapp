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
	  , criteriaExplanation= $('p.js-criteria-explanation')
	  , showFormBtn        = $('button.js-show-search-form-btn')
	  , filterData         = []
	  , metaStatuses       = {}
	  , criteria
	  , criteriaKeys
	// fn declarations
	  , buildResults
	  , explainStateUsingCriteria
	  , main
	  , manageNoResults
	  , navigateToPage
	  , onFilterBtnsClicked
	  , onSearchFormSubmitted
	  , populateFilterData
	  , resetFilter
	  , testValidSearchCriteria
	  , setCriteriaStatusToHtmlElements
	  , showForm
	  ;

	showForm = function () {

		questionSearchForm.slideDown();
		$(this).hide();
		delete criteria.colapsar;
		delete criteria.collapse;
	};

	explainStateUsingCriteria = function ( criteria, filter ) {
		var page   = criteria['pagina'] || criteria['page'] || 1;
		var agency = criteria['agency'] || criteria['entidad'];
		var q      = criteria['q'];
		var toReturn;
		var questionsCount = $('div.question').toArray().length;

		if ( !Object.keys( criteria ).length ) {
			toReturn = 'Mostrando <span class="remark">'+ questionsCount +'</span> Solicitudes en <span class="remark">la primera página</span> de todas las Solicitudes';
		} else if ( page && !agency && !q ) {
			toReturn = 'Mostrando <span class="remark">'+ questionsCount +'</span> Solicitudes en la página <span class="remark">'+ page +'</span> de todas las Solicitudes';
		} else if ( agency && q ) {
			toReturn = 'Mostrando <span class="remark">'+ questionsCount +'</span> Solicitudes en la página <span class="remark">'+ page +'</span> de las Solicitudes enviadas a la entidad <span class="remark">' + agency + '</span> usando la palabra clave <span class="remark">'+ q +'</span>';
		} else if ( agency ) {
			toReturn = 'Mostrando <span class="remark">'+ questionsCount +'</span> Solicitudes en la página <span class="remark">'+ page +'</span> de las Solicitudes enviadas a la entidad <span class="remark">' + agency + '</span>';
		} else if ( q ) {
			toReturn = 'Mostrando <span class="remark">'+ questionsCount +'</span> Solicitudes en la página <span class="remark">'+ page +'</span> de las Solicitudes enviadas que coinciden con la palabra clave <span class="remark">' + q +'</span>';
		}
		if ( filter ) {
			toReturn += ' y filtrando por <span class="remark">'+ filter +'</span>';
		}
		toReturn = toReturn + '.';
		return toReturn;
	};

	testValidSearchCriteria = function ( criteriaKey ) {

		return !_.includes( ['page','pagina','q','entidad','agency','collapse','colapsar'], criteriaKey );
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
		criteriaExplanation.html( explainStateUsingCriteria( criteria ) );
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
		criteriaExplanation.html( explainStateUsingCriteria( criteria, $this.text() ) );
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
		var agency   = criteria.entidad  || criteria.agency;
		var page     = criteria.pagina   || criteria.page;
		var collapse = criteria.colapsar || criteria.collapse;

		if ( collapse ) {
			questionSearchForm.addClass('collapse');
			showFormBtn.show();
		}
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

	manageNoResults = function () {
		criteria = {};
		questionsHolder.empty();
		paginationPage.parent().parent().hide();
		filterBtns.parent().parent().hide()
		$( createElement(  buildNoResultsAndCtaMessage() ) ).appendTo( questionsHolder );
		Promise.resolve( resetNavbarSections() )
		.then( function () {

			$('li.navbar-browse-questions').addClass('active');
		} );
	};

	if ( window.location.search === '?error' ) {
		$('p.js-error-alert').removeClass('collapse');
		criteria = {};
	} else {
		if ( window.location.search === '?sin-resultados' ) {
			manageNoResults();
		} else {
			try {
				criteria = !!window.location.search ? JSON.parse( decodeURI( window.location.search.split('=')[1] ) ) : {};
			} catch ( e ) {
				window.location.href = '/solicitudes-enviadas/?error';
			}
		}
	}
	criteriaKeys = criteria && Object.keys( criteria );
	if ( criteriaKeys.length > 4 || criteriaKeys.some( testValidSearchCriteria ) ) {
		window.location.href = '/solicitudes-enviadas/?error';
	}

	main = function () {

		showFormBtn.hide();
		criteriaExplanation.html( explainStateUsingCriteria( criteria ) );
		setCriteriaStatusToHtmlElements();
		questionSearchForm.on('submit', onSearchFormSubmitted );
		filterResetBtn.on('click', resetFilter );
		filterBtns.on('click', onFilterBtnsClicked );
		paginationPage.on('click', navigateToPage );
		showFormBtn.on('click', showForm );
		populateFilterData();
		Promise.resolve( resetNavbarSections() )
		.then( function () {

			$('li.navbar-browse-questions').addClass('active');
		} );
	};

	main();
};