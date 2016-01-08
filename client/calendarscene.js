var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Dimensions,
	TouchableOpacity
} = React;

var DatePicker = require( './datepicker' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;


var CalendarScene = React.createClass( {

	getDefaultProps: function() {

		return {
			minCalendar: null,
			maxCalendar: null
		};
	},

	getInitialState: function() {

		return {
			calendarDates: null
		};
	},

	componentWillMount: function() {

		var startDate = new Date();
		startDate.setDate( 1 );
		startDate.setMonth( startDate.getMonth() - 12 );

		var calendarDates = [];

		for ( var i = 0; i < 24; i++ ) {

			var date = new Date( startDate );
			date.setMonth( date.getMonth() + i );

			calendarDates.push( date );
		}

		this.setState( {
			calendarDates: calendarDates
		} );
	},

	componentDidMount: function() {

	},

	renderCalendar: function( date, i ) {

		return (
			<DatePicker key={i} year={date.getFullYear()} month={date.getMonth()} />
		);
	},

	render: function() {

		return (
			<View style={styles.main}>

				<ScrollView
					pagingEnabled={true}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.contentContainer}
					style={styles.scrollView}>

					{this.state.calendarDates.map(this.renderCalendar)}

				</ScrollView>

			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		backgroundColor: '#fff'
	},
	scrollView: {
		width: DEVICE_WIDTH,
		height: 300
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center'
	}
} );


module.exports = CalendarScene;