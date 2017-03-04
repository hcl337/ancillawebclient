import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import CorePage from './pages/CorePage';
import Wrapper from './pages/Wrapper';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

import RobotWebsocket from './helpers/RobotWebsocket'

import './index.css';


function requireAuth(nextState, replace) {
    RobotWebsocket.isConnected(function() {},
        function() {
            console.log("RequiredAuth Route: Not logged in so moving to login.");
            replace({
                pathname: '/login'
            })
        });
}


const app = document.getElementById('root');

ReactDOM.render(

    <Router history={hashHistory}>
        <Route path="/" component={Wrapper}>
            <Route path="login" component={LoginPage}></Route>
            <IndexRoute component={CorePage} onEnter={requireAuth}></IndexRoute>
            <Route path="core" component={CorePage} onEnter={requireAuth}></Route>
            <Route path="settings" component={SettingsPage} onEnter={requireAuth}></Route>
        </Route>
    </Router>,
    app);
