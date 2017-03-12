import React from 'react';
import { browserHistory } from 'react-router';
import './loginpage/LoginPage.css'

import { hashHistory } from 'react-router';

import Box from 'react-layout-components'

import * as ConnectionActions from '../actions/ConnectionActions'
import ConnectionStore from '../stores/ConnectionStore'

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

        this.updateConnection = this.updateConnection.bind(this)
    }

    /*
    Kicks off logging in to the server with a password. The callbacks
    will then have it automatically connect to the websocket.

    First it checks that the formatting is correct for everything
    */
    login() {

        let url = this.state.url;
        let password = this.state.password;


        // If they didn't add http, we should add it for them
        if (!(url.startsWith("http://") || url.startsWith("https://"))) {
            console.log("No http(s)");
            url = "http://" + url;
            this.setState({ "url": url });
        }

        // First validate that the server URL and password are filled in
        // so we don't send our complete garbage and give error feedback if they are not.
        if (password.length === 0) {
            let error = "Please enter a password";
            this.setState({ errormessage: error });
            this.setState({ isconnecting: false });
            return;
        }

        if (url.length < 10) {
            let error = "Please enter a URL";
            this.setState({ errormessage: error });
            this.setState({ isconnecting: false });
            return;
        }

        // Now check that it is most likely a valid URL
        if (this.isInvalidURL(url)) {
            let error = "Please enter a valid URL";
            this.setState({ errormessage: error });
            this.setState({ isconnecting: false });
            return;
            // Clear any error messages as we are good to go
        } else {
            this.setState({ errormessage: '' });
        }

        // Given we are done validating inputs, switch to the 
        // spinner
        //this.setState({ isconnecting: true });

        // Store away the server_url for the future so that
        // we can load it whenever we come back and automatically
        // connect.
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("server_url", url);
        }

        ConnectionActions.login(url, password);

        // Call the actual authentication and respond to its triggers
        //authenticate(url, password, this.tryToConnect.bind(this), this.onFailure.bind(this));
    }

    // Once we are connected to the server, call this to try to connect
    // to the websocket to start things up. We have to keep it separate
    // because many times we will want to just reconnect if the cookie
    // is already here and we don't need to put in the pwd
    //tryToConnect() {
    //    ConnectionActions.connectToWebsocket()
    //}

    onFailure(message) {
        console.log("Error connecting: " + message);
        this.setState({ isconnecting: false });
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
            this.login();
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

    // Each time the ConnectionStore changes, this wil lbe called and it
    // will try to connect everything together.
    updateConnection = () => {

        //console.log(ConnectionStore.getState());
        
        // Update the visuals and trigger actions
        switch (ConnectionStore.getState()) {
            case "SERVER_CONNECTION_ERROR":
                {
                    console.log("Error logging in...");
                    this.setState({ isconnecting: false });
                    this.setState({ errormessage: ConnectionStore.getDescription() });
                    break;
                }
            case "SERVER_AUTHENTICATING":
                {
                    this.setState({ isconnecting: true });
                    this.setState({ errormessage: 'SERVER_AUTHENTICATING' });
                    break;
                }
            case "SERVER_CONNECTING":
                {
                    this.setState({ isconnecting: true });
                    this.setState({ errormessage: 'SERVER_CONNECTING' });
                    break;
                }
            case "SERVER_CONNECTED":
                {
                    this.setState({ isconnecting: false });
                    this.setState({ errormessage: '' });
                    console.log("Authenticated and connected to web socket so advancing to /core")
                    this.props.router.push('/core');
                    //hashHistory.push('/login');
                    break;
                }
            case "SERVER_LOGGED_IN":
                {
                    const url = this.state.url;

                    if (ConnectionStore.isConnected()) {
                        this.props.router.push('/core');
                        //console.log("Already connected ")
                        // If we are logged in already, don't trigger anything here
                    } else if (ConnectionStore.isConnecting()) {
                        //console.log("Currently connecting so won't try to connect.")
                        // Let it go///
                    } else if (!this.isInvalidURL(url)) {
                        console.log("Going to try to log in again soon...");
                        setTimeout(() => {
                            //console.log("LoginPage LOGGED IN BUT NOT CONNECTED. Lazily connecting to web socket because logged ins")
                            ConnectionActions.connectWebSocket(url);
                        }, 10);
                    }

                    break;
                }
                // SERVER_DISCONNECTED
            default:
                {
                    this.setState({ isconnecting: false });
                    this.setState({ errormessage: '' });

                }
        }
    }

    // This is called right when it mounts for the first time
    // and checks if we are already logged in. If we are, it will
    // forward us to the 'core' page of the application. If we are
    // authenticated but haven't yet opened a websocket connection
    // then it will try to also do so immediately.
    componentWillMount() {

        // Register so we know if our connection state has changed
        // and we can adjust accordingly
        ConnectionStore.on("CHANGED", this.updateConnection)

        // Call updateConnection here to initialize everything and possibly
        // just send us forward if we are already logged in from last time.
        this.updateConnection();
    }

    componentWillUnmount() {
        ConnectionStore.removeListener("CHANGED", this.updateConnection)
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
                    onClick={this.login.bind(this)}>Log In</RaisedButton>
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
