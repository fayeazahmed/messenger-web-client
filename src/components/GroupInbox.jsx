import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../services/Context';
import { groupMessages } from '../utils/dateUtils';
import apiClient from '../services/ApiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { renderGroupMessages, setMessageSender } from '../utils/inboxUtils';

const GroupInbox = () => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const chatId = location.state?.chatId;
    const messagesContainerRef = useRef(null);
    const [groupedMessages, setGroupedMessages] = useState({});
    const [emojiPicker, setEmojiPicker] = useState(false);

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
        else getMessages()
    }, [user, getMessages, navigate])

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
            {/* <div className="inbox-message-type-container">
                {
                    typeMessageObj?.sender === recipient && `${recipient} is typing...`
                }
            </div> */}
            {
                // <InboxInput
                //     darkMode={darkMode}
                //     messageInput={messageInput}
                //     setMessageInput={setMessageInput}
                //     handleMessageInputChange={handleMessageInputChange}
                //     sendMessage={sendMessage}
                //     emojiPicker={emojiPicker}
                //     setEmojiPicker={setEmojiPicker}
                // />
            }
        </div>
    )
}

export default GroupInbox