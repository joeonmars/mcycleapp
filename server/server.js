var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var express = require( 'express' );
var session = require( 'express-session' );
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' );
var db = require( './db' );

// reference
// https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/
// http://passportjs.org/docs

// parse params
var argv = require( 'optimist' )
	.default( {
		reseed: 'false',
		fromsheet: 'false',
		mongolab: 'false'
	} )
	.argv;


// configure app
var app = express();

app.use( logger( 'combined' ) );

app.use( cookieParser() );

app.use( bodyParser.urlencoded( {
	extended: false
} ) );

app.use( bodyParser.json() );

app.use( session( {
	secret: 'abigsecret',
	resave: true,
	saveUninitialized: true
} ) );


// set up the routes
app.get( '/', function( req, res ) {
	res.send( 'hello, world!' )
} );

app.post( '/signup', passport.authenticate( 'signup' ), function( req, res ) {
	console.log( req, res );
} );

app.post( '/signin', passport.authenticate( 'signin' ), function( req, res ) {
	console.log( req, res );
} );

app.get( '/logout', function( req, res ) {
	var name = req.user.username;
	console.log( 'LOGGED OUT ' + req.user.username );

	req.logout();
	res.redirect( '/' );
	req.session.notice = 'You have successfully been logged out ' + name;
} );


// define passport strategy
// Use the LocalStrategy within Passport to login users.
passport.use( 'signin', new LocalStrategy( {
		passReqToCallback: true
	},
	function( req, email, password, done ) {
		db.authenticateUser( email, password,
			function( user ) {

				done( null, user );

				console.log( 'LOGGED IN AS: ' + user.email );
			},
			function( errorMessage ) {

				done( null, false, {
					message: errorMessage
				} );

				console.log( 'COULD NOT LOG IN: ' + errorMessage );
			} );
	}
) );

// Use the LocalStrategy within Passport to register users.
passport.use( 'signup', new LocalStrategy( {
		passReqToCallback: true
	},
	function( req, email, password, done ) {
		db.registerUser( email, password,
			function( user ) {

				done( null, user );

				console.log( 'REGISTERED: ' + user.email );
			},
			function( err ) {

				var errorMessage = err.errors.email.message;

				done( null, false, {
					message: errorMessage
				} );

				console.log( 'COULD NOT REGISTER: ' + errorMessage );
			} );
	}
) );


// start listening
var localPort = 5000;
var listeningPort = process.env.PORT || localPort;
var host = process.env.HOST || require( 'my-local-ip' )();
var port = process.env.PORT || listeningPort;

var onServerStart = function() {

	GLOBAL.SERVER_URL = 'http://' + host + ( port ? ':' + port : '' );
	console.log( 'Server started: ' + GLOBAL.SERVER_URL );

	var useLocalDB = ( listeningPort === localPort );
	db.start( useLocalDB );
};

var server = app.listen( listeningPort, onServerStart );