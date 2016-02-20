var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	ListView,
	Text,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback
} = React;

var Icon = require( '../icon' ).Icon;

var moment = require( 'moment' );
var _ = require( 'underscore' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;


var TrackingScene = React.createClass( {

	getInitialState: function() {

		return {};
	},

	onPressBackButton: function() {

		this.props.showMainNav();
		this.props.navigator.jumpBack();
	},

	render: function() {

		return (
			<View style={styles.main}>
				<TouchableOpacity onPress={this.onPressBackButton}>
					<Icon style={styles.backArrow} name='prev' />
				</TouchableOpacity>
			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		flex: 1,
		backgroundColor: '#FCFCFC'
	},
} );


module.exports = TrackingScene;