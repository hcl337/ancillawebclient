/*
import * as Colors from 'material-ui/styles/colors';

export const customTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.indigo500,
        primary2Color: Colors.indigo700,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.indigo500,
    },
});
*/

//import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as color from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

export const customTheme = darkBaseTheme;
export default {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: color.cyan700,
    primary2Color: color.cyan700,
    primary3Color: color.grey600,
    accent1Color: color.pinkA200,
    accent2Color: color.pinkA400,
    accent3Color: color.pinkA100,
    textColor: color.fullWhite,
    secondaryTextColor: fade(color.fullWhite, 0.3),
    alternateTextColor: '#505050',
    canvasColor: '#303030',
    borderColor: fade(color.fullWhite, 0.3),
    disabledColor: fade(color.fullWhite, 0.3),
    pickerHeaderColor: fade(color.fullWhite, 0.12),
    clockCircleColor: fade(color.fullWhite, 0.12),
  },
  raisedButton: {
    textColor:color.green700,
    color:color.green700,
    primaryTextColor:color.green700
  }
};