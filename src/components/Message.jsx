import { useContext } from "react";
import "../styles/Message.css";
import { getTimeFromTimestamp } from "../utils/dateUtils.js";
import { Context } from "../services/Context.js";

const Message = ({ message, isSender, readTimestamp }) => {
    const { darkMode } = useContext(Context);

    return (
        <div className="message-container">
            <p className={`chat-timestamp ${isSender ? "chat-timestamp-sent" : "chat-timestamp-received"}`}>{getTimeFromTimestamp(message.createdAt)}</p>
            <pre className={`chat-message ${darkMode ? "chat-message-dark" : ""} ${isSender ? "chat-message-sent" : "chat-message-received"}`}>{message.text.trim()}</pre>
            {
                readTimestamp && <p className="read-message-timestamp">Seen<i className="fa fa-check" aria-hidden="true"></i> {readTimestamp}</p>
            }
        </div>
    );
};

export default Message