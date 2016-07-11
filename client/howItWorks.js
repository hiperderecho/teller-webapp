var createElement = require('virtual-dom/create-element');
var getSlug       = require('speakingurl');

var resetNavbarSections      = require('./utils/resetNavbarSections');
var buildHowItWorksAffixItem = require('./utils/buildHowItWorksAffixItem');

module.exports = function ( app ) {
	var copyContent        = $('div.js-copy-content')
	  , copyMenuHolder     = $('div.js-copy-menu')
	  , copyMenuHolderList = $('div.js-copy-menu').find('ul')
	  , shouldEraseHash    = true
	// fn declarations
	  , addResponsiveClassToImages
	  , buildMenu
	  , main
	  , manageSmoothScrolling
	  , onWindowScroll
	  ;

	addResponsiveClassToImages = function ( copyContent ) {

		copyContent.find('img').toArray().forEach( function ( image ) {

			$( image ).addClass('img-responsive');
		} );
	};

	buildMenu = function ( copyContent, copyAffixHolderList ) {

		copyContent.find('h1,h2,h3,h4,h5,h6').toArray().forEach( function ( heading ) {

			$( heading ).prop( 'id', getSlug( $( heading ).text() ) );
			$( createElement( buildHowItWorksAffixItem( $( heading ).text() ) ) ).appendTo( copyAffixHolderList );
			heading.nodeName.split('').pop() !== '1' && copyAffixHolderList.find('li').last().addClass('indent-' + (+heading.nodeName.split('').pop() - 1) );
		} );
	};

	manageSmoothScrolling = function () {

		$('a[href*="#"]:not([href="#"])').on('click', function ( e ) {

			shouldEraseHash = false;
			e.preventDefault();
			if ( history.pushState ) {
				history.pushState( null, null, this.hash);
			} else {
				window.location.hash = this.hash;
			}
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target;

				target = $('[id="' + this.hash.slice(1) + '"]');
				if ( target.length ) {
					$('html,body').animate( { scrollTop: target.offset().top - 20 }, 1000, function () {
						shouldEraseHash = true;
					} );
					return false;
				}
			}
		} );
	};

	onWindowScroll = function () {
		var $window    = $( window )
		  , topMark    = 180
		  , bottomMark = 2910
		  ;

		if ( shouldEraseHash ) {
			history.pushState('', document.title, window.location.pathname + window.location.search);
			shouldEraseHash = false;
		}
		if ( $window.scrollTop() > topMark && $window.scrollTop() < bottomMark ) {
			copyMenuHolder.addClass('copy-menu-affix');
		} else {
			copyMenuHolder.removeClass('copy-menu-affix');
		}
		if ( $window.scrollTop() >= bottomMark ) {
			copyMenuHolder.addClass('copy-menu-affix-bottom');
		} else {
			copyMenuHolder.removeClass('copy-menu-affix-bottom');
		}
	};

	main = function () {

		Promise.resolve( resetNavbarSections() )
		.then( function () {

			$('li.navbar-how-it-works').addClass('active');
		} );
		addResponsiveClassToImages( copyContent );
		buildMenu( copyContent, copyMenuHolderList );
		$( window ).on('scroll', onWindowScroll ).scrollTop( 0 );
		manageSmoothScrolling();
	};

	main();
};