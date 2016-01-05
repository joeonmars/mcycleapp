var _ = require( 'underscore' );
var bcrypt = require( 'bcryptjs' );
var seeder = require( 'mongoose-seeder' );

var mongoose = require( 'mongoose-q' )( require( 'mongoose' ), {
	spread: true
} );

var User = require( './models/user' );


function start( useLocalDB ) {

	var uri = useLocalDB ?
		'mongodb://localhost:27017/periodpal' :
		'mongodb://admin:admin@ds049084.mongolab.com:49084/periodpal';

	// Connect to db
	var options = {};

	var callback = function( err ) {

		if ( err ) {

			console.log( 'Error connecting to database.', err );

		} else {

			onDBConnected( uri );
		}
	};

	mongoose.connect( uri, options, callback );
};


function onDBConnected( uri ) {

	console.log( 'DB connected: ' + uri );
};


function authenticateUser( email, password, via, onSuccessCb, onFailureCb ) {

	var conditions = {
		email: email
	};

	var _onSuccess = function( doc ) {

		if ( !doc ) {

			console.log( 'USER NOT REGISTERED' );
			onFailureCb( 'user is not registered' );

		} else if ( via !== 'local' ) {

			console.log( 'NO PASSWORD REQUIRED FOR ' + via );
			onSuccessCb( doc );

		} else if ( bcrypt.compareSync( password, doc.password ) ) {

			console.log( 'PASSWORDS MATCHED' );
			onSuccessCb( doc );

		} else {

			console.log( 'PASSWORDS NOT MATCH' );
			onFailureCb( 'incorrect password' );
		}
	};

	var _onFailure = function() {

		onFailureCb( 'Encountered an error while finding user %s in DB', email );
	};

	User.findOne( conditions, 'email password' ).then( _onSuccess, _onFailure );
};


function registerUser( email, password, via, onSuccessCb, onFailureCb ) {

	var doc = {
		email: email,
		via: via
	};

	if ( via === 'local' ) {

		_.extend( doc, {
			password: bcrypt.hashSync( password, 8 )
		} );
	}

	User.create( doc ).then( onSuccessCb, onFailureCb );
};



exports.start = start;
exports.authenticateUser = authenticateUser;
exports.registerUser = registerUser;