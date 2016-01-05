var React = require( 'react-native' );
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var Dimensions = React.Dimensions;
var TextInput = React.TextInput;
var TouchableOpacity = React.TouchableOpacity;

var Form = require( 'react-native-form' );

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

// keyboard reference: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02#.vq0c5lgnx


var App = React.createClass( {

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {

	},

	onClickSignUp: function() {

		var inputVals = this.refs.signUpForm.getValues();

		fetch( 'http://localhost:5000/signup', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {
					email: inputVals.email,
					password: inputVals.password
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

		var inputVals = this.refs.signInForm.getValues();

		fetch( 'http://localhost:5000/signin', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {
					email: inputVals.email,
					password: inputVals.password
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

	onClickSignOut: function() {

		fetch( 'http://localhost:5000/signout', {
			method: 'GET'
		} );
	},

	render: function() {

		return (
			<View style={styles.main}>

				<View style={styles.modal}>
					<Form ref='signUpForm'>
						<TextInput style={styles.textInput}
							name='email' placeholder='Email Address'
							autoCapitalize='none' autoCorrect={false} keyboardType='email-address' />

						<TextInput style={styles.textInput}
							name='password' placeholder='Password'
							autoCapitalize='none' autoCorrect={false} keyboardType='ascii-capable' secureTextEntry={true} />
					</Form>

					<TouchableOpacity style={styles.button} onPress={this.onClickSignUp}>
	                    <Text>Sign Up</Text>
	                </TouchableOpacity>
                </View>


                <View style={styles.modal}>
					<Form ref='signInForm'>
						<TextInput style={styles.textInput}
							name='email' placeholder='Email Address'
							autoCapitalize='none' autoCorrect={false} keyboardType='email-address' />

						<TextInput style={styles.textInput}
							name='password' placeholder='Password'
							autoCapitalize='none' autoCorrect={false} keyboardType='ascii-capable' secureTextEntry={true} />
					</Form>

					<TouchableOpacity style={styles.button} onPress={this.onClickSignIn}>
	                    <Text>Sign In</Text>
	                </TouchableOpacity>
                 </View>

				<TouchableOpacity style={styles.button} onPress={this.onClickSignOut}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>

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
	},
	button: {
		alignSelf: 'center',
		marginTop: 5,
		paddingHorizontal: 6,
		paddingVertical: 3,
		borderColor: '#000',
		borderWidth: 1
	},
	textInput: {
		alignSelf: 'center',
		width: 200,
		height: 30,
		fontSize: 14,
		padding: 7,
		margin: 2,
		borderColor: '#dfdfdf',
		borderWidth: 1
	},
	modal: {
		margin: 10,
		padding: 10,
		borderColor: '#dfdfdf',
		borderWidth: 1
	}
} );


module.exports = App;