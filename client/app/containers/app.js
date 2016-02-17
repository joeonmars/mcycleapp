var React = require( 'react-native' );
var connect = require( 'react-redux' ).connect;

var {
	Navigator
} = React;

var SignInScene = require( '../components/signinscene' );
var SetupScene = require( '../components/setup' );
var MainScene = require( '../components/mainscene' );


var App = React.createClass( {

	renderScene: function( route, nav ) {

		var dispatch = this.props.dispatch;

		switch ( route.id ) {
			case 'main':
				return <MainScene navigator={nav} dispatch={dispatch} />;
				break;

			case 'setup':
				return <SetupScene navigator={nav} dispatch={dispatch} />;
				break;

			case 'signin':
				return <SignInScene navigator={nav} dispatch={dispatch} />;
				break;
		}
	},

	render: function() {

		var initialRoute = {
			id: 'signin'
		};

		return (
			<Navigator initialRoute={initialRoute} renderScene={this.renderScene} />
		);
	}
} );


// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps( state ) {

	return {
		periods: state.periods
	};
};

// Wrap the component to inject dispatch and state into it
module.exports = connect( mapStateToProps )( App );