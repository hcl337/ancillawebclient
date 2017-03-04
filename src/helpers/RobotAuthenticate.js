import axios from 'axios';

export function isAuthenticated(callbackSuccess, callbackFailure) {

    var serverURL = localStorage.getItem("server_url");

    console.log("Calling isAuthenticated for " + serverURL)

    if (serverURL == null) {
        return callbackFailure();
    }

    axios({
        method:'get',
        baseURL: serverURL,
        //headers: {'cookies':}
        withCredentials: true,
        url:serverURL})
        .then(function(response) {
            if (response.status === 200) {
                console.log("isAuthenticated: true")
                return callbackSuccess();
            } else {
                console.log("isAuthenticated: false")
                return callbackFailure();
            }
        }).catch(function(error) {
            console.log("isAuthenticated: false")
            return callbackFailure();
        });
}



export function authenticate(serverURL, password, callbackSuccess, callbackFailure) {

    console.log("Calling authenticate to log in for " + serverURL)

    axios({
            method:'put',
            baseURL: serverURL,
            withCredentials: true,
            //params: {'password':password},
            data: JSON.stringify({'password':password}),
            url: "/login"
        })
        .then(function(response) {

            if (response.status === 200) {
                console.log("Successfully logged in to server.");
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


export function unauthenticate(callback) {

    var serverURL = localStorage.getItem("server_url");

    console.log("Calling unAuthenticate for URL: " + serverURL);

    var url = serverURL + "/logout";

    axios({
            method:'get',
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
