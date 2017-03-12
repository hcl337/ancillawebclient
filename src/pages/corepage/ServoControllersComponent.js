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
        // Need to bind to this so we have a single reference we
        // can add and subtract.
        this.updateState = this.updateState.bind(this)
    }

    updateState = () => {
        //console.log("Upating " + this.props.name)
        //console.log(StateStore.getServos())
        this.setState({ 'servos': StateStore.getServos() });
    }

    componentWillMount() {
        StateStore.on("UPDATED", this.updateState)
    }

    componentWillUnmount() {
        StateStore.removeListener("UPDATED", this.updateState)
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
