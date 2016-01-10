var React = require( 'react-native' );
//var Provider = require( 'react-redux' ).Provider;

var App = require( './app' );


var Provider = React.createClass( {

	render: function() {

		return (
			<App />
		);
	}
} );


module.exports = Provider;