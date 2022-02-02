(function() {
    const connectionString = 'ws://' + window.location.host + '/ws/chat/';
    const chatSocket = new WebSocket(connectionString);

    const inputElement = document.getElementById("chat-input");
    const chatElement = document.getElementById("chat");

    function onInputSubmit(event) {
        enterKeyCode = 13;
        if (event.which === enterKeyCode) {
            userInput = event.target.value

            updateUserInputs(userInput);
            chatSocket.send(JSON.stringify({
                event: "MESSAGE",
                message: userInput
            }));
            inputElement.value = "";
        }
    }

    inputElement.addEventListener("keydown", onInputSubmit);

    function updateUserInputs(message) {
        const div = document.createElement("div");
        div.className = "message parker"
        div.innerText = message;
        chatElement.appendChild(div);
        chatElement.scrollTop = chatElement.scrollHeight - chatElement.clientHeight;
    }

    function updateChatBotResponses(response) {
        const div = document.createElement("div");
        div.className = "message stark"
        div.innerText = response;
        chatElement.appendChild(div);
        chatElement.scrollTop = chatElement.scrollHeight - chatElement.clientHeight;
    }

    function connect() {
        chatSocket.onopen = function open() {
            console.log('WebSockets connection created.');
            // on websocket open, send the START event.
            chatSocket.send(JSON.stringify({
                "event": "START",
                "message": "Client -> Server -> Client"
            }));
        };

        chatSocket.onclose = function(e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function() {
                connect();
            }, 1000);
        };
        // Sending the info about the room
        chatSocket.onmessage = function(e) {
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
                case "MESSAGE":
                    updateChatBotResponses(message);
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
})()