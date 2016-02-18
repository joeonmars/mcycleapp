var React = require( 'react-native' );

var {
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity
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
			month: now.month()
		};
	},

	getInitialState: function() {

		return {
			days: null,
			date: null
		};
	},

	componentWillMount: function() {

		var cal = new Calendar();
		var days = cal.monthDates( this.props.year, this.props.month );

		var daysMoment = _.map( days, function( daysInRow ) {
			return _.map( daysInRow, function( date ) {
				return moment( date );
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
			date: date
		} );
	},

	componentDidMount: function() {

	},

	formattedCalendarDate: function() {

		return ( this.state.date.format( 'MMMM' ) + ' ' + this.props.year );
	},

	renderRow: function( days, i ) {

		var now = moment();
		var thisMonth = this.state.date.month();

		var currentPeriods = this.props.currentPeriods;
		var futurePeriods = this.props.futurePeriods;

		var formattedDaysInRow = _.map( days, function( mdate, _i ) {

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
				isToday ? styles.today : null
			];

			var textStyle = [
				styles.dayText,
				isOtherMonthDay ? styles.grayText : null
			];

			return (
				<TouchableOpacity key={_i} style={style}>
					<Text style={textStyle}>{mdate.date()}</Text>
				</TouchableOpacity>
			);
		} );

		return (
			<View key={i} style={styles.gridRow}>
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
		alignItems: 'center',
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