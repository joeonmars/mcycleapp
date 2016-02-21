var React = require( 'react-native' );

var {
	StyleSheet,
	Navigator,
	View,
	Text,
	Dimensions,
	TouchableWithoutFeedback
} = React;

var connect = require( 'react-redux' ).connect;

var RCTStatusBarManager = require( 'NativeModules' ).StatusBarManager;

var CalendarActions = require( '../actions' ).CalendarActions;

var Icon = require( './icon' ).Icon;
var CalendarScene = require( './calendarscene' );
var SummaryScene = require( './summaryscene' );
var AlertScene = require( './alertscene' );
var ConfigScene = require( './configscene' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

var tabIds = [ 'calendar', 'summary', 'alert', 'config' ];


var MainScene = React.createClass( {

	getInitialState: function() {

		return {
			statusBarHeight: 0,
			showNav: true,
			routeId: tabIds[ 0 ]
		};
	},

	componentDidMount: function() {

		RCTStatusBarManager.getHeight( this.onGetStatusBarHeight );

		this.willFocusHandler = this.refs.mainNav.navigationContext.addListener( 'willfocus', this.onNavWillFocus );
	},

	componentWillUnmount: function() {

		this.willFocusHandler.remove();
	},

	showNav: function() {

		this.setState( {
			showNav: true
		} );
	},

	hideNav: function() {

		this.setState( {
			showNav: false
		} );
	},

	onGetStatusBarHeight: function( result ) {

		this.setState( {
			statusBarHeight: result.height
		} );
	},

	onNavWillFocus: function( e ) {

		this.setState( {
			routeId: e.data.route.id
		} );
	},

	onClickNavButton: function( id ) {

		this.refs.mainNav.replace( {
			id: id
		} );
	},

	renderScene: function( route, nav ) {

		switch ( route.id ) {
			case 'alert':
				return <AlertScene navigator={nav} />;

			case 'summary':
				return <SummaryScene navigator={nav} />;

			case 'config':
				return <ConfigScene navigator={nav} />;

			case 'calendar':
			default:
				return (
					<CalendarScene navigator={nav} periods={this.props.periods}
						showMainNav={this.showNav} hideMainNav={this.hideNav} />
				);
		}
	},

	renderNavigationButton: function( id ) {

		var iconName;

		switch ( id ) {
			case 'calendar':
				iconName = 'notebook';
				break;

			case 'config':
				iconName = 'gear';
				break;

			case 'alert':
				iconName = 'lightbulb';
				break;

			case 'summary':
				iconName = 'analysis';
				break;
		}

		var isActive = ( this.state.routeId === id );
		var buttonStyle = [ styles.navButton, isActive ? styles.currentNav : null ];
		var iconStyle = [ styles.navIcon, isActive ? styles.currentIcon : null ];

		return (
			<TouchableWithoutFeedback key={id} onPress={this.onClickNavButton.bind(this, id)}>
				<View style={buttonStyle}>
					<Icon style={iconStyle} name={iconName} />
				</View>
		    </TouchableWithoutFeedback>
		);
	},

	renderNavigatorBar: function() {

		return this.state.showNav ? (
			<View style={styles.navBar}>
				{tabIds.map( this.renderNavigationButton )}
			</View>
		) : null;
	},

	render: function() {

		var initialRoute = {
			id: tabIds[ 0 ]
		};

		var excludeStatusBar = {
			paddingTop: this.state.statusBarHeight
		};

		return (
			<Navigator ref='mainNav' sceneStyle={[styles.sceneContainer, excludeStatusBar]} initialRoute={initialRoute} renderScene={this.renderScene} navigationBar={this.renderNavigatorBar()} />
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
		height: 60,
		backgroundColor: 'white'
	},
	navButton: {
		flex: 1,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopWidth: 1.5,
		borderTopColor: 'transparent'
	},
	currentNav: {
		borderTopColor: '#979797'
	},
	navIcon: {
		color: '#000',
		fontSize: 20
	},
	currentIcon: {
		color: '#979797'
	},
	sceneContainer: {
		backgroundColor: '#fff'
	}
} );


function mapStateToProps( state ) {

	return {
		periods: state.periods
	};
};


module.exports = connect( mapStateToProps )( MainScene );