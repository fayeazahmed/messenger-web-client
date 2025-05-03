import React, { useContext } from 'react'
import { getTimeFromTimestamp } from "../utils/dateUtils.js";
import { Context } from "../services/Context.js";

const GroupMessage = ({ message, isSender, sender }) => {
    const { darkMode } = useContext(Context);

    return (
        <div className="message-container">
            <p className={`chat-timestamp ${isSender ? "chat-timestamp-sent" : "chat-timestamp-received"}`}>{getTimeFromTimestamp(message.createdAt)}</p>
            <pre className={`chat-message ${darkMode ? "chat-message-dark" : ""} ${isSender ? "chat-message-sent" : "chat-message-received"}`}>{message.text.trim()}</pre>
            {
                !isSender && <p className="chat-sender">{sender}</p>
            }
        </div>
    );
}

export default GroupMessage