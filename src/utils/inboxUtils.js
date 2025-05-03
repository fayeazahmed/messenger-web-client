import GroupMessage from '../components/GroupMessage.jsx';
import Message from '../components/Message.jsx';
import { getLastOnlineAt as getLastOnline, getReadMessageTimestamp } from './dateUtils.js';

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
                    groupedMessages[date].map((message, index) => <Message key={index} message={message} isSender={message.isSender} readTimestamp={message.readTimestamp} />)
                }
            </div>
        )) : <p className="inbox-nomessage">Start chatting with {recipient}</p>
}

function renderGroupMessages(groupedMessages) {
    return Object.entries(groupedMessages).length > 0 ?
        Object.keys(groupedMessages).map(date => (
            <div key={date} className="inbox-messages-group-date">
                <p className="inbox-messages-date">{date}</p>
                {
                    groupedMessages[date].map((message, index) => <GroupMessage key={index} message={message} isSender={message.isSender} sender={message.sender.username} readTimestamp={message.readTimestamp} />)
                }
            </div>
        )) : <p className="inbox-nomessage">Start chatting</p>
}

function setMessageSeenTimestamp(messages, readMessage) {
    return messages.map(message => {
        if (message.id === readMessage.message.id) {
            message.readTimestamp = getReadMessageTimestamp(readMessage.readAt)
        }
        return message;
    });
}

function updateMessageSeenTimestamp(groupedMessages, readMessage) {
    const updatedMessages = Object.fromEntries(
        Object.entries(groupedMessages).map(([date, messages]) => [
            date,
            messages.map(message => ({
                ...message,
                readTimestamp: message.id === readMessage.message.id ? getReadMessageTimestamp(readMessage.readAt) : null
            }))
        ])
    );

    return updatedMessages;
}

export {
    setMessageSender,
    getNewMessages,
    getRecipient,
    getLastOnlineAt,
    getHeaderTextComponent,
    buildNewMessage,
    renderMessages,
    renderGroupMessages,
    setMessageSeenTimestamp,
    updateMessageSeenTimestamp
}