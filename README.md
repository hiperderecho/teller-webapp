# Teller-webapp

Webapp for the Teller project

This web application will render and interact with the [API of the Teller project](//github.com/hiperderecho/teller-api).

## Browserify workflow

Most of the client JavaScript will be compile using Browserify, we will use Watchify and Nodemon for the Browserify workflow.

You will probably need to install them globally: ```npm install watchify nodemon -g```

## Installation

```git clone``` the repo and ```npm install``` the dependencies.

Run the project with ```npm start```.

## Configuration

There is a ```config/index.js``` file where it is necessary to set the following values:
* ```apiUrl```: The URL of the API.
* ```views```: Views related variables.
   * ```index```:
        * ```questionsLimit```: Limit number of questions to be shown in the Index.jade view.
* ```cookieNameSpace```: Cookie name for the author secret validation.
* ```localizedStatus```: Question status localization (translation).
   * ```successful```: For the succesful question status.
   * ```unsuccessful```: For the unsuccesful question status.
   * ```unanswered```: For the unanswered question status.
   * ```open```: For the open question status.
* ```flaggedStatus```: Status used when a question should not be shown.
* ```messages```: List of User Interface messages.
   * ```questionView```: Messages related to the question view.
        * ```authorSecretMismatch```: The author secret did not match.
        * ```questionWasUpdated```: The question status was updated.
        * ```authorSecretSent```: The author secret was sent to its author's email.
   * ```thereWasAnError```: General error message.
   * ```thereWasAnError```: General error with server context.