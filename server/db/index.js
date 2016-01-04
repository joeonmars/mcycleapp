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


function authenticateUser( email, password, onSuccess, onFailure ) {

	var conditions = {
		email: email
	};

	User.findOne( conditions, 'email password' )
		.then( function( doc ) {

			if ( bcrypt.compareSync( password, doc.password ) ) {

				console.log( 'PASSWORDS MATCHED' );
				onSuccess( doc );

			} else {

				console.log( 'PASSWORDS NOT MATCH' );
				onFailure( 'incorrect password' );
			}

		} )
		.fail( function() {

			onFailure( 'email not found' );
		} );
};


function registerUser( email, password, onSuccess, onFailure ) {

	var doc = {
		email: email,
		password: bcrypt.hashSync( password, 8 )
	};

	User.create( doc ).then( onSuccess ).fail( onFailure );
};



exports.start = start;
exports.authenticateUser = authenticateUser;
exports.registerUser = registerUser;