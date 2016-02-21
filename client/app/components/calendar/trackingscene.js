var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	ScrollView,
	Modal,
	Text,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback
} = React;

var PreferenceActions = require( '../../actions' ).PreferenceActions;
var Icon = require( '../icon' ).Icon;

var moment = require( 'moment' );
var _ = require( 'underscore' );


var DEVICE_WIDTH = Dimensions.get( 'window' ).width;
var DEVICE_HEIGHT = Dimensions.get( 'window' ).height;

var categories = [ {
	id: 'flow',
	text: 'Flow',
	optional: false
}, {
	id: 'activity',
	text: 'Activities',
	optional: true
}, {
	id: 'medicine',
	text: 'Medicine',
	optional: true
}, {
	id: 'symptom',
	text: 'Symptoms',
	optional: true
}, {
	id: 'sleep',
	text: 'Sleep Schedule',
	optional: true
}, {
	id: 'mood',
	text: 'Mood',
	optional: true
}, {
	id: 'love',
	text: 'Love Connection',
	optional: true
}, {
	id: 'weight',
	text: 'Weight',
	optional: true,
}, {
	id: 'temperature',
	text: 'Temperature',
	optional: true
}, {
	id: 'travel',
	text: 'Long-distance Travel',
	optional: true
} ];


var TrackingScene = React.createClass( {

	getInitialState: function() {

		return {
			showModal: false
		};
	},

	closeModal: function() {

		this.setState( {
			showModal: false
		} );
	},

	onPressBackButton: function() {

		this.props.showMainNav();
		this.props.navigator.jumpBack();
	},

	onClickNavButton: function( id ) {

	},

	onClickAddButton: function() {

		this.setState( {
			showModal: true
		} );
	},

	onClickCategoryOption: function( id ) {

		var toggledStatus = !this.props.preferences.trackingCategories[ id ];

		var status = {};
		status[ id ] = toggledStatus;

		this.props.dispatch( PreferenceActions.changeTrackingCategories( status ) );
	},

	renderNavButtons: function( id ) {

		return (
			<TouchableWithoutFeedback key={id} onPress={this.onClickNavButton.bind(this, id)}>
				<View style={styles.navButton}>
					<Icon style={styles.navIcon} name={id} />
				</View>
		    </TouchableWithoutFeedback>
		);
	},

	renderCategoryOptions: function( category ) {

		var id = category.id;
		var text = category.text;

		var activated = this.props.preferences.trackingCategories[ id ];
		var buttonStyle = [ styles.optionButton, activated ? styles.activeOptionButton : null ];

		return (
			<TouchableWithoutFeedback key={id} onPress={this.onClickCategoryOption.bind(this, id)}>
				<View style={buttonStyle}>
					<Icon style={styles.optionIcon} name={id} />
					<Text style={styles.optionText} numberOfLines={2}>{text.replace(' ', '\n')}</Text>
				</View>
		    </TouchableWithoutFeedback>
		);
	},

	render: function() {

		var activatedCategories = _.compact( _.map( this.props.preferences.trackingCategories, function( activated, key ) {
			return activated ? key : null;
		} ) );

		var optionalCategories = _.filter( categories, function( category ) {
			return category.optional;
		} );

		return (
			<View style={styles.main}>
				<TouchableOpacity style={styles.backButton} onPress={this.onPressBackButton}>
					<Icon name='prev' />
				</TouchableOpacity>

				<View style={styles.navBar}>
					<ScrollView style={styles.navScrollView}
						pagingEnabled={true}
						horizontal={true}
						showsHorizontalScrollIndicator={false}>

			          	{activatedCategories.map(this.renderNavButtons)}

				        <TouchableOpacity onPress={this.onClickAddButton}>
							<View style={styles.navButton}>
								<Icon style={styles.navIcon} name='plus' />
							</View>
					    </TouchableOpacity>

			        </ScrollView>
				</View>

				<Modal animated={true} visible={this.state.showModal}>
					<View style={styles.modal}>
						<TouchableOpacity style={styles.backButton} onPress={this.closeModal}>
							<Icon name='prev' />
						</TouchableOpacity>

						<View style={styles.optionContainer}>
						{optionalCategories.map(this.renderCategoryOptions)}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		flex: 1,
		backgroundColor: '#FCFCFC'
	},
	navBar: {
		position: 'absolute',
		bottom: 0,
		width: DEVICE_WIDTH,
		height: 60,
		backgroundColor: 'white'
	},
	navScrollView: {
		flex: 1,
		flexDirection: 'row',
		width: DEVICE_WIDTH
	},
	navButton: {
		flex: 1,
		width: DEVICE_WIDTH / 6,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopWidth: 1.5,
		borderTopColor: 'transparent'
	},
	navIcon: {
		color: '#000',
		fontSize: 20
	},
	modal: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	optionContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'center'
	},
	optionButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: DEVICE_WIDTH / 3,
		height: DEVICE_HEIGHT / 6
	},
	activeOptionButton: {
		opacity: 0.4
	},
	optionIcon: {
		color: '#000',
		fontSize: 20
	},
	optionText: {
		marginTop: 5,
		fontSize: 14,
		textAlign: 'center',
		height: 40
	},
	backButton: {
		position: 'absolute',
		top: 30,
		left: 20
	}
} );


module.exports = TrackingScene;