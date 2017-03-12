import axios from 'axios';
import dispatcher from "../dispatcher";

//import { authenticate } from '../helpers/RobotAuthenticate'
import RobotWebsocket from '../helpers/RobotWebsocket'
//import { isAuthenticated } from '../helpers/RobotAuthenticate'


/*
Log in and then use ConnectionStore to send back information on the state. 
This only logs in to the server. We need to next call connectWebSocket 
to get a connection.  
*/
export function login(server_url, password) {

    console.log("ConnectionActions: LOGIN");
    dispatcher.dispatch({
        type: "SERVER_AUTHENTICATING",
        server_url: server_url,
        message: 'authenticating'
    });

    authenticate(server_url, password,
        // Success callback
        () => {
            dispatcher.dispatch({
                type: "SERVER_LOGGED_IN",
                server_url: server_url
            });
        },
        // Failure callback
        (msg) => {
            sendConnectionError(msg);
        });
}

/*
Once the user has logged in, the next step is to connect to the web server.
This will trigger an action which will connect and will pass back state
through the ConnectionStore object.
*/
export function connectWebSocket(server_url) {

    console.log("ConnectionActions: Requested connection to web socket");

    dispatcher.dispatch({
        type: "SERVER_CONNECTING",
        server_url: server_url,
        message: 'connecting to websocket'
    });

    //self.setState({ 'isconnecting': true });

    RobotWebsocket.isConnected(
        () => {
            //console.log("Already connected to websocket so won't create a new one.");
            dispatcher.dispatch({ type: "SERVER_CONNECTED" });
        },
        () => {
            console.log("Not yet connected to websocket. Will create one.")
            new RobotWebsocket(server_url);

            // We have to wait a little bit before checking that we are 
            // connected because we have to get through the stack and have
            // it actually communicate. Otherwise, it says we are not connected
            setTimeout(() => {
                RobotWebsocket.isConnected(
                    // Succeeded at logging in
                    () => {
                        //self.setState({ 'isconnecting': false });
                        //self.props.router.push('/core');
                        dispatcher.dispatch({ type: "SERVER_CONNECTED" });
                    },
                    // If we failed to log in
                    () => {
                        sendConnectionError("Failed to connect to websocket even though we are logged in");
                    });
            }, 10);

        });
}

/*
Action to shut down the robot and return ConnectionStore SERVER_DISCONNECTED
*/
export function shutdownRobot() {
    const msg = { 'type': 'shutdown' }
    RobotWebsocket.instance().sendMessage(msg, function() {
        dispatcher.dispatch({
            type: "SERVER_DISCONNECTED"
        });
    });
}

/*
Action to Log out and return ConnectionStore SERVER_DISCONNECTED when complete
*/
export function logout() {

    console.log("ConnectionActions: LOG OUT / DISCONNECT");

    unAuthenticate(() => {
        dispatcher.dispatch({
            type: "SERVER_DISCONNECTED"
        });
    });
}

export function startTalking(){
        var msg = { 'type': 'SEND_STATE', 'enable': true, 'mps': 10 }
        RobotWebsocket.instance().sendMessage(msg)

        msg = { 'type': 'SEND_ENVIRONMENT_CAMERA', 'enable': true, 'fps': 4 }
        RobotWebsocket.instance().sendMessage(msg)
    }

export function stopTalking(){
        var msg = { 'type': 'SEND_STATE', 'enable': false, 'mps':10 }
        RobotWebsocket.instance().sendMessage(msg)

        msg = { 'type': 'SEND_ENVIRONMENT_CAMERA', 'enable': false, 'fps':4}
        RobotWebsocket.instance().sendMessage(msg)

    }

//-------------------------------------------------------------
//
// PRIVATE HELPERS BELOW
//
//-------------------------------------------------------------

// Simple wrapper so we can send error messages to everyone
function sendConnectionError(msg) {
    dispatcher.dispatch({
        type: "SERVER_CONNECTION_ERROR",
        message: msg
    });
}

// Checks if we are authenticated with the server by trying to get the
// index of it and succeeding or failing.
export function isAuthenticated(callbackSuccess, callbackFailure) {

    var serverURL = localStorage.getItem("server_url");

    //console.log("Calling isAuthenticated for " + serverURL)

    if (serverURL == null) {
        return callbackFailure();
    }

    axios({
            method: 'get',
            baseURL: serverURL,
            //headers: {'cookies':}
            withCredentials: true,
            url: serverURL
        })
        .then(function(response) {
            if (response.status === 200) {
                //console.log("isAuthenticated: true")
                return callbackSuccess();
            } else {
                //console.log("isAuthenticated: false")
                return callbackFailure();
            }
        }).catch(function(error) {
            //console.log("isAuthenticated: false")
            return callbackFailure();
        });
}


// Try to authenticate with the URL and pwd for the server
function authenticate(serverURL, password, callbackSuccess, callbackFailure) {

    //console.log("Calling authenticate to log in for " + serverURL)

    axios({
            method: 'put',
            baseURL: serverURL,
            withCredentials: true,
            //params: {'password':password},
            data: JSON.stringify({ 'password': password }),
            url: "/login"
        })
        .then(function(response) {

            if (response.status === 200) {
                //console.log("Successfully logged in to server.");
                return callbackSuccess();
            } else {
                console.log("Unsuccessful logging in to server: " + response.statusText);
                return callbackFailure(response.statusText);
            }
        }).catch(function(error) {
            if (error.response) {

                var message = null;

                if (error.response.status === 401) {
                    message = "Incorrect password";
                } else {
                    message = error.message;
                }
                console.log("Error logging in to server: " + message);
                return callbackFailure(message);
            } else {
                console.log("Error logging in to server: " + error.message);
                // Something happened in setting up the request that triggered an Error 
                return callbackFailure("No server found at URL");
            }
        });
}

// Call the logout endpoint which removes the cookie for the server
function unAuthenticate(callback) {

    var serverURL = localStorage.getItem("server_url");

    //console.log("Calling unAuthenticate for URL: " + serverURL);

    var url = serverURL + "/logout";

    axios({
            method: 'get',
            baseURL: serverURL,
            withCredentials: true,
            url: "/logout"
        })
        .then(function(response) {
            return callback(true);
        }).catch(function(error) {
            return callback(false);
        });
}
