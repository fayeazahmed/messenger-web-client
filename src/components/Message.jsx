import "../styles/Message.css";
import { getTimeFromTimestamp } from "../utils/dateUtils.js";

const Message = ({ message, isSender }) => {
    return (
        <div>
            <p className={`chat-timestamp ${isSender ? "chat-timestamp-sent" : "chat-timestamp-received"}`}>{getTimeFromTimestamp(message.createdAt)}</p>
            <pre className={`chat-message ${isSender ? "chat-message-sent" : "chat-message-received"}`}>{message.text.trim()}</pre>
        </div>
    );
};

export default Message