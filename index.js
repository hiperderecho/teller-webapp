var express     = require('express');
var compression = require('compression');
var minify      = require('express-minify');
var moment      = require('moment');
var tz          = require('moment-timezone');
require('console-stamp')(console);

var app = express();

moment.locale('es');
moment.tz.setDefault('America/Lima');

app.set( 'view engine', 'jade' );
app.set( 'views', __dirname + '/views/' );

app.use( minify( { js_match: /javascript/ } ) );
app.use( express.static( __dirname + '/public' ) );
app.use( compression() );

require( './routes' )( app );

app.use( function ( request, response, next ) {

	response.status( 404 ).render( '404', {} );
} );

var listeningPort = process.env.PORT || 5002;
app.listen( listeningPort, function () {

	console.log( 'listening on ' + listeningPort );
} );