let socket;

function connectWS() {
    socket = new WebSocket("ws://192.168.1.50:8081");

    socket.onopen = () => {
        console.log("Connecté au serveur");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
            addMessage(data.username + " : " + data.text);
        }

        if (data.type === "history") {
            data.messages.forEach(msg => {
                addMessage(msg.username + " : " + msg.text);
            });
        }

        if (data.type === "login_success") {
            document.getElementById("chat").style.display = "block";
        }

        if (data.type === "error") {
            alert(data.message);
        }
    };
}

function login() {
    connectWS();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: "login",
            username: username,
            password: password
        }));
    };
}

function register() {
    connectWS();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: "register",
            username: username,
            password: password
        }));
    };
}

function sendMessage() {
    const msg = document.getElementById("msg").value;

    socket.send(JSON.stringify({
        type: "message",
        text: msg
    }));

    document.getElementById("msg").value = "";
}

function addMessage(text) {
    const div = document.getElementById("messages");
    div.innerHTML += "<p>" + text + "</p>";
}
