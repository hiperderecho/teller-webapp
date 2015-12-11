var exports = module.exports = {};

// Questions
exports.getListOfQuestions      = require( './getListOfQuestions' );
exports.getQuestionByQuestionId = require( './getQuestionByQuestionId' );

// Agencies
exports.getListOfAgencies = require( './getListOfAgencies' );

// Answers
exports.getAnswersByQuestionId = require( './getAnswersByQuestionId' );

//Views Related
exports.getIndexViewResources    = require( './getIndexViewResources' );
exports.getQuestionViewResources = require( './getQuestionViewResources' );