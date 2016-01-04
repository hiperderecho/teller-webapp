var cookie     = require('cookie');
var moment     = require('moment');

var validators          = require('./utils/validators');
var resetNavbarSections = require('./utils/resetNavbarSections');
var charCount           = require('./utils/charCount');
var config              = require('../config');

module.exports = function ( app ) {
	var questionId               = $('div.js-content').data('question-id')
	  , holder                   = $('div.js-content')
	  , changeStatusForm         = $('#changeStatusForm')
	  , answerQuestionForm       = $('#answerQuestionForm')
	  , authorSecretSendAgainBtn = $('a.js-author-secret-form-send-again')
	  , reloadPageOnModalHide    = false
	  , authorSecretAlreadyAsked = cookie.parse( window.document.cookie )[ config.webapp.cookieNameSpace ]
	// fn declarations
	  , onChangeStatusFormSubmit
	  , onAnswerQuestionFormSubmit
	  , onBSModalHidden
	  , onAuthorSecretSendAgainBtnClick
	  ;

	onAnswerQuestionFormSubmit = function ( e ) {
		var data        = {}
		  , ajaxOptions = {}
		  , isValid     = []
		  , answerQuestionFormContentText = $('#answerQuestionFormContent').val()
		  ;

		e.preventDefault();
		data.authorSecret      = $('#answerQuestionFormSecret').val();
		data.content           = answerQuestionFormContentText;
		data.questionId        = questionId;
		data.publicAuthorEmail = holder.data('public-author-email');
		data.title             = holder.data('question-title');
		data.agencyId          = holder.data('question-agency-id');

		ajaxOptions.method = 'POST';
		ajaxOptions.url    = app.apiAnswersUrl + 'fromAuthor/';
		ajaxOptions.data   = data;

		isValid.push( !!data.authorSecret );
		isValid.push( validators.text.test( answerQuestionFormContentText )
		              && answerQuestionFormContentText.length < 401
		              && answerQuestionFormContentText.length > 39 );

		if ( isValid.every( function ( e ) { return e; } ) ) {
			$.ajax( ajaxOptions )
			.then( function ( result ) {

				if ( !!result.error ) {
					answerQuestionForm.empty().append( config.webapp.messages.questionView.authorSecretMismatch );
					return;
				}

				answerQuestionForm.empty().append( config.webapp.messages.questionView.questionWasUpdated );
				reloadPageOnModalHide = true;
			}, function ( error ) {

				answerQuestionForm.empty().append( config.webapp.messages.thereWasAnErrorPre + error.responseText );
			} );
		}
	};

	onChangeStatusFormSubmit = function ( e ) {
		var data        = {}
		  , ajaxOptions = {}
		  ;

		e.preventDefault();
		data.authorSecret = $('#changeStatusFormSecret').val();
		data.status       = $('input[type="radio"]:checked').val();

		ajaxOptions.method = 'PUT';
		ajaxOptions.url    = app.apiQuestionsUrl + 'status/' + holder.data('question-id');
		ajaxOptions.data   = data;

		if ( data.authorSecret && data.status ) {
			console.log( 'Valid form', ajaxOptions );

			$.ajax( ajaxOptions )
			.then( function ( result ) {

				if ( !!result.error ) {
					changeStatusForm.empty().append( config.webapp.messages.questionView.authorSecretMismatch );
					return;
				}

				changeStatusForm.empty().append( config.webapp.messages.questionView.questionWasUpdated );
				reloadPageOnModalHide = true;
			}, function ( error ) {

				changeStatusForm.empty().append( config.webapp.messages.thereWasAnErrorPre + error.responseText );
			} );
		}
	};

	onAuthorSecretSendAgainBtnClick = function () {
		var $this = $(this);

		$this.fadeOut();
		$.get( app.apiBaseUrl + 'utils/sendAuthorSecretEmail/' + questionId )
		.then( function ( result ) {

			if ( result.success ) {
				$this.replaceWith( config.webapp.messages.questionView.authorSecretSent ).fadeIn();
				window.document.cookie = cookie.serialize( config.webapp.cookieNameSpace, 'true', { expires: moment().add('1', 'days').toDate() } );
			}
		}, function ( error ) {

			$this.replaceWith( config.webapp.messages.thereWasAnError + error ).fadeIn();
		} );
	};

	onBSModalHidden = function () {

		if ( reloadPageOnModalHide ) {
			window.location.reload();
		}
	};

	changeStatusForm.on('submit', onChangeStatusFormSubmit);
	answerQuestionForm.on('submit', onAnswerQuestionFormSubmit);
	authorSecretSendAgainBtn.one('click', onAuthorSecretSendAgainBtnClick);

	$('#answerQuestionFormContent').on('change keyup', function () {
		$('span.js-char-count').text( charCount( $(this).val() ) );
	} );

	$('#change-status-form-holder').on('hidden.bs.modal', onBSModalHidden);
	$('#answer-question-form-holder').on('hidden.bs.modal', onBSModalHidden);

	if ( authorSecretAlreadyAsked ) {
		authorSecretSendAgainBtn
		.replaceWith( config.webapp.messages.questionView.authorSecretSent );
	}

	resetNavbarSections();

};