var config  = require( '../config' );
var methods = require( '../methods' );

module.exports = function ( request, response ) {
	var criteriaQuery = request.query['criteria'] || '';
	var searchCriteria;

	try {
		searchCriteria = criteriaQuery && JSON.parse( criteriaQuery );
	} catch (e) {
		// response.status(500).render( '500', { error: 'Los valores de búsqueda no son correctos.' } );
		response.redirect( '/solicitudes-enviadas/?error' );
		return;
	}
	methods.getListOfAgencies()
	.then( function ( agencies ) {
		var parsedAgencies;
		var validAgency = null;
		var searchCriteriaAgency = searchCriteria.agency || searchCriteria.entidad;
		var searchCriteriaPage   = searchCriteria.page || searchCriteria.pagina;

		if ( !searchCriteriaAgency ) {
			validAgency = true;
		} else {
			validAgency = agencies.filter( function ( agency ) { return agency.name === searchCriteriaAgency; } ).length;
		}
		parsedAgencies = methods.parseAgenciesForInterpolationFromAgenciesModel( agencies );
		methods.getQuestionsBySearchCriteria( { agency: searchCriteriaAgency, q: searchCriteria.q, page: searchCriteriaPage } )
		.then( function ( searchResult ) {
			var count     = searchResult.count;
			var questions = searchResult.result;
			var pages     = Math.ceil( count / 20 );

			questions.forEach( methods.addViewPropertiesToQuestionModel );
			if ( questions.length && validAgency ) {
				response.render( 'browseQuestions', { apiUrl        : config.webapp.apiUrl
				                                    , questions     : questions
				                                    , parsedAgencies: parsedAgencies
				                                    , agencies      : agencies
				                                    , pages         : pages
				                                    } );
				return;
			}
			response.redirect( '/solicitudes-enviadas/?sin-resultados' );
		} )
		.catch( function ( error ) {

			response.status(500).render( '500', { error: error.stack } );
		} );
	} );

	// methods.getBrowseQuestionsViewResources()
	// .then( function ( result ) {
	// 	var parsedAgencies;

	// 	parsedAgencies = methods.parseAgenciesForInterpolationFromAgenciesModel( result.agencies );
	// 	result.questions.forEach( methods.addViewPropertiesToQuestionModel );

	// 	response.render( 'browseQuestions', { apiUrl: config.webapp.apiUrl, questions: result.questions, parsedAgencies: parsedAgencies, agencies: result.agencies } );
	// } )
	// .catch( function ( error ) {

	// 	response.status(500).render( '500', { error: error.stack } );
	// } );
};