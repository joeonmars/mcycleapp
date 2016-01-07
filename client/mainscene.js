var React = require( 'react-native' );

var {
	StyleSheet,
	Navigator,
	View,
	Text,
	Dimensions,
	TouchableOpacity
} = React;

var CalendarScene = require( './calendarscene' );
var SummaryScene = require( './summaryscene' );
var AlertScene = require( './alertscene' );
var ConfigScene = require( './configscene' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

var tabIds = [ 'calendar', 'summary', 'alert', 'config' ];


var MainScene = React.createClass( {

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {

	},

	onClickNavButton: function( id ) {

		this.refs.mainNav.replace( {
			id: id,
			sceneConfig: Navigator.SceneConfigs.FloatFromRight
		} );
	},

	renderScene: function( route, nav ) {

		switch ( route.id ) {
			case 'alert':
				return <AlertScene navigator={nav} />;
				break;

			case 'summary':
				return <SummaryScene navigator={nav} />;
				break;

			case 'config':
				return <ConfigScene navigator={nav} />;
				break;

			case 'calendar':
			default:
				return <CalendarScene navigator={nav} />;
				break;
		}
	},

	renderNavigationButton: function( id ) {

		return (
			<TouchableOpacity key={id} style={styles.navButton} onPress={this.onClickNavButton.bind(this, id)}>
				<Text style={styles.navButtonText}>{id}</Text>
		    </TouchableOpacity>
		);
	},

	renderNavigatorBar: function() {

		return (
			<View style={styles.navBar}>
				{tabIds.map(this.renderNavigationButton)}
			</View>
		);
	},

	render: function() {

		var initialRoute = {
			id: 'calendar'
		};

		return (
			<Navigator ref='mainNav' initialRoute={initialRoute} renderScene={this.renderScene} navigationBar={this.renderNavigatorBar()} />
		);
	}
} );


var styles = StyleSheet.create( {
	navBar: {
		position: 'absolute',
		bottom: 0,
		flex: 1,
		flexDirection: 'row',
		width: DEVICE_WIDTH,
		height: 50,
		backgroundColor: 'blue'
	},
	navButton: {
		flex: 1,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	navButtonText: {
		textAlign: 'center',
		color: '#fff'
	}
} );


module.exports = MainScene;