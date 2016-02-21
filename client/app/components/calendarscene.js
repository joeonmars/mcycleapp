var React = require( 'react-native' );

var {
	Navigator,
	View
} = React;

var HomeScene = require( './calendar/homescene' );
var TrackingScene = require( './calendar/trackingscene' );

var _ = require( 'underscore' );


// Create routes
var homeRoute = {
	id: 'home'
};

var trackingRoute = {
	id: 'tracking'
};

var initialRouteStack = [ homeRoute, trackingRoute ];


// Define component
var CalendarScene = React.createClass( {

	configureScene: function( route ) {

		switch ( route.id ) {
			case 'home':
				return Navigator.SceneConfigs.FloatFromLeft;

			case 'tracking':
				return Navigator.SceneConfigs.FloatFromBottom;
		}
	},

	renderScene: function( route, nav ) {

		switch ( route.id ) {
			case 'home':
				return (
					<HomeScene navigator={nav} dispatch={this.props.dispatch}
						trackingRoute={trackingRoute} periods={this.props.periods} hideMainNav={this.props.hideMainNav} />
				);

			case 'tracking':
				return (
					<TrackingScene navigator={nav} dispatch={this.props.dispatch}
						homeRoute={homeRoute} preferences={this.props.preferences} showMainNav={this.props.showMainNav} />
				);
		}
	},

	render: function() {

		return (
			<Navigator initialRoute={homeRoute} initialRouteStack={initialRouteStack}
				configureScene={this.configureScene} renderScene={this.renderScene} />
		);
	}
} );


module.exports = CalendarScene;