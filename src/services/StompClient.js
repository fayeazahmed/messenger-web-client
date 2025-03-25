import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class StompClientHandler {
    constructor(url, jwt, username, setNotifications, setNewMessages, setConnections, setReadMessageObj, setTypeMessageObj) {
        this.url = url;
        this.jwt = jwt
        this.username = username
        this.setNotifications = setNotifications
        this.setNewMessages = setNewMessages;
        this.client = null;
        this.setConnections = setConnections
        this.setReadMessageObj = setReadMessageObj
        this.setTypeMessageObj = setTypeMessageObj
        this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
        this.handleOnlineNotification = this.handleOnlineNotification.bind(this);
        this.handleOfflineNotification = this.handleOfflineNotification.bind(this);
        this.handleReadMessage = this.handleReadMessage.bind(this);
        this.handleTypeMessage = this.handleTypeMessage.bind(this);
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

    sendReadMessageNotification(sender, recipient, readAt, chatId) {
        this.client.send("/app/read-message", {}, JSON.stringify({ recipient, sender, readAt, chatId }))
    }

    sendTypeMessageNotification(sender, recipient) {
        this.client.send("/app/type-message", {}, JSON.stringify({ recipient, sender }))
    }

    onConnected = (frame) => {
        this.client.subscribe(`/user/queue/reply`, this.handleIncomingMessage)
        this.client.subscribe(`/user/queue/user-online`, this.handleOnlineNotification)
        this.client.subscribe(`/user/queue/user-offline`, this.handleOfflineNotification)
        this.client.subscribe(`/user/queue/read-message`, this.handleReadMessage)
        this.client.subscribe(`/user/queue/type-message`, this.handleTypeMessage)
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
            connectionId: newMessage.connection.id
        }
        ])
        this.setNewMessages(messages => [...messages, newMessage])
        this.setConnections(connections => connections.map(connection => {
            if (connection.receiver.username === newMessage.sender || connection.sender.username === newMessage.sender) {
                return { ...connection, isOnline: true, lastMessage: (newMessage.sender + ": " + newMessage.text), isUnread: true };
            }
            return connection;
        })
        );
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
                return {
                    ...connection,
                    isOnline: false,
                    receiver: {
                        ...connection.receiver,
                        lastOnlineAt: new Date().toISOString()
                    },
                    sender: {
                        ...connection.sender,
                        lastOnlineAt: new Date()
                    }
                };
            }
            return connection;
        })
        );
    }

    handleReadMessage(message) {
        const readMessageObj = JSON.parse(message.body)
        console.log("Read message update: ");
        console.log(readMessageObj);
        this.setReadMessageObj(readMessageObj)
    }

    handleTypeMessage(message) {
        const typeMessageObj = JSON.parse(message.body)
        console.log("Type message update: ");
        console.log(typeMessageObj);
        this.setTypeMessageObj(typeMessageObj)
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
