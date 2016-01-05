var React = require( 'react-native' );
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var Dimensions = React.Dimensions;
var Animated = React.Animated;
var TouchableHighlight = React.TouchableHighlight;

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;


var App = React.createClass( {

	getInitialState: function() {
		return {
			//bounceValue: new Animated.Value( 1 ),
			//xValue: new Animated.Value( 0 )
		};
	},

	componentDidMount: function() {

		/*
		this.state.bounceValue.setValue( 1.2 );

		Animated.spring(
			this.state.bounceValue, {
				toValue: 1,
				friction: 1,
			}
		).start();


		this.state.xValue.setValue( 200 );

		Animated.spring(
			this.state.xValue, {
				toValue: 0,
				friction: 1,
			}
		).start();
*/
	},

	onClickSignUp: function() {

		fetch( 'http://192.168.1.6:5000/signup', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {
					email: 'yueinteractive@gmail.com',
					password: '12121212'
				} ),
				credentials: 'include'
			} )
			.then( function( res ) {
				if ( res.ok ) {
					return Promise.resolve( res );
				} else {
					return Promise.reject( new Error( res._bodyText ) );
				}
			} )
			.then( function( res ) {
				return res.json();
			} )
			.then( function( json ) {
				console.log( json );
			} )
			.catch( function( err ) {
				console.log( err.message );
			} );
	},

	onClickSignIn: function() {

		fetch( 'http://192.168.1.6:5000/signin', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {
					email: 'yueinteractive@gmail.com',
					password: '12121212'
				} ),
				credentials: 'include'
			} )
			.then( function( res ) {
				if ( res.ok ) {
					return Promise.resolve( res );
				} else {
					return Promise.reject( new Error( res._bodyText ) );
				}
			} )
			.then( function( res ) {
				return res.json();
			} )
			.then( function( json ) {
				console.log( json );
			} )
			.catch( function( err ) {
				console.log( err.message );
			} );
	},

	render: function() {

		return (
			<View style={styles.main}>
				{/*<Animated.View style={[styles.view, {transform: [{scale: this.state.bounceValue}, {translateX: this.state.xValue}]}]}>
					<Text>Hello World!</Text>
				</Animated.View>*/}

				<TouchableHighlight onPress={this.onClickSignUp}>
                    <Text>SignUp</Text>
                </TouchableHighlight>

				<TouchableHighlight onPress={this.onClickSignIn}>
                    <Text>SignIn</Text>
                </TouchableHighlight>

			</View>
		);
	}
} );


var styles = StyleSheet.create( {
	main: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	view: {
		width: DEVICE_WIDTH / 3,
		height: DEVICE_WIDTH / 3,
		backgroundColor: 'red'
	}
} );


module.exports = App;