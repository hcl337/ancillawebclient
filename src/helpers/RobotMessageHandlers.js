/*
    setSpeed: function( degrees_per_second) {
        this.degrees_per_second = degrees_per_second;
    },

    move: function (servo_name, angle, speed) {
        console.log("Requesting servo move!");
        var message = {"message":"set_servo_position", "servo_name":servo_name, "angle":angle, "speed":speed }
        this.socket.send(JSON.stringify(message));
    },
    // Requests video stream
    enableEnvironmentCamera: function ( enable ) {
        console.log("Requesting env video stream!");
        var message = {"message":"send_environment_camera", "fps":5, "enable":enable }
        this.socket.send(JSON.stringify(message));
    },
    // Requests video stream
    enableFocusCamera: function ( enable ) {
        console.log("Requesting focus video stream!");
        var message = {"message":"send_focus_camera", "fps":5, "enable":enable }
        this.socket.send(JSON.stringify(message));
    },
    shutdown: function () {
        console.log("MESSAGE: Shut down!");
        var message = {"message":"shutdown"}
        this.socket.send(JSON.stringify(message));
        document.body.innerHTML = "<h1>Server Shut Down</h1>"
    },
    // Requests video stream
    enableState: function ( enable ) {
        console.log(enable)
        var message = {"message":"send_state", "enable":enable, "mps":10 }
        message = JSON.stringify(message)
        console.log("Requesting state stream: " + message);
        this.socket.send(message);
    }

*/