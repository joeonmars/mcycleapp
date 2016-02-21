var React = require( 'react-native' );

var {
	InteractionManager,
	StyleSheet,
	View,
	ListView,
	Text,
	Dimensions,
	TouchableOpacity,
	TouchableWithoutFeedback
} = React;

var DatePicker = require( '../datepicker' );
var Icon = require( '../icon' ).Icon;

var moment = require( 'moment' );
var _ = require( 'underscore' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;


var HomeScene = React.createClass( {

	getInitialState: function() {

		return {
			calendarIndex: 0,
			shouldRender: false,
			selectedDate: null
		};
	},

	componentDidMount: function() {

		InteractionManager.runAfterInteractions( this.onRunAfterInteractions );
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

		this.dataSource = ds.cloneWithRows( calendarDates );
		this.calendarDates = calendarDates;

		this.setState( {
			calendarIndex: this.numPastMonths,
			selectedDate: this.props.periods.today.start
		} );
	},

	onRunAfterInteractions: function() {

		this.setState( {
			shouldRender: true
		} );
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
		var hasChanged = ( this.state.calendarIndex != calendarIndex );

		if ( hasChanged ) {
			this.setState( {
				calendarIndex: calendarIndex
			} );
		}
	},

	onPressTrackButton: function( e ) {

		this.props.hideMainNav();
		this.props.navigator.jumpTo( this.props.trackingRoute );
	},

	onDateSelected: function( date ) {

		this.setState( {
			selectedDate: date
		} );
	},

	renderCalendar: function( date, sectionID, rowID ) {

		var periods = this.props.periods;
		var monthStart = date.clone().startOf( 'month' );
		var monthEnd = date.clone().endOf( 'month' );

		var todayStart = periods.today.start;

		var currentPeriods = _.filter( periods.current, function( period ) {
			var timeOverlapped = ( period.start <= monthEnd && period.end >= monthStart );
			return timeOverlapped;
		} );

		var futurePeriods = _.filter( periods.future, function( period ) {
			var timeOverlapped = ( period.start <= monthEnd && period.end >= monthStart );
			return timeOverlapped;
		} );

		return (
			<DatePicker key={rowID}
				year={date.year()} month={date.month()} today={todayStart}
				currentPeriods={currentPeriods} futurePeriods={futurePeriods}
				selectedDate={this.state.selectedDate} onDateSelected={this.onDateSelected} />
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
			var calendarDate = this.calendarDates[ this.state.calendarIndex ];
			var monthName = monthNames[ calendarDate.month() ];
			var year = calendarDate.year();

			var hasReachedMinTime = ( this.state.calendarIndex === 0 );
			var hasReachedMaxTime = ( this.state.calendarIndex === this.numCalendars - 1 );
			var isNotPresentTime = ( this.state.calendarIndex !== this.numPastMonths );

			var dayIndex = this.props.periods.today.periodDayIndex + 1;
			var nextPeriodStart = this.props.periods.future[ 0 ].start.format( 'MMMM DD' );
			console.log( this.state.selectedDate )
			return (
				<View style={styles.main}>
					<View style={styles.banner}>
						<Text style={[styles.h1, styles.bannerText]}>Period Day <Text style={styles.digit}>{dayIndex}</Text></Text>
						<Text style={[styles.h2, styles.bannerText]}>Next period starts {nextPeriodStart}</Text>

						<View style={styles.trackButtonContainer}>
							<TouchableOpacity style={styles.trackButton} onPress={this.state.selectedDate ? this.onPressTrackButton : null}>
								<Icon style={styles.trackButtonText} name='pen' />
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.header}>
						<Text style={styles.dateHeading}>{monthName + ' ' + year}</Text>

						<View style={styles.nav}>
							<TouchableWithoutFeedback onPress={this.scrollToPrev}>
								<Icon style={[styles.navArrow, hasReachedMinTime ? styles.inactiveNavButton : null]} name='prev' />
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback onPress={this.jumpToPresent}>
								<Icon style={[styles.navDot, isNotPresentTime ? null : styles.inactiveNavButton]} name='dot' />
							</TouchableWithoutFeedback>

							<TouchableWithoutFeedback onPress={this.scrollToNext}>
								<Icon style={[styles.navArrow, hasReachedMaxTime ? styles.inactiveNavButton : null]} name='next' />
							</TouchableWithoutFeedback>
						</View>
					</View>

					{this.renderWeekHeader()}

					<ListView
						ref='listView'
						dataSource={this.dataSource}
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
	banner: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 50,
		height: 150,
		paddingHorizontal: 40,
		backgroundColor: '#adadad'
	},
	bannerText: {
		color: '#ffffff'
	},
	h1: {
		fontSize: 40
	},
	h2: {
		fontSize: 15
	},
	trackButtonContainer: {
		position: 'absolute',
		right: 40,
		bottom: -30,
		width: 60,
		height: 60,
		borderRadius: 60,
		backgroundColor: '#FCFCFC',
		shadowOffset: {
			width: 1,
			height: 5,
		},
		shadowRadius: 10,
		shadowColor: 'black',
		shadowOpacity: 0.2
	},
	trackButton: {
		width: 60,
		height: 60,
		borderRadius: 60,
		overflow: 'hidden',
		backgroundColor: 'transparent',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	trackButtonText: {
		color: '#000',
		fontSize: 22
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
		paddingHorizontal: 40,
		marginBottom: 10
	},
	nav: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	navArrow: {
		color: 'black',
		fontSize: 14
	},
	navDot: {
		color: 'black',
		fontSize: 10,
		marginHorizontal: 15
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


module.exports = HomeScene;