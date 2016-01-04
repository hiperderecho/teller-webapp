var rp     = require('request-promise');
var config = require('../config');

module.exports = function ( limit ) {
	var options = { json: true, uri: config.webapp.apiUrl + 'api/questions/' };

	if ( limit ) {
		options.uri += '?limit=' + limit;
	}

	return rp( options );
};