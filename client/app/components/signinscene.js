var React = require( 'react-native' );

var {
	Text,
	StyleSheet,
	Navigator,
	Dimensions,
	TextInput,
	TouchableOpacity,
	View,
} = React;

var Form = require( 'react-native-form' ).default;
var Icon = require( './icon' ).Icon;

var CalendarActions = require( '../actions' ).CalendarActions;

var FBSDKLogin = require( 'react-native-fbsdklogin' );
var FBSDKLoginButton = FBSDKLogin.FBSDKLoginButton;

var FBSDKCore = require( 'react-native-fbsdkcore' );
var FBSDKGraphRequest = FBSDKCore.FBSDKGraphRequest;

var FBLoginManager = require( 'NativeModules' ).FBSDKLoginManager;

var DEVICE_WIDTH = Dimensions.get( 'window' ).width;

// keyboard reference: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02#.vq0c5lgnx
// Facebook App: https://developers.facebook.com/apps/434792680058057/dashboard/

var SignInScene = React.createClass( {

	getInitialState: function() {

		return {
			user: null
		};
	},

	componentDidMount: function() {

		// WIP
		var start = new Date();
		start.setHours( 0, 0, 0, 0 );

		var end = new Date( start.getTime() + 7 * 24 * 60 * 60 * 1000 );

		this.props.dispatch( CalendarActions.addPeriod( start, end ) );
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

				this.setState( {
					user: json
				} );

				this.gotoSetup();

			}.bind( this ) )
			.catch( function( err ) {

				console.log( err.message );
			} );
	},

	signOut: function() {

		fetch( 'http://localhost:5000/signout', {
			method: 'GET'
		} ).then( function( res ) {

			this.setState( {
				user: null
			} );

		}.bind( this ) );
	},

	signInFB: function() {

		FBLoginManager.logInWithReadPermissions( [ 'email' ], this.onFBSignInFinished );
	},

	signOutFB: function() {

		FBLoginManager.logOut();
		this.signOut();
	},

	gotoSetup: function() {

		this.props.navigator.push( {
			id: 'main', //'setup',
			sceneConfig: Navigator.SceneConfigs.FloatFromRight
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

	onFBSignInFinished: function( err, result ) {

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

	render: function() {

		var fbButtonText = this.state.user ? 'Sign Out from Facebook' : 'Sign In with Facebook';
		var fbButtonHandler = this.state.user ? this.signOutFB : this.signInFB;

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

					<TouchableOpacity style={styles.fbButton} onPress={fbButtonHandler}>
						<Icon style={styles.fbButtonIcon} name='facebook' />
						<Text style={styles.fbButtonText}>{fbButtonText}</Text>
					</TouchableOpacity>
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
		paddingHorizontal: 10,
		paddingVertical: 8,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'navy'
	},
	fbButtonIcon: {
		fontSize: 12,
		color: '#fff'
	},
	fbButtonText: {
		fontSize: 16,
		color: '#fff',
		fontFamily: 'MavenProLight300-Regular'
	},
	textInput: {
		alignSelf: 'center',
		width: 200,
		height: 30,
		fontSize: 12,
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


module.exports = SignInScene;