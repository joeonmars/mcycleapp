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

		var currentMonth = this.state.date.month();

		var formattedDaysInRow = _.map( days, function( mdate, _i ) {

			var isOtherMonthDay = ( mdate.month() !== currentMonth );

			var textStyle = [
				styles.dayText,
				isOtherMonthDay ? styles.grayText : null
			];

			return (
				<TouchableOpacity key={_i} style={styles.dayButton}>
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
		paddingHorizontal: 40,
		backgroundColor: '#fff'
	},
	grid: {
		height: 200
	},
	gridRow: {
		flex: 1,
		flexDirection: 'row'
	},
	dayButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dayText: {
		fontSize: 12
	},
	grayText: {
		color: 'lightgray'
	}
} );


module.exports = DatePicker;