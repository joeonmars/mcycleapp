var React = require( 'react-native' );
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var Dimensions = React.Dimensions;
var TextInput = React.TextInput;
var TouchableOpacity = React.TouchableOpacity;

var Form = require( 'react-native-form' );

var FBSDKLogin = require( 'react-native-fbsdklogin' );
var FBSDKLoginButton = FBSDKLogin.FBSDKLoginButton;

var FBSDKCore = require( 'react-native-fbsdkcore' );
var FBSDKGraphRequest = FBSDKCore.FBSDKGraphRequest;

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

// keyboard reference: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02#.vq0c5lgnx
// Facebook App: https://developers.facebook.com/apps/434792680058057/dashboard/

var App = React.createClass( {

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {

	},

	signUp: function( username, password, email, via ) {

		fetch( 'http://localhost:5000/signup-' + via, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {
					username: username,
					password: password,
					email: email,
					via: via
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

	signIn: function( username, password, email, via ) {

		fetch( 'http://localhost:5000/signin-' + via, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( {
					username: username,
					password: password,
					email: email,
					via: via
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

	signOut: function() {

		fetch( 'http://localhost:5000/signout', {
			method: 'GET'
		} );
	},

	onClickSignUp: function() {

		var inputVals = this.refs.signUpForm.getValues();

		this.signUp( inputVals.email, inputVals.password, inputVals.email, 'local' );
	},

	onClickSignIn: function() {

		var inputVals = this.refs.signInForm.getValues();

		this.signIn( inputVals.email, inputVals.password, inputVals.email, 'local' );
	},

	onFBLoginFinished: function( err, result ) {

		if ( !err && !result.isCancelled ) {

			var graphPath = '/me';

			var params = {
				fields: {
					string: 'email'
				}
			};

			var fetchUserRequest = new FBSDKGraphRequest( function( error, result ) {

				if ( error ) {

					alert( 'Error logging in Facebook.' );

				} else if ( !result.email ) {

					alert( 'Email cannot read.' );

				} else {

					this.signIn( result.id, ' ', result.email, 'facebook' );
				}

			}.bind( this ), graphPath, params );

			fetchUserRequest.start();
		}
	},

	onFBLogoutFinished: function() {

		this.signOut();
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

	                <FBSDKLoginButton style={styles.fbButton}
	                	onLoginFinished={this.onFBLoginFinished}
          				onLogoutFinished={this.onFBLogoutFinished}
          				readPermissions={['email']}
          				publishPermissions={[]}/>
                 </View>

				<TouchableOpacity style={styles.button} onPress={this.signOut}>
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
	fbButton: {
		alignSelf: 'center',
		marginTop: 5,
		width: 150,
		height: 30
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