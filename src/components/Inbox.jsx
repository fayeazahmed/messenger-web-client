import React, { useContext, useEffect, useState } from 'react'
import Message from './Message';
import { useLocation } from 'react-router-dom';
import "../styles/Inbox.css";
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
    const location = useLocation();
    const connection = location.state?.connection;
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const { user, stompClient, newMessages, setNewMessages } = useContext(Context);
    const [recipient, setRecipient] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        let newMessageList = []
        for (let i = 0; i < newMessages.length; i++) {
            if (!newMessages[i].isNotified) {
                newMessages[i].isNotified = true
                newMessageList.push(newMessages[i])
            }
        }
        setMessages(messages => [...messages, ...newMessageList])
    }, [newMessages])

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else if (connection) {
            console.log(connection);
        }
    }, [connection, user, navigate, setRecipient])

    const sendMessage = () => {
        if (messageInput.trim()) {
            stompClient.sendMessage(user.username, recipient, messageInput);
            const newMessage = {
                text: messageInput,
                recipient,
                sender: user.username,
                isNotified: false,
                isSender: true
            }
            setNewMessages((prevMessages) => [
                ...prevMessages, newMessage
            ]);
            setMessageInput("");
        }

    };

    const onMessageReceived = message => {
        console.log(message);

    }

    const handleMessageInputChange = (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            sendMessage();
        }
    };

    return (
        <div className="inbox">
            <div className="inbox-messages">
                {
                    messages.map((message, index) => <Message key={index} message={message} isSender={message.isSender} />)
                }
            </div>
            <div className="inbox-input-container">
                <input
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