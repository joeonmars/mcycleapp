var React = require( 'react-native' );
var Provider = require( 'react-redux' ).Provider;

var store = require( '../stores/todos' );
var App = require( './app' );


module.exports = React.createClass( {

	render: function() {

		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
} );