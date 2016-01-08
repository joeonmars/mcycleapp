/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require( 'react-native' );

var {
	AppRegistry,
	StyleSheet,
	Navigator,
	View,
} = React;

var SignInScene = require( './signinscene' );
var MainScene = require( './mainscene' );

var mcycle = React.createClass( {

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

AppRegistry.registerComponent( 'mcycle', () => mcycle );