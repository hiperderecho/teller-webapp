var rp     = require('request-promise');
var config = require('../config');

module.exports = function () {
	var options = { json: true, uri: config.webapp.apiUrl + 'api/agencies' };

	return rp( options );
};