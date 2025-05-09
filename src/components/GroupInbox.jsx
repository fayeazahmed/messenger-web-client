import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../services/Context';
import { groupMessages } from '../utils/dateUtils';
import apiClient from '../services/ApiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNewGroupMessages, renderGroupMessages, setMessageSender } from '../utils/inboxUtils';
import InboxInput from './InboxInput';

const GroupInbox = () => {
    const { user, darkMode, setHeaderText, stompClient, newGroupMessages, typeMessageGroupChatObj, setTypeMessageGroupChatObj, setSelectedConnectionInInbox, setSelectedGroupChatInbox } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const chatId = location.state?.chatId;
    const title = location.state?.title;
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [groupedMessages, setGroupedMessages] = useState({});
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [selectedTheme, setSelectedTheme] = useState(0);

    const getMessages = useCallback(async () => {
        const chat = await apiClient.getChat(chatId)
        setSelectedTheme(chat.theme)
        const messageList = await apiClient.getMessages(chatId);
        const messages = setMessageSender(messageList, user)
        const groupedMessages = groupMessages(messages)
        setGroupedMessages(groupedMessages);
        const msgContainer = messagesContainerRef.current;
        if (msgContainer) {
            setTimeout(() => {
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, 0);
        }

    }, [chatId, user]);

    useEffect(() => {
        if (!user) navigate("/");
        else {
            setHeaderText(title)
            setSelectedGroupChatInbox(chatId)
            setSelectedConnectionInInbox(null)
            getMessages()
        }
    }, [user, getMessages, navigate, title, setHeaderText, chatId, setSelectedConnectionInInbox, setSelectedGroupChatInbox])

    const renderNewMessage = () => {
        const newMessageList = getNewGroupMessages(newGroupMessages, chatId)
        console.log(newMessageList);

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

    useEffect(renderNewMessage, [newGroupMessages, chatId]);

    const scrollToBottom = () => {
        if (Object.entries(groupedMessages).length > 0) {
            const msgContainer = messagesContainerRef.current;
            if (msgContainer) {
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }
        }
    }

    useEffect(scrollToBottom, [groupedMessages])

    const handleMessageInputChange = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
            sendMessage();
            e.preventDefault()
        } else {
            stompClient.sendTypeMessageGroupChatNotification(user.username, chatId)
        }
    };

    const sendMessage = () => {
        if (messageInput.trim()) {
            setEmojiPicker(false)
            stompClient.sendMessageToGroupChat(user.username, chatId, messageInput);
            setMessageInput("");
        }
    };

    const handleTypeMessage = () => {
        if (typeMessageGroupChatObj?.chatId === chatId) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                setTypeMessageGroupChatObj(null);
            }, 1100);
        }
    }

    useEffect(handleTypeMessage, [typeMessageGroupChatObj, setTypeMessageGroupChatObj, chatId])

    const getBgImageStyle = () => {
        if (selectedTheme === 0) return {}

        const imageUrl = require(`../images/${selectedTheme}.jpg`)
        return { backgroundImage: `url(${imageUrl})` }
    }

    return (
        <div style={getBgImageStyle()} className="inbox">
            <div onClick={() => setEmojiPicker(false)} ref={messagesContainerRef} className="inbox-messages">
                {
                    renderGroupMessages(groupedMessages)
                }
            </div>
            <div className="inbox-message-type-container">
                {
                    typeMessageGroupChatObj?.chatId === chatId && `${typeMessageGroupChatObj?.sender} is typing...`
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

export default GroupInbox