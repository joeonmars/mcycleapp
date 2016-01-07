var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema( {
	username: String,
	password: {
		type: String,
		default: ''
	},
	email: String,
	via: String,
	timeRegistered: {
		type: Number,
		default: Date.now
	}
} );


schema.path( 'username' ).validate( function( value, res ) {
	model.findOne( {
		username: value
	}, 'username', function( err, user ) {
		if ( err ) return res( err );
		if ( user ) return res( false );
		res( true );
	} );
}, 'username already registered' );


var model = mongoose.model( 'User', schema, 'users' );


module.exports = model;