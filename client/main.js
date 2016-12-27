require("babel-polyfill");
var views =
{ index           : require('./index')
, question        : require('./question')
, ctaForm         : require('./ctaForm')
, browseQuestions : require('./browseQuestions')
, agencies        : require('./agencies')
, credits         : require('./credits')
, howItWorks      : require('./howItWorks')
};

var init = function () {
	var view = $('div.js-app-holder').data('view')
	  , app  = {}
	  ;

	moment.locale('es');
	moment.tz.setDefault('America/Lima');

	app.apiBaseUrl      = $('div.js-content').data('api-url');
	app.apiQuestionsUrl = app.apiBaseUrl + 'api/questions/';
	app.apiAgenciesUrl  = app.apiBaseUrl + 'api/agencies/';
	app.apiAnswersUrl   = app.apiBaseUrl + 'api/answers/';
	app.localStorageNS  = 'pidelainfo';

	if ( view === 'sendQuestion' ) {
		view = 'ctaForm';
	}
	views[ view ]( app );

	// Global icons
	$('span.remark:contains("Abierta")')        .addClass('pi-icon pi-icon-open');
	$('span.remark:contains("Respondida")')     .addClass('pi-icon pi-icon-unsuccessful');
	$('span.remark:contains("Aceptada")')       .addClass('pi-icon pi-icon-successful');
	$('span.remark:contains("Desatendida")')    .addClass('pi-icon pi-icon-unanswered');
};

$( init );