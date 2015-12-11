var rp     = require('request-promise');
var config = require('../config');

module.exports = function ( id ) {
	var options = { json: true, uri: config.webapp.apiUrl + 'api/questions/' + id };

	return rp( options );
};