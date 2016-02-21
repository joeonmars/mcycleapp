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
			selectedDate: null,
			dataSource: null
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

		var startDate = moment().startOf( 'month' ).add( -this.numPastMonths, 'month' );

		var calendarDates = [];

		for ( var i = 0; i < this.numCalendars; i++ ) {

			var date = startDate.clone().add( i, 'month' );
			calendarDates.push( date );
		}

		this.calendarDates = calendarDates;

		var dataSource = this.createDataSource( this.numPastMonths );

		this.setState( {
			calendarIndex: this.numPastMonths,
			selectedDate: this.props.periods.today.start,
			dataSource: dataSource
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

	createDataSource: function( selectedRowID ) {

		var dataSource = _.map( this.calendarDates, function( calendarDate, i ) {
			return {
				calendarDate: calendarDate,
				selected: ( i === parseInt( selectedRowID ) )
			}
		} );

		var ds = this.state.dataSource || new ListView.DataSource( {
			rowHasChanged: function( row1, row2 ) {
				return row1.selected !== row2.selected;
			}
		} );

		return ds.cloneWithRows( dataSource );
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

		var route = {
			id: 'tracking',
			date: this.state.selectedDate
		};

		this.props.navigator.replaceAtIndex( route, 1 );
		this.props.navigator.jumpTo( route );

		this.props.hideMainNav();
	},

	onDateSelected: function( rowID, date ) {

		this.setState( {
			selectedDate: date,
			dataSource: this.createDataSource( rowID )
		} );
	},

	renderCalendar: function( data, sectionID, rowID ) {

		var periods = this.props.periods;
		var date = data.calendarDate;
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
				selectedDate={this.state.selectedDate} onDateSelected={this.onDateSelected.bind(this, rowID)} />
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

			var startOfMonth = calendarDate.clone().startOf( 'month' );
			var endOfMonth = calendarDate.clone().endOf( 'month' );
			var trackable = ( this.state.selectedDate >= startOfMonth && this.state.selectedDate <= endOfMonth );

			var trackIconStyle = [ styles.trackIcon, trackable ? null : styles.inactiveTrackIcon ];

			return (
				<View style={styles.main}>
					<View style={styles.banner}>
						<Text style={[styles.h1, styles.bannerText]}>Period Day <Text style={styles.digit}>{dayIndex}</Text></Text>
						<Text style={[styles.h2, styles.bannerText]}>Next period starts {nextPeriodStart}</Text>

						<View style={styles.trackButtonContainer}>
							<TouchableOpacity style={styles.trackButton} onPress={trackable ? this.onPressTrackButton : null}>
								<Icon style={trackIconStyle} name='pen' />
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
	inactiveTrackIcon: {
		color: '#DFDFDF'
	},
	trackIcon: {
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