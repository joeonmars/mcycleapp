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

		switch ( route.id ) {
			case 'main':
				return <MainScene navigator={nav} />;
				break;

			case 'setup':
				return <SetupScene navigator={nav} />;
				break;

			case 'signin':
				return <SignInScene navigator={nav} />;
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


function mapStateToProps( state ) {

	return {
		todos: state
	};
};


module.exports = connect( mapStateToProps )( App );