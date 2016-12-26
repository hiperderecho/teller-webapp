module.exports = function addError( formControl ) {

	formControl.parent().removeClass('has-success').addClass('has-error');
};