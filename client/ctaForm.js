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
	  , ctaFormCharCountHolder = $('span.js-char-count')
	// fn declarations
	  , onCtaFormSubmit
	  , onTextareaChanged
	  , onInputsChanged
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

	ctaForm.find('input,textarea,select').on('keyup change', onInputsChanged );
	ctaForm.on('submit', onCtaFormSubmit );
	ctaForm.find('textarea').on('keyup change', onTextareaChanged );
	Promise.resolve( resetNavbarSections() )
	.then( function () {
		$('li.navbar-send-question').addClass('active');
	} );
};