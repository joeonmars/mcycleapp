var ActionTypes = require( '../constants/actiontypes' );


module.exports.addPeriod = function( start, end ) {

	return {
		type: ActionTypes.ADD_PERIOD,
		start: start,
		end: end
	};
};