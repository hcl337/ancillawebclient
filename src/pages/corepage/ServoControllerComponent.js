import React from 'react';
import Box from 'react-layout-components'

import Slider from 'material-ui/Slider'
import Paper from 'material-ui/Paper'

import StateStore from '../../stores/StateStore'


const styles = {
    wrapper: {
        alignItems: 'stretch',
        justifyContent: 'center',
        //padding: "0px 20px 0px 20px",
        margin: "5px 0px 5px 0px"
    },
    slider: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 0,
        marginTop: 0,
        marginBottom: 0,
        minWidth: 250,
        fontSize: "0.5em"
    },
    servoheaders: {
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingLeft: 10,
        paddingRight: 10,
        minWidth: "400px",
        width: "20%"
    },
    servobounds: {
        justifyContent: 'space-between',
        padding: "0px 10px 0px 10px",
        margin: "0px 0px 0px 0px",
        fontSize: "0.5em"
    }

}
export default class ServoControllerComponent extends React.Component {

    static propTypes = {
        name: React.PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            servo: StateStore.getServos()[this.props.name],
            requested_speed: StateStore.getServos()[this.props.name]['requested_speed'],
            requested_angle: StateStore.getServos()[this.props.name]['requested_angle'],
        }
    }

    onAngleSliderChange = (evt, value) => {
        this.setState({ requested_angle: value })
        console.log("Angle slider changed: " + this.state.requested_angle)
    }

    onSpeedSliderChange = (evt, value) => {
        this.setState({ requested_speed: value })
        console.log("Speed slider changed: " + this.state.requested_speed)
    }


    componentWillMount() {
        StateStore.on("UPDATED", () => {    
            //console.log("Upating " + this.props.name)
            //console.log(StateStore.getServos())
            this.setState({ 'servo': StateStore.getServos()[this.props.name] });
        })
    }


    render() {

        //console.log(this.state.requested_speed)
        return (
            <Paper style={styles.wrapper}>
                <Box column >
                    <Box row style={styles.servoheaders}>
                        <p>{this.props.name}</p>
                        <p>{this.state.servo.current_angle} deg</p>
                        <p>{this.state.servo.current_speed} deg/s</p>
                    </Box>
                    <Box style={styles.slider}>
                        <p style={styles.servobounds}>{this.state.servo.min_angle} deg</p>
                        <Slider 
                            min={this.state.servo.min_angle}
                            max={this.state.servo.max_angle}
                            value={this.state.requested_angle}
                            onChange={this.onAngleSliderChange}
                            sliderStyle={styles.slider}/>
                        <p style={styles.servobounds}>{this.state.servo.max_angle} deg</p>
                    </Box>
                    <Box style={styles.slider}>
                        <p style={styles.servobounds}>1 deg/s</p>
                        <Slider 
                            min={1}
                            max={this.state.servo.max_speed}
                            value={this.state.requested_speed}
                            onChange={this.onSpeedSliderChange}
                            sliderStyle={styles.slider}/>
                        <p style={styles.servobounds}>{this.state.servo.max_speed} deg/s</p>
                    </Box>
                </Box>
            </Paper>
        );
    }
}
