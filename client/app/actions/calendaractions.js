var ActionTypes = require( '../constants/actiontypes' );


module.exports.addPeriod = function( start, end ) {

	return {
		type: ActionTypes.ADD_PERIOD,
		start: start,
		end: end
	};
};


module.exports.removePeriod = function( id ) {

	return {
		type: ActionTypes.REMOVE_PERIOD,
		id: id
	};
};


module.exports.modifyPeriod = function( id, start, end ) {

	return {
		type: ActionTypes.MODIFY_PERIOD,
		id: id,
		start: start,
		end: end
	};
};


module.exports.mergePeriods = function( id1, id2 ) {

	return {
		type: ActionTypes.MERGE_PERIOD,
		id1: id1,
		id2: id2
	};
};


module.exports.updateToday = function() {

	return {
		type: ActionTypes.UPDATE_TODAY
	};
};