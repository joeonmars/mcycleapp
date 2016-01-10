var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity
} = React;

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

var ConfigScene = React.createClass( {

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {

	},

	render: function() {

		return (
			<View style={styles.main}>

				<Text style={styles.text}>Display Config Here</Text>

			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	text: {
		width: DEVICE_WIDTH / 2,
		textAlign: 'center'
	}
} );


module.exports = ConfigScene;