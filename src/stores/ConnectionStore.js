import { EventEmitter } from "events";
import dispatcher from '../dispatcher'
import * as ConnectionActions from '../actions/ConnectionActions'
import RobotWebsocket from '../helpers/RobotWebsocket'

class ConnectionStore extends EventEmitter {

    isConnecting( ) {
        return  ['SERVER_AUTHENTICATING', 'SERVER_CONNECTING'].indexOf(this.state.state) != -1;

    }
    isConnected( ) {
        return  ['SERVER_CONNECTED'].indexOf(this.state.state) != -1;
    }
    
    isAuthenticated( ) {
        return ['SERVER_CONNECTING', "SERVER_LOGGED_IN", 'SERVER_CONNECTED'].indexOf(this.state.state) != -1;
    }
    
    getDescription() {
        return this.state.description;
    }

    getState() {
        return this.state.state;
    }

//--------------------------------------------------------------------------------
//
// HELPERS BELOW
//
//--------------------------------------------------------------------------------

    constructor() {
        super();

        this.state = {
            state: 'DISCONNECTED',
            description: ''
        }

        RobotWebsocket.isConnected(() => {
                this.updateState(true, true, 'SERVER_CONNECTED', '');
            },
            () => {
                ConnectionActions.isAuthenticated(() => {
                        this.updateState('SERVER_LOGGED_IN', '');
                    },
                    () => {
                        // Do nothing. We are still disconnected
                    });
            }
        )

    }

    updateState(state, description) {

        //console.log("CONNECTION STORE UPDATED: ", state, ' ', description);
        this.state.description = description;
        this.state.state = state;
        this.emit('CHANGED');
    }

    handleActions(action) {
        switch (action['type']) {
            case "SERVER_CONNECTION_ERROR":
                {
                    this.updateState(action['type'], action['message']);
                    break;
                }
            case "SERVER_AUTHENTICATING":
                {
                    this.updateState(action['type'], action['message']);
                    break;
                }
            case "SERVER_CONNECTING":
                {
                    this.updateState(action['type'], action['message']);
                    break;
                }
            case "SERVER_LOGGED_IN":
                {
                    this.updateState(action['type'], '');
                    break;
                }
            case "SERVER_CONNECTED":
                {
                    this.updateState(action['type'], '');
                    break;
                }
            case "SERVER_DISCONNECTED":
            {
                    this.updateState(action['type'], '');
                    break;
            }
        }
    }

}

const connectionStore = new ConnectionStore;
dispatcher.register(connectionStore.handleActions.bind(connectionStore));

export default connectionStore;
