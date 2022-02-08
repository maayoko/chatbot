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
            showThreeDots();
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

    function showThreeDots() {
        const div = document.createElement("div");
        div.className = "message stark dots";
        div.innerHTML = `
            <div class="typing typing-1"></div>
            <div class="typing typing-2"></div>
            <div class="typing typing-3"></div>
        `.trim()

        chatElement.appendChild(div);
        chatElement.scrollTop = chatElement.scrollHeight - chatElement.clientHeight;
    }

    function removeThreeDots() {
        const dots = document.querySelector(".dots")
        chatElement.removeChild(dots);
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
                    console.log(message);
                    break;
                case "END":
                    console.log(message);
                    break;
                case "MESSAGE":
                    removeThreeDots();
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