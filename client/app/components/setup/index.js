var React = require( 'react-native' );

var {
	StyleSheet,
	Navigator
} = React;

var WelcomeScene = require( './welcomescene' );


var Setup = React.createClass( {

	renderScene: function( route, nav ) {

		switch ( route.id ) {
			case 'welcome':
				return <WelcomeScene navigator={nav} />;
				break;

			default:
				//return <SignInScene navigator={nav} />;
				break;
		}
	},

	render: function() {

		var initialRoute = {
			id: 'welcome'
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


module.exports = Setup;