var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableWithoutFeedback
} = React;

var PureRenderMixin = require( 'react-addons-pure-render-mixin' );

var _ = require( 'underscore' );
var Calendar = require( 'calendar' ).Calendar;

var moment = require( 'moment' );

var now = moment();

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;


var DatePicker = React.createClass( {

	mixins: [ PureRenderMixin ],

	getDefaultProps: function() {

		return {
			year: now.year(),
			month: now.month(),
			today: null
		};
	},

	getInitialState: function() {

		return {
			days: null,
			date: null,
			keyOfSelectedDay: null
		};
	},

	componentWillMount: function() {

		var cal = new Calendar();
		var days = cal.monthDates( this.props.year, this.props.month );

		var today = this.props.today;
		var keyOfToday;

		var daysMoment = _.map( days, function( daysInRow, row ) {

			return _.map( daysInRow, function( date, col ) {

				var m = moment( date );

				if ( m.diff( today, 'days' ) === 0 ) {
					keyOfToday = row * 7 + col;
				}

				return m;
			} );
		} );

		var requiredDays = 7 * 6;
		var currentDays = daysMoment.length * 7;
		var numDaysToFill = requiredDays - currentDays;

		if ( numDaysToFill > 0 ) {

			var lastDay = _.last( _.last( daysMoment ) );
			var daysMomentToFill = _.times( numDaysToFill, function( index ) {
				return moment( lastDay ).add( index + 1, 'day' );
			} );

			while ( daysMomentToFill.length > 0 ) {
				daysMoment.push( daysMomentToFill.splice( 0, 7 ) );
			}
		}

		var date = moment( new Date( this.props.year, this.props.month ) );

		this.setState( {
			days: daysMoment,
			date: date,
			keyOfSelectedDay: keyOfToday
		} );
	},

	formattedCalendarDate: function() {

		return ( this.state.date.format( 'MMMM' ) + ' ' + this.props.year );
	},

	onPressDay: function( key ) {

		this.setState( {
			keyOfSelectedDay: key
		} );

		var row = Math.floor( key / 7 );
		var col = key % 7;
		var day = this.state.days[ row ][ col ];
		console.log( day );
	},

	renderRow: function( days, row ) {

		var now = moment();
		var thisMonth = this.state.date.month();

		var currentPeriods = this.props.currentPeriods;
		var futurePeriods = this.props.futurePeriods;

		var formattedDaysInRow = _.map( days, function( mdate, col ) {

			var key = row * 7 + col;
			var isSelected = ( key === this.state.keyOfSelectedDay );

			var isOtherMonthDay = ( mdate.month() !== thisMonth );

			var diffDays = mdate.diff( now, 'days' );
			var isToday = ( diffDays === 0 && !( 1 / diffDays > 0 ) );

			var isCurrentPeriodDay = _.some( currentPeriods, function( period ) {
				return ( period.start.diff( mdate, 'days' ) <= 0 && period.end.diff( mdate, 'days' ) >= 0 );
			} );

			var isFuturePeriodDay = _.some( futurePeriods, function( period ) {
				return ( period.start.diff( mdate, 'days' ) <= 0 && period.end.diff( mdate, 'days' ) >= 0 );
			} );

			var style = [
				styles.dayButton,
				isCurrentPeriodDay ? styles.currentPeriodDay : null,
				isFuturePeriodDay ? styles.futurePeriodDay : null,
				isToday ? styles.today : null,
				isSelected ? styles.selectedDay : null
			];

			var textStyle = [
				styles.dayText,
				isOtherMonthDay ? styles.grayText : null
			];

			return (
				<TouchableWithoutFeedback key={key} onPress={this.onPressDay.bind(this, key)}>
					<View style={style}>
						<Text style={textStyle}>{mdate.date()}</Text>
					</View>
				</TouchableWithoutFeedback>
			);

		}, this );

		return (
			<View key={row} style={styles.gridRow}>
				{formattedDaysInRow}
			</View>
		);
	},

	render: function() {

		return (
			<View style={styles.main}>

				<View style={styles.grid}>
					{this.state.days.map(this.renderRow)}
				</View>

			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		width: DEVICE_WIDTH,
		backgroundColor: '#fff'
	},
	grid: {
		height: 200
	},
	gridRow: {
		flex: 1,
		flexDirection: 'row',
		width: 315,
		alignSelf: 'center'
	},
	dayButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	selectedDay: {
		backgroundColor: '#BEE2C2'
	},
	currentPeriodDay: {
		backgroundColor: '#ff9999'
	},
	futurePeriodDay: {
		backgroundColor: '#ffe6e6'
	},
	today: {
		borderBottomColor: '#000000',
		borderBottomWidth: 4
	},
	dayText: {
		fontSize: 12
	},
	grayText: {
		color: 'lightgray'
	}
} );


module.exports = DatePicker;