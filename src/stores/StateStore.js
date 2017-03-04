import { EventEmitter } from "events";
import dispatcher from '../dispatcher'

class StateStore extends EventEmitter {
    constructor() {
        super();
        this.state = {};

        this.state = {
            
            movement: {
                servos: {
                }
            }
            
        }

    }

    updateState(newState) {
        this.state = newState;
        this.emit('UPDATED');
    }

    getState() {
        return this.state;
    }

    getServos() {
        return this.state.movement.servos;
    }

    handleActions(action) {
        switch (action['message']) {
            case "STATE":
                {
                    this.updateState(action.data);
                }
        }
    }

}

const stateStore = new StateStore;
dispatcher.register(stateStore.handleActions.bind(stateStore));

export default stateStore;
