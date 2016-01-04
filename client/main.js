require("babel-polyfill");
var index           = require('./index');
var question        = require('./question');
var ctaForm         = require('./ctaForm');
var browseQuestions = require('./browseQuestions');

var init = function () {
	var view = $('div.js-content').data('view')
	  , app  = {}
	  ;

	moment.locale('es');
	moment.tz.setDefault('America/Lima');

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
	if ( view === 'browseQuestions' ) {
		browseQuestions( app );
	}

	// Global icons
	$('span.remark:contains("Abierta")')        .addClass('pi-icon pi-icon-open');
	$('span.remark:contains("Insatisfactoria")').addClass('pi-icon pi-icon-unsuccessful');
	$('span.remark:contains("Aceptada")')       .addClass('pi-icon pi-icon-successful');
	$('span.remark:contains("Desatendida")')    .addClass('pi-icon pi-icon-unanswered');
};

$( init );