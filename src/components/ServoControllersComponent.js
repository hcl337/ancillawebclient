import React from 'react';

import ScrollView from 'react-layout-components' 
import VBox from 'react-layout-components' 

import Paper from 'material-ui/Paper';

import ServoControllerComponent from './ServoControllerComponent';

const styles = {
    wrapper: {
        flex:'0 1 300px'
    }
}

const ServoControllersComponent = () => (
      <Paper style={{margin:5, padding:5}}>
          <ScrollView column style={styles.wrapper}>
            <ServoControllerComponent />
            <ServoControllerComponent />
            <ServoControllerComponent />
            <ServoControllerComponent />
          </ScrollView>
      </Paper>
);



export default ServoControllersComponent;