import React from 'react';

import Box from 'react-layout-components'

import Paper from 'material-ui/Paper';

import ServoControllerComponent from './ServoControllerComponent';

import StateStore from '../../stores/StateStore'

const styles = {
    wrapper: {
        flex: '0 1 300px',
    }
}

export default class ServoControllersComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            servos: StateStore.getServos()
        }
    }

    componentWillMount() {
        StateStore.on("UPDATED", () => {
            this.setState({ 'servos': StateStore.getServos() });
        })
    }

    render() {
        const servoComponents = Object.keys(this.state.servos).map(
          (servoName) => {
            return <ServoControllerComponent name={servoName} key={servoName}/>;
        });

        return (
            <Box column style={styles.wrapper}>
            {servoComponents}
          </Box>
        );
    }

}
