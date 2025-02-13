import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class StompClientHandler {
    constructor(url, jwt, username, setNewMessages) {
        this.url = url;
        this.jwt = jwt
        this.username = username
        this.setNewMessages = setNewMessages;
        this.client = null;
    }

    connect() {
        const socket = new SockJS(this.url + "?jwt=" + this.jwt);
        this.client = Stomp.over(socket);
        const header = {
            "Auth-Token": this.jwt
        }
        this.client.connect(header, this.onConnected, this.onError);
        this.client.activate();
    }

    sendMessage(sender, recipient, text) {
        this.client.send("/app/chat", {}, JSON.stringify({ text, recipient, sender }))
    }

    onConnected = (frame) => {
        this.client.subscribe(`/user/queue/reply`, message => {
            console.log(message);
            let newMessage = JSON.parse(message.body)
            console.log("Incoming private message:");
            console.log(newMessage);
            newMessage = {
                ...newMessage,
                isSender: false,
                isNotified: false
            }
            this.setNewMessages(messages => [...messages, newMessage])
        })
    }

    onError = error => {
        console.log(error);
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

export default StompClientHandler;
