var validators = require('./utils/validators');

module.exports = function ( app ) {
	console.log( 'loading ctaForm' );
	var ctaFormAgency         = $('#ctaFormAgency')
	  , ctaForm               = $('#ctaForm')
	  , ctaFormErrorMessage   = $('p.js-ctaFormErrorMessage')
	  , ctaFormSuccessMessage = $('p.js-ctaFormSuccessMessage')
	// fn declarations
	  , onCtaFormSubmit
	  ;

	onCtaFormSubmit = function ( e ) {
		var $this   = $(this)
		  , isValid = []
		  ;
		e.preventDefault();

		isValid.push( !!$('#ctaFormAgency').find('option:selected').val() );
		isValid.push( validators.fullname.test( ctaForm.find('#ctaFormAuthorFullName').val() )
		              && ctaForm.find('#ctaFormAuthorFullName').val().length < 53
		              && ctaForm.find('#ctaFormAuthorFullName').val().length > 4 );
		isValid.push( validators.email.test( ctaForm.find('#ctaFormAuthor').val() ) );
		isValid.push( validators.text.test( ctaForm.find('#ctaFormTitle').val() )
		              && ctaForm.find('#ctaFormTitle').val().length < 53
		              && ctaForm.find('#ctaFormTitle').val().length > 4 );
		isValid.push( validators.text.test( ctaForm.find('#ctaFormContent').val() )
		              && ctaForm.find('#ctaFormContent').val().length < 401
		              && ctaForm.find('#ctaFormContent').val().length > 39 );

		if ( isValid.every( function ( e ) { return e; } ) ) {

			ctaFormSuccessMessage.show();
			$.post( app.apiQuestionsUrl, $this.serialize() )
			.then( function ( result ) {

				setTimeout( function () {

					window.location.href = '/';
				}, 400 );
			} );
		}

		if ( !isValid.every( function ( e ) { return e; } ) ) {
			ctaFormErrorMessage.show();
		}
	};

	ctaForm.find('input,textarea,select').on('keyup change', function () {

		ctaFormErrorMessage.fadeOut();
	} );

	ctaForm
	.on('submit', onCtaFormSubmit );

};