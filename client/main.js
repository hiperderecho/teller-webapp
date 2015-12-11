require("babel-polyfill");
var index                   = require('./index');
var question                = require('./question');
var ctaForm                 = require('./ctaForm');

var init = function () {
	var view = $('div.js-content').data('view')
	  , app  = {}
	  ;

	moment.locale('es');

	app.apiBaseUrl      = $('div.js-content').data('api-url');
	app.apiQuestionsUrl = app.apiBaseUrl + 'api/questions/';
	app.apiAgenciesUrl  = app.apiBaseUrl + 'api/agencies/';
	app.apiAnswersUrl   = app.apiBaseUrl + 'api/answers/';
	app.localStorageNS  = 'pidelainfo';

	if ( view === 'index' ) {
		index( app );
	}
	if ( view === 'question' ) {
		question( app );
	}
	if ( view === 'sendQuestion' ) {
		ctaForm( app );
	}
};

$( init );