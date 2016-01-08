var {
	createIconSetFromFontello
} = require( 'react-native-vector-icons' );

var fontelloConfig = require( './config.json' );

var Icon = createIconSetFromFontello( fontelloConfig );


exports.Icon = Icon;