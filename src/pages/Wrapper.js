import React from 'react';
import { browserHistory, Link } from 'react-router';

import customTheme from '../helpers/MaterialTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { unauthenticate } from '../helpers/RobotAuthenticate'
import RobotWebsocket from '../helpers/RobotWebsocket'

import Layout from './Layout'
import Paper from 'material-ui/Paper'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


export default class Wrapper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    logOut = () => {
        var self = this;
        // Close our singleton
        RobotWebsocket.isConnected(function() {
            new RobotWebsocket().close();
        }, function() {});
        //Give it a second to log out
        setTimeout(function() { unauthenticate(function() { self.props.router.push('/login'); }); }, 10);
    }

    render() {

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                {this.props.children}
           </MuiThemeProvider>
        );
    }


}
