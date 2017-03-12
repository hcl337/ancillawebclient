import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import { hashHistory } from 'react-router';

import { unauthenticate } from '../helpers/RobotAuthenticate'
import RobotWebsocket from '../helpers/RobotWebsocket'
import * as ConnectionActions from '../actions/ConnectionActions'
import ConnectionStore from '../stores/ConnectionStore'


export default class Layout extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false
        };
        this.updateConnection = this.updateConnection.bind(this)
    }

    handleToggle = () => {
        this.setState({ openDrawer: !this.state.openDrawer });
    }

    logOut = () => {
        this.setState({"openDrawer":false})
        ConnectionActions.logout();
        //unauthenticate(function() {
        //    hashHistory.push('/login');
        //});
    }

    shutdown = () => {
        this.setState({"openDrawer":false})

        ConnectionActions.shutdownRobot();

    }

    // Each time the ConnectionStore changes, this wil lbe called and it
    // will try to connect everything together.
    updateConnection = () => {
        if( ConnectionStore.getState() === 'SERVER_DISCONNECTED' )
        {
            console.log("Server disconnected so layout page moving to /login");
            hashHistory.push('/login');
        }
    }    

    componentWillMount() {
        ConnectionStore.on("CHANGED", this.updateConnection)
    }

    componentWillUnmount() {
        ConnectionStore.removeListener("CHANGED", this.updateConnection)
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
                <MenuItem onTouchTap={this.shutdown}>Shutdown Robot</MenuItem>
                <Divider />
                <MenuItem onTouchTap={this.logOut}>Log out</MenuItem>
                <Divider />
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
