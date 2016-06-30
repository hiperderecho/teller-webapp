var createElement = require('virtual-dom/create-element');

var validators                 = require('./utils/validators');
var buildOnQuestionSentMessage = require('./utils/buildOnQuestionSentMessage');
var charCount                  = require('./utils/charCount');
var resetNavbarSections        = require('./utils/resetNavbarSections');

module.exports = function ( app ) {
	var ctaFormAgency          = $('#ctaFormAgency')
	  , ctaForm                = $('#ctaForm')
	  , ctaFormErrorMessage    = $('p.js-cta-form-error-message')
	  , ctaFormSuccessMessage  = $('p.js-cta-form-success-message')
	  , ctaFormExtraInfoHolder = $('div.js-extra-info-holder')
	  , ctaFormCharCountHolder = $('span.js-char-count')
	// fn declarations
	  , onCtaFormSubmit
	  , onTextareaChanged
	  , onInputsChanged
	  , onWindowScroll
	  ;

	onCtaFormSubmit = function ( e ) {
		var $this   = $(this)
		  , isValid = []
		  ;
		e.preventDefault();

		isValid.push( !!$('#ctaFormAgency').find('option:selected').val() );
		isValid.push( validators.fullname.test( ctaForm.find('#ctaFormAuthorFullName').val() )
		              && ctaForm.find('#ctaFormAuthorFullName').val().length < 61
		              && ctaForm.find('#ctaFormAuthorFullName').val().length > 4 );
		isValid.push( validators.dni.test( ctaForm.find('#ctaFormDni').val() )
		              && ctaForm.find('#ctaFormDni').val().length === 8 );
		isValid.push( validators.address.test( ctaForm.find('#ctaFormAddress').val() )
		              && ctaForm.find('#ctaFormAddress').val().length < 100 );
		isValid.push( validators.email.test( ctaForm.find('#ctaFormAuthor').val() ) );
		isValid.push( validators.text.test( ctaForm.find('#ctaFormTitle').val() )
		              && ctaForm.find('#ctaFormTitle').val().length < 61
		              && ctaForm.find('#ctaFormTitle').val().length > 4 );
		isValid.push( validators.text.test( ctaForm.find('#ctaFormContent').val() )
		              && ctaForm.find('#ctaFormContent').val().length < 801
		              && ctaForm.find('#ctaFormContent').val().length > 39
		              && ctaForm.find('#ctaFormContent').val() !== 'Buenos días, mi nombre es');
		isValid.push( !!grecaptcha.getResponse() );

		if ( isValid.every( function ( e ) { return e; } ) ) {

			ctaFormExtraInfoHolder.parent().hide();
			$( window ).scrollTop( 0 );
			ctaFormSuccessMessage.show();
			$.post( app.apiQuestionsUrl, $this.serialize() )
			.then( function ( result ) {
				var $parent = ctaForm.parent();

				$parent.empty();
				$( createElement( buildOnQuestionSentMessage( result.authorSecret, result.id, result.title ) ) ).appendTo( $parent );
			} );
		}

		if ( !isValid.every( function ( e ) { return e; } ) ) {
			ctaFormErrorMessage.show();
		}
	};

	onInputsChanged = function () {

		ctaFormErrorMessage.fadeOut();
	};

	onTextareaChanged = function () {
		var $this = $(this);

		ctaFormCharCountHolder.text( charCount( $this.val() ) );
	};

	onWindowScroll = function () {
		var $window    = $(window)
		  , topMark    = 220
		  , bottomMark = 1040
		  ;

		if ( $window.scrollTop() > topMark && $window.scrollTop() < bottomMark ) {
			ctaFormExtraInfoHolder.addClass('extra-info-affix');
		} else {
			ctaFormExtraInfoHolder.removeClass('extra-info-affix');
		}
		if ( $window.scrollTop() >= bottomMark ) {
			ctaFormExtraInfoHolder.addClass('extra-info-affix-bottom');
		} else {
			ctaFormExtraInfoHolder.removeClass('extra-info-affix-bottom');
		}
	};

	ctaForm.find('input,textarea,select').on('keyup change', onInputsChanged );
	ctaForm.on('submit', onCtaFormSubmit );
	ctaForm.find('textarea').on('keyup change', onTextareaChanged );
	$('[data-toggle="tooltip"]').tooltip( { trigger: 'focus', html: true } );
	Promise.resolve( resetNavbarSections() )
	.then( function () {
		$('li.navbar-send-question').addClass('active');
	} );
	// We will use our own affix solution since bootstrap's seems to be broken :(
	$( window ).on('scroll', onWindowScroll ).scrollTop( 0 );
};