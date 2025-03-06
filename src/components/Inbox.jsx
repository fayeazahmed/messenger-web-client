import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import "../styles/Inbox.css";
import { Context } from "../services/Context";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"
import { groupMessages } from '../utils/dateUtils.js';
import { buildNewMessage, getHeaderTextComponent, getLastOnlineAt, getNewMessages, getRecipient, renderMessages, setMessageSender } from '../utils/inboxUtils.js';

const Inbox = () => {
    const [groupedMessages, setGroupedMessages] = useState({});
    const [messageInput, setMessageInput] = useState("");
    const [selectedConnection, setSelectedConnection] = useState(null);
    const { user, stompClient, newMessages, setNewMessages, setHeaderText, connections, readMessageObj, setReadMessageObj } = useContext(Context);
    const [recipient, setRecipient] = useState("")
    const navigate = useNavigate();
    const { state } = useLocation();
    const messagesContainerRef = useRef(null);
    const [readMessageTimestamp, setReadMessageTimestamp] = useState(null);

    const getMessages = useCallback(async () => {
        if (selectedConnection) {
            const messageList = await apiClient.getMessages(selectedConnection.chat.id);
            const messages = setMessageSender(messageList, user)
            const groupedMessages = groupMessages(messages)
            setGroupedMessages(groupedMessages);
            const msgContainer = messagesContainerRef.current;
            if (msgContainer) {
                setTimeout(() => {
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }, 0);
            }

            const readMessage = await apiClient.getLastReadMessage(selectedConnection.chat.id);
            console.log(readMessage);
            setReadMessageObj(readMessage)
            if (readMessage) {
                const date = new Date(readMessage.readAt);
                const timestamp = date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }).toLowerCase();
                setReadMessageTimestamp(timestamp);
            }
        }
    }, [selectedConnection, user, setReadMessageObj]);

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
        if (!selectedConnection) return

        const newMessageList = getNewMessages(newMessages, recipient)
        if (newMessageList.length > 0) {
            apiClient.updateReadMessages(selectedConnection.chat.id)
            if (!newMessageList[newMessageList.length - 1].isSender) {
                stompClient.sendReadMessageNotification(user.username, recipient, new Date())
            }

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

            setReadMessageObj(null)
        }
    }

    useEffect(renderNewMessage, [newMessages, recipient, selectedConnection, selectedConnection?.chat?.id, stompClient, user?.username, setReadMessageObj]);

    const updateConnection = () => {
        if (!user) {
            navigate("/");
        } else if (state?.connectionId) {
            const selectedConnection = connections.find(conn => conn.id === state.connectionId);
            if (!selectedConnection) navigate("/")

            setSelectedConnection(selectedConnection);
            const recipient = getRecipient(selectedConnection, user)
            setRecipient(recipient)
            const lastSeen = getLastOnlineAt(selectedConnection, user)
            const headerText = getHeaderTextComponent(recipient, selectedConnection, lastSeen)
            setHeaderText(headerText);
        }
    }

    useEffect(updateConnection, [connections, state, state?.connectionId, user, navigate, setRecipient, setHeaderText])

    const sendMessage = () => {
        if (messageInput.trim()) {
            stompClient.sendMessage(user.username, recipient, messageInput, selectedConnection);
            const newMessage = buildNewMessage(messageInput, recipient, user)
            setNewMessages((prevMessages) => [
                ...prevMessages, newMessage
            ]);
            setMessageInput("");
            setReadMessageObj(null)
        }
    };

    const handleMessageInputChange = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
            sendMessage();
            e.preventDefault()
        }
    };

    const handleReadMessage = () => {
        if (readMessageObj) {
            const date = new Date(readMessageObj.readAt);
            const timestamp = date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }).toLowerCase();
            setReadMessageTimestamp(timestamp);
        } else {
            setReadMessageTimestamp(null);
        }
    }

    useEffect(handleReadMessage, [readMessageObj])

    return (
        <div className="inbox">
            <div ref={messagesContainerRef} className="inbox-messages">
                {
                    renderMessages(groupedMessages, recipient)
                }
            </div>
            <div className="inbox-message-read-container">
                {
                    readMessageTimestamp && <div className="inbox-message-read-content">
                        <div>Seen</div>
                        <div className="ms-1"><i className="fa fa-check" aria-hidden="true"></i></div>
                        <div className="ms-1">{readMessageTimestamp}</div>
                    </div>
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