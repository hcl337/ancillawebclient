import React from 'react';

import "./App.css"

// Add Material UI
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Box from 'react-layout-components' 
import Page from 'react-layout-components' 
import VBox from 'react-layout-components' 

import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

import VideoDisplayComponent from './components/VideoDisplayComponent';
import ServoControllersComponent from './components/ServoControllersComponent';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => (
   <MuiThemeProvider>
    <Page column className="wrapper">
        <AppBar 
          title="Ancilla | Three Web Client"/>
      <Box className="corepanels" >
        <VideoDisplayComponent />
        <ServoControllersComponent  />
      </Box>
      <Paper style={{minHeight:100, margin:5, padding:5}}>
        BOTTOM
      </Paper>
    </Page>
     </MuiThemeProvider>
);


//      <VideoDisplayComponent flex="5 1 auto"/>
//      <ServoControllersComponent flex="1 1 auto"/>

const styles = {
  wrapper: {
    background: 'gray',
    //padding: "10px",
    margin: "0px",
    height: "1000px"//"100% !important" // !important
  },
  bottom: {
    background: 'green',
    borderStyle: 'solid'
  },
  top: {
    background: 'blue',
    borderStyle: 'solid'
  }
}


export default App