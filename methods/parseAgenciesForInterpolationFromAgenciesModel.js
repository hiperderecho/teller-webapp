module.exports = function ( agencies ) {
	var parsedAgencies = {};

	agencies.forEach( function ( agency ) {

		parsedAgencies[ agency.id ] = agency.name;
	} );

	return parsedAgencies;
};