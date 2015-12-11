var rp     = require('request-promise');
var config = require('../config');

module.exports = function ( questionId ) {
	var options = { json: true, uri: config.webapp.apiUrl + 'api/answers/' + questionId };

	return rp(options);
};