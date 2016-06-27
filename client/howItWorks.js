var resetNavbarSections = require('./utils/resetNavbarSections');

module.exports = function ( app ) {

	Promise.resolve( resetNavbarSections() )
	.then( function () {

		$('li.navbar-how-it-works').addClass('active');
	} );
};