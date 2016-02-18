var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	ListView,
	Text,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback,
	InteractionManager
} = React;

var DatePicker = require( './datepicker' );
var Icon = require( './icon' ).Icon;
var moment = require( 'moment' );
var _ = require( 'underscore' );

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
			calendarIndex: 0,
			shouldRender: false
		};
	},

	componentWillMount: function() {

		this.numPastMonths = 12;
		this.numFutureMonths = 12;
		this.numCalendars = this.numPastMonths + this.numFutureMonths;

		this.initialOffsetX = this.numPastMonths * DEVICE_WIDTH;

		var startDate = new Date();
		startDate.setDate( 1 );
		startDate.setMonth( startDate.getMonth() - this.numPastMonths );

		var calendarDates = [];

		for ( var i = 0; i < this.numCalendars; i++ ) {

			var date = moment( startDate ).add( i, 'month' );
			calendarDates.push( date );
		}

		var ds = new ListView.DataSource( {
			rowHasChanged: function( row1, row2 ) {
				return row1 !== row2;
			}
		} );

		var dataSource = ds.cloneWithRows( calendarDates );

		this.setState( {
			calendarDates: calendarDates,
			calendarIndex: this.numPastMonths,
			dataSource: dataSource
		} );
	},

	componentDidMount: function() {

		InteractionManager.runAfterInteractions( this.onRunAfterInteractions );
	},

	scrollToPrev: function() {

		var prevIndex = Math.max( 0, this.state.calendarIndex - 1 );

		this.refs.listView.scrollResponderScrollTo( {
			x: prevIndex * DEVICE_WIDTH
		} );
	},

	scrollToNext: function() {

		var nextIndex = Math.min( this.numCalendars - 1, this.state.calendarIndex + 1 );

		this.refs.listView.scrollResponderScrollTo( {
			x: nextIndex * DEVICE_WIDTH
		} );
	},

	jumpToPresent: function() {

		var offsetX = this.numPastMonths * DEVICE_WIDTH;

		this.refs.listView.scrollResponderScrollTo( {
			x: offsetX,
			animated: false
		} );
	},

	onScroll: function( e ) {

		var calendarIndex = Math.round( e.nativeEvent.contentOffset.x / DEVICE_WIDTH );

		this.setState( {
			calendarIndex: calendarIndex
		} );
	},

	onRunAfterInteractions: function() {

		this.setState( {
			shouldRender: true
		} );
	},

	renderCalendar: function( date, i ) {

		var periods = this.props.periods;
		var monthStart = date.clone().startOf( 'month' );
		var monthEnd = date.clone().endOf( 'month' );

		var currentPeriods = _.filter( periods.current, function( period ) {
			var timeOverlapped = ( period.start <= monthEnd && period.end >= monthStart );
			return timeOverlapped;
		} );

		var futurePeriods = _.filter( periods.future, function( period ) {
			var timeOverlapped = ( period.start <= monthEnd && period.end >= monthStart );
			return timeOverlapped;
		} );

		return (
			<DatePicker key={i}
				year={date.year()} month={date.month()}
				currentPeriods={currentPeriods} futurePeriods={futurePeriods} />
		);
	},

	renderWeekHeader: function() {

		var weekdays = moment.weekdaysShort();

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

		if ( this.state.shouldRender ) {

			var monthNames = moment.months();
			var calendarDate = this.state.calendarDates[ this.state.calendarIndex ];
			var monthName = monthNames[ calendarDate.month() ];
			var year = calendarDate.year();

			var hasReachedMinTime = ( this.state.calendarIndex === 0 );
			var hasReachedMaxTime = ( this.state.calendarIndex === this.numCalendars - 1 );
			var isNotPresentTime = ( this.state.calendarIndex !== this.numPastMonths );

			return (
				<View style={styles.main}>

					<View style={styles.header}>
						<Text style={styles.dateHeading}>{monthName + ' ' + year}</Text>

						<View style={styles.nav}>
							<TouchableWithoutFeedback onPress={this.scrollToPrev}>
								<Icon style={[styles.navArrow, hasReachedMinTime ? styles.inactiveNavButton : null]} name='angle-left' />
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback onPress={this.jumpToPresent}>
								<Icon style={[styles.navDot, isNotPresentTime ? null : styles.inactiveNavButton]} name='dot-circled' />
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback onPress={this.scrollToNext}>
								<Icon style={[styles.navArrow, hasReachedMaxTime ? styles.inactiveNavButton : null]} name='angle-right' />
							</TouchableWithoutFeedback>
						</View>
					</View>

					{this.renderWeekHeader()}

					<ListView
						ref='listView'
						dataSource={this.state.dataSource}
						renderRow={this.renderCalendar}
						initialListSize={1}
						pagingEnabled={true}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						contentOffset={{x: this.initialOffsetX}}
						contentContainerStyle={styles.contentContainer}
						style={styles.listView}
						scrollEventThrottle={50}
						onScroll={this.onScroll} />

				</View>
			);
		}

		return (
			<View style={styles.main}>
			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		backgroundColor: '#fff'
	},
	listView: {
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
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	navArrow: {
		color: 'black',
		fontSize: 20
	},
	navDot: {
		color: 'black',
		fontSize: 10,
		marginHorizontal: 10
	},
	inactiveNavButton: {
		color: 'lightgray'
	},
	dateHeading: {
		flex: 1
	},
	weekHeader: {
		width: 315,
		height: 30,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center'
	},
	colHeader: {
		flex: 1,
		fontSize: 10,
		textAlign: 'center'
	},
} );


module.exports = CalendarScene;