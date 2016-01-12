module.exports = function substringMatcher( data ) {
	var strs        = _.pluck( data, 'title' );
	var agencyNames = _.pluck( data, 'agencyName' );

	strs.forEach( function ( str, index, strs ) {

		strs[ index ] = str + ' ' + agencyNames[ index ];
	} );

	return function findMatches( q, cb ) {
		var matches
		  , substringRegex
		  ;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `q`
		substrRegex = new RegExp( q, 'i' );

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		$.each( strs, function ( i, str ) {
			var noAccentsStr = str;

			// L10n
			noAccentsStr = noAccentsStr.replace(/á|_/g,'a');
			noAccentsStr = noAccentsStr.replace(/é|_/g,'e');
			noAccentsStr = noAccentsStr.replace(/í|_/g,'i');
			noAccentsStr = noAccentsStr.replace(/ó|_/g,'o');
			noAccentsStr = noAccentsStr.replace(/ú|_/g,'u');

			if ( substrRegex.test( str ) ) {
				matches.push( data[ i ] );
				return;
			}
			if ( substrRegex.test( noAccentsStr ) ) {
				matches.push( data[ i ] );
				return;
			}
		});

		cb( matches );
	};
};