const connectionString = 'ws://' + window.location.host + '/ws/chat/';
const chatSocket = new WebSocket(connectionString);

function connect() {
    chatSocket.onopen = function open() {
        console.log('WebSockets connection created.');
        // on websocket open, send the START event.
        chatSocket.send(JSON.stringify({
            "event": "START",
            "message": "Client -> Server -> Client"
        }));
    };

    chatSocket.onclose = function (e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function () {
            connect();
        }, 1000);
    };
    // Sending the info about the room
    chatSocket.onmessage = function (e) {
        // On getting the message from the server
        // Do the appropriate steps on each event.
        let data = JSON.parse(e.data);
        data = data["payload"];
        let message = data['message'];
        let event = data["event"];
        switch (event) {
            case "START":
                alert(message);
                break;
            case "END":
                alert(message);
                break;
            case "MOVE":
                alert(message);
                break;
            default:
                console.log("No event")
        }
    };

    if (chatSocket.readyState == WebSocket.OPEN) {
        chatSocket.onopen();
    }
}

//call the connect function at the start.
connect();