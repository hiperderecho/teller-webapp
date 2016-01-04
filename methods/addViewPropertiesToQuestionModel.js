var getSlug = require( 'speakingurl' );
var moment  = require( 'moment' );
var tz      = require( 'moment-timezone' );

module.exports = function ( question ) {

	question.slug = getSlug( question.title );
	question.formattedDate = moment( question.createdAt ).fromNow();
};