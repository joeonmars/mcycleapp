var {
	createStore,
	applyMiddleware,
	compose,
	combineReducers
} = require( 'redux' );

var update = require( 'react-addons-update' );
var thunk = require( 'redux-thunk' );
var devTools = require( 'remote-redux-devtools' );

var moment = require( 'moment' );
var _ = require( 'underscore' );
var Identifiers = require( 'identifiers' );
var ActionTypes = require( '../constants/actiontypes' );

var identifiers = new Identifiers( 4 );

var initialState = {
	periods: {
		past: [],
		current: [],
		future: [],
		today: {
			start: null,
			periodId: null,
			periodDayIndex: 0
		}
	},
	preferences: {
		trackingCategories: {
			flow: true,
			activity: false,
			medicine: false,
			symptom: false,
			sleep: false,
			mood: false,
			love: false,
			weight: false,
			temperature: false,
			travel: false
		}
	}
};


var calculateFuturePeriods = function( currentPeriodEnd, avgDays, avgGap ) {

	var futurePeriods = [];
	var start, end = currentPeriodEnd;

	var maxDay = moment().add( 1, 'years' );
	var shouldCalcNextPeriod = true;

	while ( shouldCalcNextPeriod ) {

		start = end.clone().add( avgGap, 'days' );
		end = start.clone().add( avgDays, 'days' );

		var reachedMaxDay = ( start > maxDay || end > maxDay );

		if ( reachedMaxDay ) {

			shouldCalcNextPeriod = false;

		} else {

			var period = {
				id: identifiers.next(),
				start: start,
				end: end,
				future: true
			};

			futurePeriods.push( period );
		}
	}

	return futurePeriods;
};


var processPeriods = function( state = {}, action ) {

	switch ( action.type ) {

		case ActionTypes.ADD_PERIOD:

			var now = moment();
			var start = moment( action.start );
			var end = moment( action.end );

			var period = {
				id: identifiers.next(),
				start: start,
				end: end
			};

			var key = ( end < now ) ? 'past' : 'current';
			period[ key ] = true;

			var updates = {};
			updates[ key ] = {
				$push: [ period ]
			};

			updates[ 'future' ] = {
				$set: calculateFuturePeriods( end, 7, 28 )
			};

			var nextState = update( state, updates );

			return nextState;


		case ActionTypes.UPDATE_TODAY:

			var startOfDay = moment().startOf( 'day' );
			var currentPeriod = state.current[ 0 ];
			var periodDayIndex = startOfDay.diff( currentPeriod.start, 'days' );

			var nextState = update( state, {
				today: {
					start: {
						$set: startOfDay
					},
					periodDayIndex: {
						$set: periodDayIndex
					}
				}
			} );

			return nextState;


		default:
			return state;
	}
};


var processPreferences = function( state = {}, action ) {

	switch ( action.type ) {

		case ActionTypes.CHANGE_TRACKING_CATEGORIES:

			var clonedStatus = _.clone( state.trackingCategories );
			_.extend( clonedStatus, action.status );

			var nextState = update( state, {
				trackingCategories: {
					$set: clonedStatus
				}
			} );

			return nextState;

		default:
			return state;
	}
};


/* The reducer is a pure function that takes the previous state and an action,
 * and returns the next state.
 * http://rackt.org/redux/docs/basics/Reducers.html
 */
var reducer = combineReducers( {

	periods: processPeriods,
	preferences: processPreferences

} );

var enhancer = compose(
	applyMiddleware( thunk ),
	devTools()
);


module.exports = createStore( reducer, initialState, enhancer );