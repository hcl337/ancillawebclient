import { EventEmitter } from "events";
import dispatcher from '../dispatcher'

class VisionStore extends EventEmitter {

    /*
    Returns null if no frames have been received or the below
    format. See the API docs to make sure it is up to date.
    
    {
        "type": "ENVIRONMENT_CAMERA_FRAME",
        "image_data": "4a4ag243ADAHFDSH...",  //base64 encoded image data
        "data_type": "image/jpg",
        "width": 640,
        "height": 480
    }
    */
    getEnvironmentFrame() {
        return this.state.environment_frame;
    }

    /*
    Returns null if no frames have been received or the below
    format. See the API docs to make sure it is up to date.
    
    {
        "type": "FOCUS_CAMERA_FRAME",
        "image_data": "4a4ag243ADAHFDSH...",  //base64 encoded image data
        "data_type": "image/jpg",
        "width": 640,
        "height": 480
    }
    */
    getFocusFrame() {
        return this.state.focus_frame;
    }

//--------------------------------------------------------------------------------
//
// HELPERS BELOW
//
//--------------------------------------------------------------------------------
    constructor() {
        super();

        this.state = {
            environment_frame: null,
            focus_frame: null
        }

    }

    updateEnvironmentFrame(frame) {
        this.state.environment_frame = frame;
        this.emit('ENVIRONMENT_CAMERA_FRAME');
    }

    updateFocusFrame(frame) {
        this.state.focus_frame = frame;
        this.emit('FOCUS_CAMERA_FRAME');
    }

    handleActions(action) {
        switch (action['type']) {
            case "ENVIRONMENT_CAMERA_FRAME":
                {
                    //console.log(action);
                    this.updateEnvironmentFrame(action);
                    break;
                }
            case "FOCUS_CAMERA_FRAME":
                {
                    this.updateEnvironmentFrame(action);
                    break;
                }
        }
    }

}

const visionStore = new VisionStore;
dispatcher.register(visionStore.handleActions.bind(visionStore));

export default visionStore;
