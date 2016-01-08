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
var Icon = require( './icon' ).Icon;

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
			calendarDates: null,
			calendarIndex: 0
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

		this.numCalendars = calendarDates.length;
	},

	componentDidMount: function() {

	},

	scrollToPrev: function() {

		var prevIndex = Math.max( 0, this.state.calendarIndex - 1 );

		this.setState( {
			calendarIndex: prevIndex
		} );

		this.refs.scroller.scrollTo( 0, prevIndex * DEVICE_WIDTH );
	},

	scrollToNext: function() {

		var nextIndex = Math.min( this.numCalendars - 1, this.state.calendarIndex + 1 );

		this.setState( {
			calendarIndex: nextIndex
		} );

		this.refs.scroller.scrollTo( 0, nextIndex * DEVICE_WIDTH );
	},

	renderCalendar: function( date, i ) {

		return (
			<DatePicker key={i} year={date.getFullYear()} month={date.getMonth()} />
		);
	},

	render: function() {

		return (
			<View style={styles.main}>

				<View style={styles.nav}>
					<TouchableOpacity onPress={this.scrollToPrev}>
						<Icon style={styles.navArrow} name='angle-left' />
					</TouchableOpacity>

					<TouchableOpacity onPress={this.scrollToNext}>
						<Icon style={styles.navArrow} name='angle-right' />
					</TouchableOpacity>
				</View>

				<ScrollView
					ref='scroller'
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
	},
	nav: {
		flex: 1,
		flexDirection: 'row'
	},
	navArrow: {
		fontSize: 20,
		marginHorizontal: 10
	}
} );


module.exports = CalendarScene;