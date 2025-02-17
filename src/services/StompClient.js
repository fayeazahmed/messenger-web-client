import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class StompClientHandler {
    constructor(url, jwt, username, setNotifications, setNewMessages, setConnections) {
        this.url = url;
        this.jwt = jwt
        this.username = username
        this.setNotifications = setNotifications
        this.setNewMessages = setNewMessages;
        this.client = null;
        this.setConnections = setConnections
        this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
        this.handleOnlineNotification = this.handleOnlineNotification.bind(this);
        this.handleOfflineNotification = this.handleOfflineNotification.bind(this);
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

    sendMessage(sender, recipient, text, connection) {
        this.client.send("/app/chat", {}, JSON.stringify({ text, recipient, sender, connection }))
    }

    onConnected = (frame) => {
        this.client.subscribe(`/user/queue/reply`, this.handleIncomingMessage)
        this.client.subscribe(`/user/queue/user-online`, this.handleOnlineNotification)
        this.client.subscribe(`/user/queue/user-offline`, this.handleOfflineNotification)
    }

    handleIncomingMessage(message) {
        let newMessage = JSON.parse(message.body)
        console.log("Incoming private message:");
        console.log(newMessage);
        newMessage = {
            ...newMessage,
            isSender: false,
            isNotified: false
        }
        this.setNotifications(prev => [...prev,
        {
            message: `@${newMessage.sender}: ${newMessage.text}`,
            connection: newMessage.connection
        }
        ])
        this.setNewMessages(messages => [...messages, newMessage])
    }

    handleOnlineNotification(message) {
        console.log("Online user:");
        console.log(message.body);
        const username = message.body

        this.setConnections(connections => connections.map(connection => {
            if (connection.receiver.username === username || connection.sender.username === username) {
                return { ...connection, isOnline: true };
            }
            return connection;
        })
        );
    }

    handleOfflineNotification(message) {
        console.log("Offline user:");
        console.log(message.body);
        const username = message.body

        this.setConnections(connections => connections.map(connection => {
            if (connection.receiver.username === username || connection.sender.username === username) {
                return { ...connection, isOnline: false };
            }
            return connection;
        })
        );
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
