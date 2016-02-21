var ActionTypes = require( '../constants/actiontypes' );


module.exports.changeTrackingCategories = function( manifest ) {

	return {
		type: ActionTypes.CHANGE_TRACKING_CATEGORIES,
		manifest: manifest
	};
};