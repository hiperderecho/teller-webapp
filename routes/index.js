module.exports = function ( app ) {

	app.get( '/', require( './onIndexGetRequest' ) );
};