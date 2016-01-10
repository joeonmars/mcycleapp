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

		this.refs.scroller.scrollTo( 0, prevIndex * DEVICE_WIDTH );
	},

	scrollToNext: function() {

		var nextIndex = Math.min( this.numCalendars - 1, this.state.calendarIndex + 1 );

		this.refs.scroller.scrollTo( 0, nextIndex * DEVICE_WIDTH );
	},

	onScroll: function( e ) {

		var calendarIndex = Math.round( e.nativeEvent.contentOffset.x / DEVICE_WIDTH );

		this.setState( {
			calendarIndex: calendarIndex
		} );
	},

	renderCalendar: function( date, i ) {

		return (
			<DatePicker key={i} year={date.getFullYear()} month={date.getMonth()} />
		);
	},

	renderWeekHeader: function() {

		var weekdays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

		var cols = weekdays.map( function( weekday, i ) {
			return (
				<Text key={i} style={styles.colHeader}>{weekday}</Text>
			);
		} );

		return (
			<View style={styles.weekHeader}>
				{cols}
			</View>
		);
	},

	render: function() {

		var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
		var calendarDate = this.state.calendarDates[ this.state.calendarIndex ];
		var monthName = monthNames[ calendarDate.getMonth() ];
		var year = calendarDate.getFullYear();

		return (
			<View style={styles.main}>

				<View style={styles.header}>
					<Text style={styles.dateHeading}>{monthName + ' ' + year}</Text>

					<View style={styles.nav}>
						<TouchableOpacity onPress={this.scrollToPrev}>
							<Icon style={styles.navArrow} name='angle-left' />
						</TouchableOpacity>

						<TouchableOpacity onPress={this.scrollToNext}>
							<Icon style={styles.navArrow} name='angle-right' />
						</TouchableOpacity>
					</View>
				</View>

				{this.renderWeekHeader()}

				<ScrollView
					ref='scroller'
					pagingEnabled={true}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.contentContainer}
					style={styles.scrollView}
					scrollEventThrottle={200}
					onScroll={this.onScroll}>

					{this.state.calendarDates.map( this.renderCalendar )}

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
		flex: 1
	},
	header: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 40
	},
	nav: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	navArrow: {
		fontSize: 20
	},
	dateHeading: {
		flex: 1
	},
	weekHeader: {
		width: DEVICE_WIDTH,
		paddingHorizontal: 40,
		height: 30,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	colHeader: {
		flex: 1,
		fontSize: 10,
		textAlign: 'center'
	},
} );


module.exports = CalendarScene;