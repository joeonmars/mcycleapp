var React = require( 'react-native' );
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var Dimensions = React.Dimensions;
var Animated = React.Animated;

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;


var App = React.createClass( {

	getInitialState: function() {
		return {
			bounceValue: new Animated.Value( 1 ),
			xValue: new Animated.Value( 0 )
		};
	},

	componentDidMount: function() {

		this.state.bounceValue.setValue( 1.2 );

		Animated.spring(
			this.state.bounceValue, {
				toValue: 1,
				friction: 1,
			}
		).start();


		this.state.xValue.setValue( 200 );

		Animated.spring(
			this.state.xValue, {
				toValue: 0,
				friction: 1,
			}
		).start();
	},

	render: function() {

		return (
			<View style={styles.main}>
				<Animated.View style={[styles.view, {transform: [{scale: this.state.bounceValue}, {translateX: this.state.xValue}]}]}>
					<Text>Hello World!</Text>
				</Animated.View>
			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	view: {
		width: DEVICE_WIDTH / 2,
		height: DEVICE_WIDTH / 2,
		backgroundColor: 'red'
	}
} );


module.exports = App;