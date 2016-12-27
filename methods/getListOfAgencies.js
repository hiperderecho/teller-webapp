var rp     = require('request-promise');
var config = require('../config');

module.exports = function ( givens ) {
	var options = { json: true, uri: config.webapp.apiUrl + 'api/agencies' };

	if ( givens && givens.orderBy ) {
		options.uri += '?orderBy=' + givens.orderBy;
	}
	return rp( options );
};