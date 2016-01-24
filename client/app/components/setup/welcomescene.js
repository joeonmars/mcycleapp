var React = require( 'react-native' );

var {
	Text,
	StyleSheet,
	Dimensions,
	View,
} = React;

var RadioButtons = require( '../common/radiobuttons' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

var OPTIONS = {
	'new': 'I\'m new.',
	'existing': 'I have an account.'
};


var WelcomeScene = React.createClass( {

	getInitialState: function() {

		return {};
	},

	componentDidMount: function() {

	},

	onOptionSelected: function( key ) {

		console.log( key );
	},

	render: function() {

		return (
			<View style={styles.main}>

				<View>
					<Text style={styles.headingText}>Welcome to</Text>
					<Text style={styles.headingText}>PeriodPal</Text>
				</View>

				<RadioButtons options={OPTIONS} onSelected={this.onOptionSelected} />

			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingHorizontal: 40,
		backgroundColor: 'white'
	},
	headingText: {
		fontSize: 50
	}
} );


module.exports = WelcomeScene;