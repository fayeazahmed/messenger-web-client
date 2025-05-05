import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../services/Context';
import { groupMessages } from '../utils/dateUtils';
import apiClient from '../services/ApiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { renderGroupMessages, setMessageSender } from '../utils/inboxUtils';
import InboxInput from './InboxInput';

const GroupInbox = () => {
    const { user, darkMode, setHeaderText, stompClient, typeMessageGroupChatObj, setTypeMessageGroupChatObj, setSelectedConnectionInInbox, setSelectedGroupChatInbox } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const chatId = location.state?.chatId;
    const title = location.state?.title;
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [groupedMessages, setGroupedMessages] = useState({});
    const [emojiPicker, setEmojiPicker] = useState(false);
    const [messageInput, setMessageInput] = useState("");

    const getMessages = useCallback(async () => {
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

    const handleMessageInputChange = (e) => {
        if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
            // sendMessage();
            e.preventDefault()
        } else {
            stompClient.sendTypeMessageGroupChatNotification(user.username, chatId)
        }
    };

    const sendMessage = () => {
        if (messageInput.trim()) {
            setEmojiPicker(false)
            // stompClient.sendMessage(user.username, recipient, messageInput, selectedConnection);
            // setMessageInput("");
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

        return {}
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
                    typeMessageGroupChatObj?.chatId === chatId && `${typeMessageGroupChatObj.sender} is typing...`
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