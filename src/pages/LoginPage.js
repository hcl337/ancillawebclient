import React from 'react';
import { browserHistory } from 'react-router';
import './loginpage/LoginPage.css'
import { authenticate } from '../helpers/RobotAuthenticate'
import RobotWebsocket from '../helpers/RobotWebsocket'
import { isAuthenticated } from '../helpers/RobotAuthenticate'

import Box from 'react-layout-components'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            url: localStorage.getItem("server_url"),
            password: '',
            errormessage: "",
            isconnecting: true
        }
    }

    /*
    Tries to log in to the server but does not connect to the websocket
    here. Use tryToConnect( ) for that. It is meant to be called as 
    fire and forget and updates the state to reflect what is going on.
    */
    tryToLogIn() {

        let url = this.state.url;
        let password = this.state.password;


        // First validate that the server URL and password are filled in
        // so we don't send our complete garbage and give error feedback if they are not.
        if (password.length === 0) {
            let error = "Please enter a password";
            this.setState({ errormessage: error });
            this.setState({ 'isconnecting': false });
            return;
        }
        if (url.length < 5) {
            let error = "Please enter a URL";
            this.setState({ errormessage: error });
            this.setState({ 'isconnecting': false });
            return;
        }
        // If they didn't add http, we should add it for them
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
            console.log("No http(s)");
            url = "http://" + url;
            this.setState({ "url": url });
        }

        // Now check that it is most likely a valid URL
        if (this.isInvalidURL(url)) {
            let error = "Please enter a valid URL";
            this.setState({ errormessage: error });
            this.setState({ 'isconnecting': false });
            return;
            // Clear any error messages as we are good to go
        } else {
            this.setState({ errormessage: '' });
        }

        // Given we are done validating inputs, switch to the 
        // spinner
        this.setState({ 'isconnecting': true });

        // Store away the server_url for the future so that
        // we can load it whenever we come back and automatically
        // connect.
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("server_url", url);
        }

        // Call the actual authentication and respond to its triggers
        authenticate(url, password, this.tryToConnect.bind(this), this.onFailure.bind(this));
    }

    // Once we are connected to the server, call this to try to connect
    // to the websocket to start things up. We have to keep it separate
    // because many times we will want to just reconnect if the cookie
    // is already here and we don't need to put in the pwd
    tryToConnect() {

        var self = this;
        isAuthenticated(
            // If we are authenticated, then log in
            function() {
                self.setState({ 'isconnecting': true });

                var serverURL = self.state.url; //localStorage.getItem("server_url");

                // If we are already connected, we are trying to change the connection
                // so please close it and call the new one to connect
                if (RobotWebsocket.isConnected) {
                    new RobotWebsocket(serverURL).close();
                }

                // Connect to the server (hopefully!)
                new RobotWebsocket(serverURL);

                // We have to wait a little bit before checking that we are 
                // connected because we have to get through the stack and have
                // it actually communicate. Otherwise, it says we are not connected
                setTimeout(function() {
                    RobotWebsocket.isConnected(
                        // Succeeded at logging in
                        function() {
                            self.setState({ 'isconnecting': false });
                            self.props.router.push('/core');
                        },
                        // If we failed to log in
                        function() {
                            self.onFailure("Failed to connect to websocket even though we are logged in");
                        })
                }, 100);
            },
            // If we are not yet authenticated, throw our error
            function() {
                {
                    console.log('Tried to connect to websocket when not logged in to server. Please log in first.');
                    self.onFailure("Can't connect to websocket server. Log in first.");
                }
            });


    }

    onFailure(message) {
        console.log("Error connecting: " + message);
        this.setState({ 'isconnecting': false });
        this.setState({ errormessage: message })
    }

    handleChangeUrl(e) {
        var url = e.target.value;
        this.setState({ url: url });
    }

    handleChangePassword(e) {
        var password = e.target.value;
        this.setState({ password: password });
    }

    // Check the inputs (password and url) for if they
    // press enter
    checkForEnter(e) {
        if (e.key === 'Enter') {
            this.tryToLogIn();
        }
    }

    isInvalidURL(value) {

        if (value.startsWith('http://localhost:') ||
            value.startsWith('http://127.0.0.1:')) {
            return false;
        }
        // Copyright (c) 2010-2013 Diego Perini, MIT licensed
        // https://gist.github.com/dperini/729294
        // see also https://mathiasbynens.be/demo/url-regex
        // modified to allow protocol-relative URLs
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    }

    // This is called right when it mounts for the first time
    // and checks if we are already logged in. If we are, it will
    // forward us to the 'core' page of the application. If we are
    // authenticated but haven't yet opened a websocket connection
    // then it will try to also do so immediately.
    componentWillMount() {

        var self = this;
        console.log("Mounting Login");
        isAuthenticated(
            // If authenticated, calls here
            function() {
                //Successfully authenticated and connected
                RobotWebsocket.isConnected(
                    // Already authenticated and connected
                    function() {
                        // So move us to the core.
                        console.log("Already logged in so moving to core.");
                        self.props.router.push('/core');
                    },
                    //Fail socket is connected
                    function() {
                        console.log("Authenticated but not connected to the websocket yet.");

                        self.tryToConnect();
                    })
            },
            //Fail authentication
            function() {
                console.log("Not authenticated or logged in.");
                self.setState({ 'isconnecting': false });
            })
    }

    // Shows the input dialog for password and url with a submit button
    renderInput() {

        return (
            <Box className={'centerElements'}>
                <h1>Ancilla | Three</h1>
                <TextField
                    name={'url_text_box'} 
                    value={this.state.url}
                    onChange={this.handleChangeUrl.bind(this)}
                    onKeyPress={this.checkForEnter.bind(this)}
                    placeholder={'server url'}> 
                </TextField> < br></br>
                <TextField
                    name={'pwd_text_box'} 
                    type={'password'}
                    value={this.state.password}
                    onChange={this.handleChangePassword.bind(this)}
                    onKeyPress={this.checkForEnter.bind(this)}
                    placeholder={'password'} > 
                </TextField> < br></br>
                <p className="errormessage">{this.state.errormessage}</p> < br / >
                <RaisedButton 
                    fullWidth={true}
                    primary={true}
                    onKeyPress={this.checkForEnter.bind(this)}
                    onClick={this.tryToLogIn.bind(this)}>Log In</RaisedButton>
            </Box>
        );
    }

    // Shows the connecting dialog with a circular spinner
    renderConnecting() {
        return (
            <Box className={'centerElements'}>
                <CircularProgress size={80} thickness={10}></CircularProgress>
                <h4>Connecting...</h4>
            </Box>
        );
    }


    render() {
        var elementToShow = null;

        // Decide to show the dialog or connecting spinnger
        // based on the state
        if (this.state.isconnecting) {
            elementToShow = this.renderConnecting();
        } else {
            elementToShow = this.renderInput();
        }

        return (
            <Paper className={'dialog'}>
                {elementToShow}
            </Paper>
        );
    }


}
