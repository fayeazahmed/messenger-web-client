import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class StompClientHandler {
    constructor(url, jwt, username, setNotifications, setNewMessages, setNewGroupMessages, setConnections, setGroupChats, setReadMessageObj, setTypeMessageObj, setTypeMessageGroupChatObj) {
        this.url = url;
        this.jwt = jwt
        this.username = username
        this.setNotifications = setNotifications
        this.setNewMessages = setNewMessages;
        this.setNewGroupMessages = setNewGroupMessages;
        this.client = null;
        this.setConnections = setConnections
        this.setGroupChats = setGroupChats
        this.setReadMessageObj = setReadMessageObj
        this.setTypeMessageObj = setTypeMessageObj
        this.setTypeMessageGroupChatObj = setTypeMessageGroupChatObj
        this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
        this.handleIncomingGroupMessage = this.handleIncomingGroupMessage.bind(this);
        this.handleOnlineNotification = this.handleOnlineNotification.bind(this);
        this.handleOfflineNotification = this.handleOfflineNotification.bind(this);
        this.handleReadMessage = this.handleReadMessage.bind(this);
        this.handleTypeMessage = this.handleTypeMessage.bind(this);
        this.handleTypeMessageGroupChat = this.handleTypeMessageGroupChat.bind(this);
        this.handleSentMessage = this.handleSentMessage.bind(this);
        this.handleSentMessageToGroup = this.handleSentMessageToGroup.bind(this);
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

    sendMessageToGroupChat(sender, chatId, text) {
        this.client.send("/app/group-chat", {}, JSON.stringify({ sender, chatId, text }))
    }

    sendReadMessageNotification(sender, recipient, readAt, chatId) {
        this.client.send("/app/read-message", {}, JSON.stringify({ sender, recipient, readAt, chatId }))
    }

    sendTypeMessageNotification(sender, recipient) {
        // this.client.send("/app/type-message", {}, JSON.stringify({ sender, recipient }))
    }

    sendTypeMessageGroupChatNotification(sender, chatId) {
        // this.client.send("/app/type-message-group-chat", {}, JSON.stringify({ sender, chatId }))
    }

    onConnected = (frame) => {
        this.client.subscribe(`/user/queue/sent-message`, this.handleSentMessage)
        this.client.subscribe(`/user/queue/sent-message-group`, this.handleSentMessageToGroup)
        this.client.subscribe(`/user/queue/reply`, this.handleIncomingMessage)
        this.client.subscribe(`/user/queue/group-reply`, this.handleIncomingGroupMessage)
        this.client.subscribe(`/user/queue/user-online`, this.handleOnlineNotification)
        this.client.subscribe(`/user/queue/user-offline`, this.handleOfflineNotification)
        this.client.subscribe(`/user/queue/read-message`, this.handleReadMessage)
        this.client.subscribe(`/user/queue/type-message`, this.handleTypeMessage)
        this.client.subscribe(`/user/queue/type-message-group-chat`, this.handleTypeMessageGroupChat)
    }

    handleSentMessage(message) {
        let newMessage = JSON.parse(message.body)
        console.log("Sent private message:");
        console.log(newMessage);
        newMessage = {
            ...newMessage,
            isSender: true,
            isNotified: false
        }
        this.setNewMessages(messages => [...messages, newMessage])
        this.setConnections(connections => connections.map(connection => {
            if (connection.receiver.username === newMessage.sender.username || connection.sender.username === newMessage.sender.username) {
                return { ...connection, lastMessage: (newMessage.sender.username + ": " + newMessage.text), isUnread: false };
            }
            return connection;
        })
        );
    }

    handleSentMessageToGroup(message) {
        let newGroupMessage = JSON.parse(message.body)
        console.log("Sent group message:");
        console.log(newGroupMessage);
        newGroupMessage = {
            ...newGroupMessage,
            isSender: true,
            isNotified: false
        }
        this.setNewGroupMessages(messages => [...messages, newGroupMessage])
        this.setGroupChats(chats => chats.map(chat => {
            if (chat.id === newGroupMessage.id) {
                return { ...chat, lastMessage: ("You: " + newGroupMessage.text) };
            }
            return chats;
        })
        );
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
                return { ...connection, isOnline: true, lastMessage: (newMessage.sender + ": " + newMessage.text), isUnread: true, isReadByConnection: false };
            }
            return connection;
        })
        );
    }

    handleIncomingGroupMessage(message) {
        let newGroupMessage = JSON.parse(message.body)
        console.log("Incoming group message:");
        console.log(newGroupMessage);
        newGroupMessage = {
            ...newGroupMessage,
            isSender: false,
            isNotified: false
        }
        this.setNotifications(prev => [...prev,
        {
            message: `@${newGroupMessage.sender}: ${newGroupMessage.text}`,
            chatId: newGroupMessage.chatId
        }
        ])
        this.setNewGroupMessages(messages => [...messages, newGroupMessage])
        this.setGroupChats(chats => chats.map(chat => {
            if (chat.id === newGroupMessage.chatId) {
                return { ...chat, unread: true, lastMessage: newGroupMessage.sender + ": " + newGroupMessage.text };
            }
            return chat;
        }));

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
        this.setConnections(connections => connections.map(connection => {
            if (connection.receiver.username === readMessageObj.sender || connection.sender.username === readMessageObj.sender) {
                if (connection.lastMessage?.startsWith("You:")) {
                    return { ...connection, isReadByConnection: true };
                } else {
                    return connection
                }
            }
            return connection;
        })
        );
    }

    handleTypeMessage(message) {
        const typeMessageObj = JSON.parse(message.body)
        console.log("Type message update: ");
        console.log(typeMessageObj);
        this.setTypeMessageObj(typeMessageObj)
    }

    handleTypeMessageGroupChat(message) {
        const typeMessageGroupChatObj = JSON.parse(message.body)
        console.log("Type message group chat update: ");
        console.log(typeMessageGroupChatObj);
        this.setTypeMessageGroupChatObj(typeMessageGroupChatObj)
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
