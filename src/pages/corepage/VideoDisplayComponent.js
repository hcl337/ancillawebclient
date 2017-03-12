import React from 'react';
import ReactDOM from 'react-dom';
import Box from 'react-layout-components'
import Paper from 'material-ui/Paper'

import { Layer, Rect, Stage, Group, Image, Text} from 'react-konva';

import VisionStore from '../../stores/VisionStore'
import StateStore from '../../stores/StateStore'



const styles = {
    wrapper: {
        //background: 'red',
        //borderStyle: 'solid',
        minHeight: 400,
        flex: '1 1 auto',
        alignItems: 'stretch',
        //height: '100%',
        //width: '100%',
        //margin:0, 
        //padding:0
    }
}

export default class VideoDisplayComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'frame': null,
            'image': new window.Image(),
            'imagehash': 0,
            'state': null
        };

        this.updateFrame = this.updateFrame.bind(this);
    }

    componentDidMount() {
        //this.setState({ image: new window.Image() });
        //console.log("STATE ON MOUNT: ", this.stageComponent );

        //console.log("DOM: ", ReactDOM.findDOMNode(this).getBoundingClientRect());

        this.node = ReactDOM.findDOMNode(this);
    }



    componentWillMount() {
        VisionStore.on("ENVIRONMENT_CAMERA_FRAME", this.updateFrame);
        //StateStore.on("UPDATED", this.updateFrame)
    }

    componentWillUnmount() {
        VisionStore.removeListener("ENVIRONMENT_CAMERA_FRAME", this.updateFrame);
        //StateStore.removeListener("UPDATED", this.updateFrame)
    }


    updateFrame() {
        //console.log("Got new frame");
        if (VisionStore.getEnvironmentFrame() != null)
            this.state.image.src = 'data:image/jpeg;base64,' + VisionStore.getEnvironmentFrame()['image_data'];

        this.setState({
            frame: VisionStore.getEnvironmentFrame(),
            image: this.state.image,
            imagehash: this.hashCode(this.state.image.src),
            state: StateStore.getState()
        });

        //console.log(this.state.state.vision.faces)
    }
    hashCode(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    }    

    render() {
        //if (this.state.frame != null) {
        //console.log(this.state.frame)
        //var imageData = 'data:image/jpeg;base64,' + this.state.frame['image_data'];

        if (this.state.frame === null) {
            return (
                <Box column style={styles.wrapper}>
                <h1> No video </h1>
            </Box>
            )
        }

        //console.log("FRAME DATA HASH: " + this.hashCode(this.state.image.src));

        const imageWidth = this.state.frame['width']
        const imageHeight = this.state.frame['height']
        const imageRatio = imageHeight / imageWidth

        var stageRect = /*{'width':1280, 'height':720};//*/this.node.getBoundingClientRect();
        var stageWidth = stageRect.width;
        var stageHeight = stageRect.height;
        //console.log(stageWidth, ' ', stageHeight, this.state.image);


        const face_boxes = Object.values(this.state.state.vision.faces).map(
          (face) => {
            return (
                    <Group key={face['x'] + face['y']}>
                        <Text x={face['x']} y={face['y']} text={face['name']} fontSize={30} fill={'blue'}/>
                        <Text x={face['x']} y={face['y'] + 35} text={face['orientation']} fontSize={30} fill={'blue'}/>
                        <Rect x={face['x']} y={face['y']} width={face['width']} height={face['height']} stroke={'blue'}/>
                    </Group>
                )
        });

        return (
            <Box column style={styles.wrapper} >
                <Stage width={stageHeight/imageRatio} height={stageHeight}>
                    <Layer>
                        <Image 
                            image={this.state.image}
                            hashToForceUpdate={this.state.imagehash}
                        />
                    </Layer>
                    <Layer>
                        {face_boxes}
                    </Layer>
                </Stage>
            </Box>
        )

    };


}
