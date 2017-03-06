//import RobotMessageHandlers from './RobotMessageHandlers';
import dispatcher from '../dispatcher'
import { hashHistory } from 'react-router';

let websocketInstance = null;

export default class RobotWebsocket {

    // hardReset is a boolean which will ask for a new instance of the 
    // web socket connection if the last one broke
    constructor(host, hardReset) {
        // Only log in 
        if (!websocketInstance || hardReset) {
            websocketInstance = this;

            if (host == null) {
                throw new Error("Must specify a 'host' when creating the websocket");
            }

            var wsHost = RobotWebsocket.formatWSHost(host);

            console.log("Connecting to WS location: " + wsHost);
            try {
                this.socket = new WebSocket(wsHost);
                this.socket.onopen = this.onopen.bind(this);
                this.socket.onclose = this.onclose.bind(this);
                this.socket.onmessage = this.onmessage.bind(this);
                this.socket.onerror = this.onerror.bind(this);
            } catch (exception) {
                console.log("Error connecting to web socket: " + exception);
            }
            console.log("Created new web socket instance");
        } else {
            console.log("Already connected to web socket instance");
        }
        return websocketInstance;
    }


    static instance( )
    {
        return websocketInstance;
    }
    /* 

    Check if we are actually connected
    
    */
    static isConnected(callbackSuccess, callbackFailure) {
        if (websocketInstance != null &&
            websocketInstance.socket != null &&
            websocketInstance.socket.readyState === 1) {
            console.log("isConnected - Websocket is connected.")
            return callbackSuccess();
        } else {
            console.log("isConnected - Websocket is NOT connected.")
            return callbackFailure();
        }

    }

    /*
    Send a message to the server. You must send it in as a 
    dictionary with a 'type' variable at the minimum
    */
    sendMessage(message, callback) {

        if (websocketInstance.socket) {
            if (! ('type' in message)) {
                throw new Error("websocket message must contain 'type' key");
            }

            websocketInstance.socket.send(JSON.stringify(message));

            if (callback) {
                return callback(message);
            }
        } else {
            throw new Error("Not connected to websocket");
        }
    }


    /*
    Disconnect from the web socket
    */
    close() {
        if (websocketInstance && websocketInstance.socket) {
            websocketInstance.socket.close();
            //websocketInstance.socket = null;
            //websocketInstance = null;
        }
    }


    /*********************************************************************/
    /* HELPERS
    /*********************************************************************/

    onopen(evt) {
        console.log("WebSocket onopen event called");
    }

    onerror(evt) {

        console.log("Received Web Socket error: " + evt.type + " " + evt.code + " " + evt.name + " " + evt.message);
        console.log(evt);
        websocketInstance.close();
    }

    onmessage(evt) {

        var msg = evt.data;

        msg = JSON.parse(msg);

        console.log("Web Socket Received message: " + msg['type'].toUpperCase());

        msg['type'] = msg['type'].toUpperCase();
        dispatcher.dispatch( msg )
    }

    onclose(evt) {

        console.log("Closing websocket connection.");
        if(!evt.wasClean)
        {
            console.log("WebSocket onclose event called with error: ", evt.code, evt.reason, evt);
        }
        if (websocketInstance) {
            if (websocketInstance.socket) {
                websocketInstance.socket = null;
            }
            websocketInstance = null;
        }        

        hashHistory.push('/login');
    }

    /*
      We need to convert the http:// to ws:// and add our /websocket endpoint
    */
    static formatWSHost(host) {
        return host.replace("https://", "ws://").replace('http://', 'ws://') + '/websocket'
    }

    /*
        receiveMessage(evt) {
            const handlers = {
                'presence_change': MessageActions.processPresenceChange,
                message: MessageActions.processMessage,
                job: MessageActions.processJob,
                notification: MessageActions.processNotification
            };
            if (messageData.type in handlers) {
                handlers[messageData.type](messageData, callback);
            } else {
                callback(new Error('No handler for message type ' + messageData.type));
            }
        }
        */
}
