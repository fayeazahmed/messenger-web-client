import "../styles/Message.css";

const Message = ({ message, isSender }) => {
    return (
        <div>
            <p className={`chat-sender ${isSender ? "chat-sender-sent" : "chat-sender-received"}`}>{message.sender}</p>
            <p className={`chat-message ${isSender ? "chat-message-sent" : "chat-message-received"}`}>{message.text}</p>
        </div>
    );
};

export default Message