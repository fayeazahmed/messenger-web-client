import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import "../styles/Inbox.css";
import { Context } from "../services/Context";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"
import { groupMessages } from '../utils/dateUtils.js';
import { getHeaderTextComponent, getLastOnlineAt, getNewMessages, getRecipient, renderMessages, setMessageSeenTimestamp, setMessageSender, updateMessageSeenTimestamp } from '../utils/inboxUtils.js';
import InboxInput from './InboxInput.jsx';

const Inbox = () => {
    const [groupedMessages, setGroupedMessages] = useState({});
    const [messageInput, setMessageInput] = useState("");
    const [selectedConnection, setSelectedConnection] = useState(null);
    const { user, stompClient, newMessages, setHeaderText, connections, typeMessageObj, setTypeMessageObj, readMessageObj, darkMode, setSelectedConnectionInInbox, setSelectedGroupChatInbox } = useContext(Context);
    const [recipient, setRecipient] = useState("")
    const [emojiPicker, setEmojiPicker] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const getMessages = useCallback(async () => {
        if (selectedConnection) {
            const messageList = await apiClient.getMessages(selectedConnection.chat.id);
            const readMessage = await apiClient.getLastReadMessage(selectedConnection.chat.id);
            let messages = setMessageSender(messageList, user)
            if (readMessage != null) {
                messages = setMessageSeenTimestamp(messages, readMessage)
            }
            const groupedMessages = groupMessages(messages)
            setGroupedMessages(groupedMessages);
            const msgContainer = messagesContainerRef.current;
            if (msgContainer) {
                setTimeout(() => {
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }, 0);
            }
            stompClient.sendReadMessageNotification(user.username, recipient, new Date(), selectedConnection?.chat?.id)
        }
    }, [selectedConnection, user, recipient, stompClient]);

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
            if (!newMessageList[newMessageList.length - 1].isSender) {
                stompClient.sendReadMessageNotification(user.username, recipient, new Date(), selectedConnection?.chat?.id)
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

        }
    }

    useEffect(renderNewMessage, [newMessages, recipient, selectedConnection, selectedConnection?.chat?.id, stompClient, user?.username]);

    const updateConnection = () => {
        if (!user) {
            navigate("/");
        } else if (state?.connectionId) {
            const selectedConnection = connections.find(conn => conn.id === state.connectionId);
            if (!selectedConnection) navigate("/")

            setSelectedConnection(selectedConnection);
            setSelectedConnectionInInbox(selectedConnection)
            setSelectedGroupChatInbox(null)
            const recipient = getRecipient(selectedConnection, user)
            setRecipient(recipient)
            const lastSeen = getLastOnlineAt(selectedConnection, user)
            const headerText = getHeaderTextComponent(recipient, selectedConnection, lastSeen)
            setHeaderText(headerText);
        }
    }

    useEffect(updateConnection, [connections, state, state?.connectionId, user, navigate, setRecipient, setHeaderText, setSelectedConnectionInInbox, setSelectedGroupChatInbox])

    const sendMessage = () => {
        if (messageInput.trim()) {
            setEmojiPicker(false)
            stompClient.sendMessage(user.username, recipient, messageInput, selectedConnection);
            setMessageInput("");
        }
    };

    const handleMessageInputChange = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
            sendMessage();
            e.preventDefault()
        } else {
            stompClient.sendTypeMessageNotification(user.username, recipient)
        }
    };

    const handleTypeMessage = () => {
        if (typeMessageObj?.sender === recipient) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                setTypeMessageObj(null);
            }, 1100);
        }
    }

    useEffect(handleTypeMessage, [typeMessageObj, setTypeMessageObj, recipient])

    const handleReadMessageUpdate = useCallback(async () => {
        if (readMessageObj?.sender === recipient) {
            const readMessage = await apiClient.getLastReadMessage(selectedConnection.chat.id);
            if (readMessage) {
                const updatedGroupedMessages = updateMessageSeenTimestamp(groupedMessages, readMessage)
                setGroupedMessages(updatedGroupedMessages)
            }
        }
        // eslint-disable-next-line
    }, [selectedConnection, readMessageObj, recipient]);

    useEffect(() => {
        handleReadMessageUpdate()
    }, [handleReadMessageUpdate])

    const getBgImageStyle = () => {
        if (selectedConnection.chat.theme === 0) return {}

        const imageUrl = require(`../images/${selectedConnection.chat.theme}.jpg`)
        return { backgroundImage: `url(${imageUrl})` }
    }

    if (selectedConnection === null) return

    return (
        <div style={getBgImageStyle()} className="inbox">
            <div onClick={() => setEmojiPicker(false)} ref={messagesContainerRef} className="inbox-messages">
                {
                    renderMessages(groupedMessages, recipient)
                }
            </div>
            <div className="inbox-message-type-container">
                {
                    typeMessageObj?.sender === recipient && `${recipient} is typing...`
                }
            </div>
            {
                <InboxInput
                    darkMode={darkMode}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    handleMessageInputChange={handleMessageInputChange}
                    sendMessage={sendMessage}
                    emojiPicker={emojiPicker}
                    setEmojiPicker={setEmojiPicker}
                />
            }
        </div>
    )
}

export default Inbox