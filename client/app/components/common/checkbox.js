var React = require( 'react-native' );

var {
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} = React;


var Checkbox = React.createClass( {

	getInitialState: function() {

		return {
			checked: this.props.checked || false
		};
	},

	componentDidUpdate: function( prevProps, prevState ) {

		if ( prevState.checked !== this.state.checked ) {
			this.props.onChange( this.state.checked );
		}
	},

	onPress: function() {

		this.setState( {
			checked: !this.state.checked
		} );
	},

	render: function() {

		return (
			<TouchableWithoutFeedback onPress={this.onPress}>

				<View style={styles.container}>
					<View style={[styles.box, this.state.checked ? styles.boxChecked : null]}></View>
					<Text style={styles.label}>{this.props.label}</Text>
				</View>

			</TouchableWithoutFeedback>
		);
	}
} );


var styles = StyleSheet.create( {
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	box: {
		marginRight: 5,
		width: 20,
		height: 20,
		borderWidth: 1,
		borderRadius: 10
	},
	boxChecked: {
		backgroundColor: '#000'
	},
	label: {
		fontSize: 20
	}
} );


module.exports = Checkbox;