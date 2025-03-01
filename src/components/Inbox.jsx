import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Message from './Message';
import "../styles/Inbox.css";
import { Context } from "../services/Context";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"
import { getLastOnlineAt, groupMessages } from '../utils/dateUtils.js';

const Inbox = () => {
    const [groupedMessages, setGroupedMessages] = useState({});
    const [messageInput, setMessageInput] = useState("");
    const [selectedConnection, setSelectedConnection] = useState(null);
    const { user, stompClient, newMessages, setNewMessages, setHeaderText, connections } = useContext(Context);
    const [recipient, setRecipient] = useState("")
    const navigate = useNavigate();
    const { state } = useLocation();
    const messagesContainerRef = useRef(null);

    const getMessages = useCallback(async () => {
        if (selectedConnection) {
            const messageList = await apiClient.getMessages(selectedConnection.chat.id);
            const messages = messageList.map(message => {
                message.isSender = message.sender.username === user.username;
                return message;
            });
            const groupedMessages = groupMessages(messages)
            setGroupedMessages(groupedMessages);
            const msgContainer = messagesContainerRef.current;
            if (msgContainer) {
                setTimeout(() => {
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }, 0);
            }
        }
    }, [selectedConnection, user]);

    const scrollToBottom = () => {
        if (Object.entries(groupedMessages).length > 0) {
            const msgContainer = messagesContainerRef.current;
            if (msgContainer) {
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }
        }
    }

    useEffect(scrollToBottom, [groupedMessages])

    useEffect(() => {
        if (user) getMessages()
    }, [getMessages, user])

    const renderNewMessage = () => {
        let newMessageList = [];
        for (let i = 0; i < newMessages.length; i++) {
            if (!newMessages[i].isNotified && (newMessages[i].isSender || newMessages[i].sender === recipient)) {
                newMessages[i].isNotified = true;
                newMessageList.push(newMessages[i]);
            }
        }

        if (newMessageList.length > 0) {
            setGroupedMessages(prev => {
                const newGrouped = groupMessages(newMessageList);
                const combinedGroupedMessages = { ...prev };
                Object.keys(newGrouped).forEach(date => {
                    if (!combinedGroupedMessages[date]) {
                        combinedGroupedMessages[date] = [];
                    }
                    combinedGroupedMessages[date] = [
                        ...combinedGroupedMessages[date],
                        ...newGrouped[date]
                    ];
                });

                return combinedGroupedMessages;
            });
        }
    }

    useEffect(renderNewMessage, [newMessages, recipient]);

    const updateConnection = () => {
        if (!user) {
            navigate("/");
        } else if (state?.connectionId) {
            const selectedConnection = connections.find(conn => conn.id === state.connectionId);
            setSelectedConnection(selectedConnection);
            const recipient = selectedConnection.sender.username === user.username ? selectedConnection.receiver.username : selectedConnection.sender.username
            setRecipient(recipient)
            let lastSeen = ""
            if (!selectedConnection.isOnline) {
                const lastOnlineAt =
                    selectedConnection.sender.username === user.username
                        ? selectedConnection.receiver.lastOnlineAt
                        : selectedConnection.sender.lastOnlineAt;
                lastSeen = getLastOnlineAt(lastOnlineAt)
            }
            setHeaderText(
                <>
                    Inbox • {recipient}
                    {selectedConnection.isOnline ? (
                        <span className="chat-online">
                            <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                    ) : <span className="chat-online">{lastSeen}</span>}
                </>
            );
        }
    }

    useEffect(updateConnection, [connections, state, state?.connectionId, user, navigate, setRecipient, setHeaderText])

    const sendMessage = () => {
        if (messageInput.trim()) {
            stompClient.sendMessage(user.username, recipient, messageInput, selectedConnection);
            const newMessage = {
                text: messageInput,
                recipient,
                sender: user.username,
                isNotified: false,
                isSender: true,
                createdAt: Date.now()
            }
            setNewMessages((prevMessages) => [
                ...prevMessages, newMessage
            ]);
            setMessageInput("");
        }
    };

    const handleMessageInputChange = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
            sendMessage();
            e.preventDefault()
        }
    };

    return (
        <div className="inbox">
            <div ref={messagesContainerRef} className="inbox-messages">
                {
                    Object.keys(groupedMessages).map(date => (
                        <div key={date} className="inbox-messages-group-date">
                            <p className="inbox-messages-date">{date}</p>
                            {
                                groupedMessages[date].map((message, index) => <Message key={index} message={message} isSender={message.isSender} />)
                            }
                        </div>
                    ))
                }
            </div>
            <div className="inbox-input-container">
                <textarea
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleMessageInputChange}
                    placeholder="Send something..."
                    className="inbox-input"
                />
                <button onClick={sendMessage} className="inbox-send-button">
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
}

export default Inbox