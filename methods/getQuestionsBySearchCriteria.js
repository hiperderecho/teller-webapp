var rp     = require('request-promise');
var config = require('../config');

module.exports = function ( givens ) {
	var page    = givens.page - 1 || 0
	  , q       = givens.q        || ''
	  , agency  = givens.agency   || ''
	  , options = { json: true, uri: config.webapp.apiUrl + 'api/questions/search/' + page }
	  ;

	if ( q || agency ) {
		options.qs = {};
	}
	if ( q ) {
		options.qs.q = q;
	}
	if ( agency ) {
		options.qs.agency = agency;
	}
	return rp( options );
};