var React = require( 'react-native' );
//var connect = require( 'react-redux' ).connect;

var {
	StyleSheet,
	Navigator
} = React;

var SignInScene = require( '../components/signinscene' );
var MainScene = require( '../components/mainscene' );


var App = React.createClass( {

	renderScene: function( route, nav ) {

		switch ( route.id ) {
			case 'main':
				return <MainScene navigator={nav} />;
				break;

			default:
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


var styles = StyleSheet.create( {
	container: {
		flex: 1
	}
} );

/*
function mapStateToProps( state ) {

	return {
		todos: state
	};
}
*/

module.exports = App;
//module.exports = connect( mapStateToProps )( App );