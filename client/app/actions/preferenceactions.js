var ActionTypes = require( '../constants/actiontypes' );


module.exports.changeTrackingCategories = function( status ) {

	return {
		type: ActionTypes.CHANGE_TRACKING_CATEGORIES,
		status: status
	};
};