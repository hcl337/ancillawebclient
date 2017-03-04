import React from 'react';
import Box from 'react-layout-components'

import Paper from 'material-ui/Paper'

const styles = {
    wrapper: {
        //background: 'red',
        //borderStyle: 'solid',
        minHeight: 400,
        flex: '1 1 auto',
        //margin:0, 
        //padding:0
    }
}

export default class VideoDisplayComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box column style={styles.wrapper}>
              <Paper style={{flex:"1 0 auto", margin:"5px"}}>    
                <h2 style={{flex:"0 0 auto"}}>Environment Video</h2>
              </Paper>
            </Box>
        )
    };
}
