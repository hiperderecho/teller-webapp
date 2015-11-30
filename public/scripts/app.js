var app = function () {
	var ctaFormAgency         = $('#ctaFormAgency')
	  , ctaForm               = $('#ctaForm')
	  , ctaFormErrorMessage   = $('p.js-ctaFormErrorMessage')
	  , ctaFormSuccessMessage = $('p.js-ctaFormSuccessMessage')
	  , apiBaseUrl            = $('div.js-content').data('api-url')
	  , apiQuestionsUrl       = apiBaseUrl + 'api/questions'
	  , apiAgenciesUrl        = apiBaseUrl + 'api/agencies'
	  , validators            = {}
	  , sendQuestionShorcut   = window.location.hash === '#/envia-una-pregunta'
	// fn declarations
	  , populateAgencies
	  , onCtaFormSubmit
	  ;

	validators.text        = /[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/;
	validators.fullname    = /^[a-záéíóúÁÉÍÓÚñÑA-Z]([-']?[a-záéíóúÁÉÍÓÚñÑA-Z]+)*( [a-záéíóúÁÉÍÓÚñÑA-Z]([-']?[a-záéíóúÁÉÍÓÚñÑA-Z]+)*)+$/;
	validators.email       = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	validators.phonenumber = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{2,3}$/;

	populateAgencies = function ( agencies ) {

		agencies.forEach( function ( agency ) {
			var option = $('<option>');
			option.prop('value', agency.id ).text( agency.name ).appendTo( ctaFormAgency );
		} );
	};

	onCtaFormSubmit = function ( e ) {
		var $this   = $(this)
		  , isValid = []
		  ;
		e.preventDefault();

		isValid.push( !!$('#ctaFormAgency').find('option:selected').val() );
		isValid.push( validators.email.test( ctaForm.find('#ctaFormAuthor').val() ) );
		isValid.push( validators.text.test( ctaForm.find('#ctaFormTitle').val() )
		              && ctaForm.find('#ctaFormTitle').val().length < 53
		              && ctaForm.find('#ctaFormTitle').val().length > 4 );
		isValid.push( validators.text.test( ctaForm.find('#ctaFormContent').val() )
		              && ctaForm.find('#ctaFormContent').val().length < 401
		              && ctaForm.find('#ctaFormContent').val().length > 39 );

		if ( isValid.every( function ( e ) { return e; } ) ) {

			ctaFormSuccessMessage.show();
			$.post( apiQuestionsUrl, $this.serialize() )
			.then( function ( result ) {

				setTimeout( function () {
					window.location.reload();
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

	$.get( apiAgenciesUrl )
	.then( populateAgencies );

	ctaForm
	.on('submit', onCtaFormSubmit );

	if ( sendQuestionShorcut ) {

		setTimeout( function () {
			$('#cta-form-holder').modal({keyboard: false});
		}, 400 );
	}
};

$( app );