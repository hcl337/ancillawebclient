import dispatcher from "../dispatcher";
import StateStore from '../stores/StateStore'
import RobotWebsocket from '../helpers/RobotWebsocket'

export function setAngle(servoName, angle) {


    const msg = {
        'type': 'SET_SERVO_POSITION',
        'servo_name': servoName,
        'angle': angle,
        'speed': StateStore.getServos()[servoName]['requested_speed']
    }
    RobotWebsocket.instance().sendMessage(msg, () => {} );
}

export function setSpeed(servoName, speed) {

    
    const msg = {
        'type': 'SET_SERVO_POSITION',
        'servo_name': servoName,
        'angle': StateStore.getServos()[servoName]['requested_angle'],
        'speed': speed
    }
    RobotWebsocket.instance().sendMessage(msg, () => {} );
}

export function setAngleAndSpeed(servoName, angle, speed) {

    const msg = {
        'type': 'SET_SERVO_POSITION',
        'servo_name': servoName,
        'angle': angle,
        'speed': speed
    }
    RobotWebsocket.instance().sendMessage(msg, () => {} );
}