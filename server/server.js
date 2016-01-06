var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var express = require( 'express' );
var session = require( 'express-session' );
var cors = require( 'cors' );
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

//app.use( logger( 'combined' ) );

app.use( cookieParser() );
app.use( bodyParser.json() );

app.use( cors() );

app.use( session( {
	secret: 'abigsecret',
	resave: true,
	saveUninitialized: true
} ) );

app.use( passport.initialize() );
app.use( passport.session() );


// Passport session setup.
passport.serializeUser( function( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function( user, done ) {
	done( null, user );
} );

var ensureAuthenticated = function( req, res, next ) {

	if ( req.isAuthenticated() ) {

		return next();

	} else {

		return res.status( 401 ).send( 'unautorized' );
	}
};


// define passport strategy
// Use the LocalStrategy within Passport to login users.
passport.use( 'signin-local', new LocalStrategy( {
		usernameField: 'email',
		passwordField: 'password'
	},
	function( email, password, done ) {

		db.authenticateUser( email, password, 'local',
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
passport.use( 'signup-local', new LocalStrategy( {
		usernameField: 'email',
		passwordField: 'password'
	},
	function( email, password, done ) {

		db.registerUser( email, password, 'local',
			function( user ) {

				console.log( 'REGISTERED: ' + user.email );

				done( null, user );
			},
			function( err ) {

				var errorMessage = err.errors.email.message;

				console.log( 'COULD NOT REGISTER: ' + errorMessage );

				done( null, false, {
					message: errorMessage
				} );
			} );
	}
) );


// set up the routes
app.get( '/', function( req, res ) {
	res.send( 'hello, world!' )
} );

app.post( '/signup-local', function( req, res, next ) {

	passport.authenticate( 'signup-local', function( err, user, info ) {

		if ( err ) {

			return next( err );
		}

		if ( !user ) {

			return res.status( 401 ).send( info.message );

		} else {

			req.login( user, function( err ) {

				if ( err ) {

					return next( err );

				} else {

					return res.send( user );
				}
			} );

			return res.send( user );
		}

	} )( req, res, next );
} );

app.post( '/signin-local', function( req, res, next ) {

	passport.authenticate( 'signin-local', function( err, user, info ) {

		if ( err ) {

			return next( err );
		}

		if ( !user ) {

			return res.status( 401 ).send( info.message );

		} else {

			req.login( user, function( err ) {

				if ( err ) {

					return next( err );

				} else {

					return res.send( user );
				}
			} );

			return res.send( user );
		}

	} )( req, res, next );
} );

app.get( '/signout', ensureAuthenticated, function( req, res ) {

	console.log( 'LOGGED OUT ' + req.user.email );

	req.logout();
	res.status( 401 ).send( 'logged out' );
} );


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