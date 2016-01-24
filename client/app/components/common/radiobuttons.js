var React = require( 'react-native' );
var _ = require( 'underscore' );

var RNRadioButtons = require( 'react-native-radio-buttons' ).RadioButtons;

var {
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} = React;


var RadioButtons = React.createClass( {

	getDefaultProps: function() {

		return {
			options: {},
			initialKey: '',
			onSelected: null
		};
	},

	onSelection: function( option ) {

		var key = _.findKey( this.props.options, function( value ) {
			return value === option;
		} );

		if ( this.props.onSelected ) {
			this.props.onSelected( key );
		}
	},

	renderOption: function( option, selected, onSelect, index ) {

		return (
			<TouchableWithoutFeedback key={index} onPress={onSelect}>
				<View style={styles.option}>
					<View style={[styles.box, selected ? styles.boxChecked : null]}></View>
					<Text style={styles.label}>{option}</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	},

	renderContainer: function( optionNodes ) {

		return (
			<View style={styles.container}>{optionNodes}</View>
		);
	},

	render: function() {

		var values = _.values( this.props.options );

		return (
			<RNRadioButtons
				options={ values }
		        onSelection={ this.onSelection }
		        selectedOption={ this.props.options[this.props.initialKey] }
		        renderOption={ this.renderOption }
		        renderContainer={ this.renderContainer }
        	/>
		);
	}
} );


var styles = StyleSheet.create( {
	container: {
		flexDirection: 'column'
	},
	option: {
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


module.exports = RadioButtons;