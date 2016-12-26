var createElement = require('virtual-dom/create-element');

var validators                 = require('./utils/validators');
var buildOnQuestionSentMessage = require('./utils/buildOnQuestionSentMessage');
var charCount                  = require('./utils/charCount');
var resetNavbarSections        = require('./utils/resetNavbarSections');
var addError                   = require('./utils/addErrorToFormGroup');
var addSuccess                 = require('./utils/addSuccessToFormGroup');

module.exports = function ( app ) {
	var ctaFormAgency                   = $('#ctaFormAgency')
	  , ctaForm                         = $('#ctaForm')
	  , ctaFormErrorMessage             = $('p.js-cta-form-error-message')
	  , ctaFormSuccessMessage           = $('p.js-cta-form-success-message')
	  , ctaFormExtraInfoHolder          = $('div.js-extra-info-holder')
	  , ctaFormCharCountHolder          = $('span.js-char-count')
	  , formControlToValidate           = $('.form-control.to-validate')
	  , wereValidationListenersSettedUp = false
	// fn declarations
	  , onCtaFormSubmit
	  , onTextareaChanged
	  , onInputsChanged
	  , onWindowScroll
	  , onFormControlToValidateChange
	  ;

	window.onGrecaptchaChecked = function () {

		if ( wereValidationListenersSettedUp ) {
			$('div.g-recaptcha').parent().removeClass('has-error').addClass('has-success');
		}
	};

	onCtaFormSubmit = function ( e ) {
		var $this   = $(this)
		  , isValid = []
		  ;

		e.preventDefault();
		isValid = formControlToValidate.toArray().map( onFormControlToValidateChange );

		if ( isValid.every( function ( e ) { return e; } ) ) {
			ctaFormExtraInfoHolder.parent().hide();
			ctaFormSuccessMessage.show();
			$.post( app.apiQuestionsUrl, $this.serialize() )
			.then( function ( result ) {
				var $parent = ctaForm.parent();

				$parent.empty();
				$( createElement( buildOnQuestionSentMessage( result.authorSecret, result.id, result.title ) ) ).appendTo( $parent );
				$( window ).scrollTop( 0 );
			} );
		}

		if ( !isValid.every( function ( e ) { return e; } ) ) {
			ctaFormErrorMessage.show();
			if ( !wereValidationListenersSettedUp ) {
				wereValidationListenersSettedUp = true;
				formControlToValidate.toArray().forEach( function ( formControl ) {

					$(formControl).on('change keyup paste', onFormControlToValidateChange).trigger('paste');
				} )
			}
		}
	};

	onFormControlToValidateChange = function ( event ) {
		var formControl = !!event.target ? $(event.target) : $(event)
		  , isValid     = false
		  ;

		if ( formControl.attr('id') === 'ctaFormAgency'
		     && !!$('#ctaFormAgency').find('option:selected').val() ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormAgency'
		     && !$('#ctaFormAgency').find('option:selected').val() ) {
			addError( formControl );
		}
		if ( formControl.attr('id') === 'ctaFormAuthorFullName'
		     && validators.fullname.test( formControl.val() )
		     && formControl.val().length < 61
		     && formControl.val().length > 4 ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormAuthorFullName'
		     && !( validators.fullname.test( formControl.val() )
		     && formControl.val().length < 61
		     && formControl.val().length > 4 ) ) {
			addError( formControl );
		}
		if ( formControl.attr('id') === 'ctaFormDni'
		     && validators.dni.test( formControl.val() )
		     && formControl.val().length > 3
		     && formControl.val().length < 9 ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormDni'
		     && !( validators.dni.test( formControl.val() )
		     && formControl.val().length > 3
		     && formControl.val().length < 9 ) ) {
			addError( formControl );
		}
		if ( formControl.attr('id') === 'ctaFormAddress'
		     && validators.address.test( formControl.val() )
		     && formControl.val().length < 100 ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormAddress'
		     && !( validators.address.test( formControl.val() )
		     && formControl.val().length < 100 ) ) {
			addError( formControl );
		}
		if ( formControl.attr('id') === 'ctaFormAuthor'
		     && validators.email.test( formControl.val() ) ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormAuthor'
		     && !validators.email.test( formControl.val() ) ) {
			addError( formControl );
		}
		if ( formControl.attr('id') === 'ctaFormTitle'
		     && validators.text.test( formControl.val() )
		     && formControl.val().length < 61
		     && formControl.val().length > 4 ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormTitle'
		     && !( validators.text.test( formControl.val() )
		     && formControl.val().length < 61
		     && formControl.val().length > 4 ) ) {
			addError( formControl );
		}
		if ( formControl.attr('id') === 'ctaFormContent'
		     && validators.text.test( ctaForm.find('#ctaFormContent').val() )
		     && ctaForm.find('#ctaFormContent').val().length < 801
		     && ctaForm.find('#ctaFormContent').val().length > 39 ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.attr('id') === 'ctaFormContent'
		     && !( validators.text.test( ctaForm.find('#ctaFormContent').val() )
		     && ctaForm.find('#ctaFormContent').val().length < 801
		     && ctaForm.find('#ctaFormContent').val().length > 39 ) ) {
			addError( formControl );
		}
		if ( formControl.hasClass('g-recaptcha')
		     && !!grecaptcha.getResponse() ) {
			addSuccess( formControl );
			isValid = true;
		}
		if ( formControl.hasClass('g-recaptcha')
		     && !grecaptcha.getResponse() ) {
			addError( formControl );
		}
		return isValid;
	};

	onInputsChanged = function () {

		ctaFormErrorMessage.fadeOut();
	};

	onTextareaChanged = function () {
		var $this = $( this );

		ctaFormCharCountHolder.text( charCount( $this.val() ) );
	};

	onWindowScroll = function () {
		var $window    = $( window )
		  , topMark    = 360
		  , bottomMark = 1180
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