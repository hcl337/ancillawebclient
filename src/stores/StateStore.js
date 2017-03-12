import { EventEmitter } from "events";
import dispatcher from '../dispatcher'

class StateStore extends EventEmitter {

    getState() {
        return this.state;
    }

    getServos() {
        return this.state.movement.servos;
    }

//--------------------------------------------------------------------------------
//
// HELPERS BELOW
//
//--------------------------------------------------------------------------------

    constructor() {
        super();

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

    handleActions(action) {
        switch (action['type']) {
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
