import Message from '../components/Message.jsx';
import { getLastOnlineAt as getLastOnline } from './dateUtils.js';

function setMessageSender(messages, user) {
    return messages.map(message => {
        message.isSender = message.sender.username === user.username;
        return message;
    });
}

function getNewMessages(newMessages, recipient) {
    const newMessageList = [];
    for (let i = 0; i < newMessages.length; i++) {
        if (!newMessages[i].isNotified && (newMessages[i].isSender || newMessages[i].sender === recipient)) {
            newMessages[i].isNotified = true;
            newMessageList.push(newMessages[i]);
        }
    }
    return newMessageList
}

function getRecipient(selectedConnection, user) {
    return selectedConnection.sender.username === user.username ? selectedConnection.receiver.username : selectedConnection.sender.username
}

function getLastOnlineAt(selectedConnection, user) {
    if (!selectedConnection.isOnline) {
        const lastOnlineAt =
            selectedConnection.sender.username === user.username
                ? selectedConnection.receiver.lastOnlineAt
                : selectedConnection.sender.lastOnlineAt;
        return getLastOnline(lastOnlineAt)
    }
    return ""
}

function getHeaderTextComponent(recipient, selectedConnection, lastSeen) {
    return <>
        Inbox • {recipient}
        {selectedConnection.isOnline ? (
            <span className="connection-online">
                <i className="fa fa-circle" aria-hidden="true"></i>
            </span>
        ) : <span className="connection-online">{lastSeen}</span>}
    </>
}

function buildNewMessage(messageInput, recipient, user) {
    return {
        text: messageInput,
        recipient,
        sender: user.username,
        isNotified: false,
        isSender: true,
        createdAt: Date.now()
    }
}

function renderMessages(groupedMessages, recipient) {
    return Object.entries(groupedMessages).length > 0 ?
        Object.keys(groupedMessages).map(date => (
            <div key={date} className="inbox-messages-group-date">
                <p className="inbox-messages-date">{date}</p>
                {
                    groupedMessages[date].map((message, index) => <Message key={index} message={message} isSender={message.isSender} />)
                }
            </div>
        )) : <p className="inbox-nomessage">Start chatting with {recipient}</p>
}

export {
    setMessageSender,
    getNewMessages,
    getRecipient,
    getLastOnlineAt,
    getHeaderTextComponent,
    buildNewMessage,
    renderMessages
}