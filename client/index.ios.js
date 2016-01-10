/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require( 'react-native' );


var {
	AppRegistry
} = React;


var Provider = require( './app/containers/provider' );


AppRegistry.registerComponent( 'mcycle', () => Provider );