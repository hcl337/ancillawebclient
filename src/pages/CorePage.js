import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton'
import RobotWebsocket from '../helpers/RobotWebsocket'
import Paper from 'material-ui/Paper'
import { Page, Box } from 'react-layout-components'

import VideoDisplayComponent from './corepage/VideoDisplayComponent'
import ServoControllersComponent from './corepage/ServoControllersComponent'

import Layout from './Layout'

export default class CorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    startTalking = () => {
        const msg = { 'type': 'send_state', 'enable': true, 'mps': 4 }
        RobotWebsocket.instance().sendMessage(msg)
    }

    stopTalking = () => {
        const msg = { 'type': 'send_state', 'enable': false, 'mps': 4 }
        RobotWebsocket.instance().sendMessage(msg)
    }

    render() {

        return (
            <Layout>
          <Box column className="wrapper">
            <Box className="corepanels" >
              <VideoDisplayComponent />
              <ServoControllersComponent  />
            </Box>
            <Paper style={{minHeight:100, margin:5, padding:5}}>
              <RaisedButton onClick={this.startTalking}>Talk</RaisedButton>
              <RaisedButton onClick={this.stopTalking}>Stop</RaisedButton>
            </Paper>
          </Box>
          </Layout>

        );
    }


}
