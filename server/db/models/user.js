var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema( {
	email: String,
	password: String,
	via: String,
	timeRegistered: {
		type: Number,
		default: Date.now
	}
} );


schema.path( 'email' ).validate( function( value, res ) {
	model.findOne( {
		email: value
	}, 'email', function( err, user ) {
		if ( err ) return res( err );
		if ( user ) return res( false );
		res( true );
	} );
}, 'email already registered' );


var model = mongoose.model( 'User', schema, 'users' );


module.exports = model;