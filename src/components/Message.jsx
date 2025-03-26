import "../styles/Message.css";
import { getTimeFromTimestamp } from "../utils/dateUtils.js";

const Message = ({ message, isSender, readTimestamp }) => {
    return (
        <div className="message-container">
            <p className={`chat-timestamp ${isSender ? "chat-timestamp-sent" : "chat-timestamp-received"}`}>{getTimeFromTimestamp(message.createdAt)}</p>
            <pre className={`chat-message ${isSender ? "chat-message-sent" : "chat-message-received"}`}>{message.text.trim()}</pre>
            {
                readTimestamp && <p className="read-message-timestamp">Seen<i className="fa fa-check" aria-hidden="true"></i> {readTimestamp}</p>
            }
        </div>
    );
};

export default Message