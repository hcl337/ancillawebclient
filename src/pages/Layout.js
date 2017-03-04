import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import { hashHistory } from 'react-router';

import { unauthenticate } from '../helpers/RobotAuthenticate'
import RobotWebsocket from '../helpers/RobotWebsocket'


export default class Layout extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false
        };
    }

    handleToggle = () => {
        this.setState({ openDrawer: !this.state.openDrawer });
    }

    logOut = () => {
        this.setState({"openDrawer":false})
        unauthenticate(function() {
            hashHistory.push('/login');
        });
    }

    shutdown = () => {
        this.setState({"openDrawer":false})

        const msg = { 'message': 'shutdown' }
        RobotWebsocket.instance().sendMessage(msg, function() {
            hashHistory.push('/login');
        });

    }

    leftDrawer = () => {
        return (
            <Drawer 
                docked={false}
                width={200} 
                open={this.state.openDrawer} 
                onRequestChange={(openDrawer) => this.setState({openDrawer})}
            >
                <AppBar 
                    title="Controls" 
                    onTouchTap={this.handleToggle}/>
                <MenuItem onTouchTap={this.logOut}>Log out</MenuItem>
                <MenuItem onTouchTap={this.shutdown}>Shutdown Robot</MenuItem>
            </Drawer>
        );
    }

    render() {


        return (
            <div>
                <header>
                    <AppBar title="AC | 3" onTouchTap={this.handleToggle}/>
                </header>
                {this.leftDrawer()}
                {this.props.children}
            </div>
        );
    }


}
