module.exports = function addSuccess( formControl ) {

	formControl.parent().removeClass('has-error').addClass('has-success');
};