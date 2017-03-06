import dispatcher form "../dispatcher";


export function setPosition(servoName, angle, speed) {
    dispatcher.dispatch({
        type:"set_servo_position",
        name:servoName,
        angle:angle,
        speed:speed
    });
}