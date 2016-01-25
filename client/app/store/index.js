var createStore = require( 'redux' ).createStore;
var combineReducers = require( 'redux' ).combineReducers;
var update = require( 'react-addons-update' );

var ActionTypes = require( '../constants/actiontypes' );

var initialState = {
	periods: [],
	futurePeriods: []
};


var processPeriods = function( state = [], action ) {

	switch ( action.type ) {

		case ActionTypes.ADD_PERIOD:

			var newPeriod = {
				start: action.start,
				end: action.end
			};

			var nextState = update( state, {
				$push: [ newPeriod ]
			} );

			return nextState;

		default:
			return state;
	}
};


var processFuturePeriods = function( state = [], action ) {

	switch ( action.type ) {

		case ActionTypes.UPDATE_FUTURE_PERIODS:

			var nextState = state;

			// TODO: predict future periods

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
	futurePeriods: processFuturePeriods

} );


module.exports = createStore( reducer, initialState );