import React from 'react';
import Box from 'react-layout-components' 

import Slider from 'material-ui/Slider'

import './ServoControllerComponent'

const ServoControllerComponent = () => (
    <Box column className="wrapper">
        <Box row style={styles.servoheaders}>
            <h3>Head Rotate</h3>
            <p>12.5 deg</p>
            <p>5 deg/s</p>
        </Box>
        <Slider 
            min={-90}
            max={90}
            defaultValue={5}
            sliderStyle={styles.slider}/>
        <Box row style={styles.servobounds}>
            <p >-30 deg</p>
            <p>18</p>
            <p >30 deg</p>
        </Box>
        <Slider 
            min={1}
            max={180}
            defaultValue={5}
            sliderStyle={styles.slider}/>
        <Box row style={styles.servobounds}>
            <p>1 deg/s</p>
            <p>18</p>
            <p>180 deg/s</p>
        </Box>
    </Box>

);


const styles = {
  wrapper: {
    alignItems:'stretch',
    justifyContent:'center',
    //padding: "0px 20px 0px 20px",
    //margin: "0px 20px 0px 20px"
  },
  slider: {
    width: '100%',
    paddingTop:0,
    paddingBottom:0,
    //paddingRight:20,
    marginTop:0,
    marginBottom:0
  },
  servoheaders: {
    justifyContent: 'space-around',
    alignItems: 'baseline',
    minWidth:"400px",
    width:"20%"
  },
  servobounds: {
    justifyContent: 'space-between',
    padding: "0px 20px 0px 20px",
    margin: "0px 0px 0px 0px",
    fontSize: "0.5em"
  }
}

export default ServoControllerComponent;