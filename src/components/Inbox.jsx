import React, { useCallback, useContext, useEffect, useState } from 'react'
import Message from './Message';
import "../styles/Inbox.css";
import { Context } from "../services/Context";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [selectedConnection, setSelectedConnection] = useState(null);
    const { user, stompClient, newMessages, setNewMessages, setHeaderText, connections } = useContext(Context);
    const [recipient, setRecipient] = useState("")
    const navigate = useNavigate();
    const { state } = useLocation();

    const getMessages = useCallback(async () => {
        if (selectedConnection) {
            const messageList = await apiClient.getMessages(selectedConnection.chat.id);
            const messages = messageList.map(message => {
                message.isSender = message.sender.username === user.username;
                return message;
            });
            setMessages(messages);
        }
    }, [selectedConnection, user]);

    useEffect(() => {
        if (user) getMessages()
    }, [getMessages, user])

    useEffect(() => {
        let newMessageList = []
        for (let i = 0; i < newMessages.length; i++) {
            if (!newMessages[i].isNotified && (newMessages[i].isSender || newMessages[i].sender === recipient)) {
                newMessages[i].isNotified = true
                newMessageList.push(newMessages[i])
            }
        }
        setMessages(messages => [...messages, ...newMessageList])
    }, [newMessages, recipient])

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else if (state?.connectionId) {
            console.log(connections);
            const selectedConnection = connections.find(conn => conn.id === state.connectionId);
            setSelectedConnection(selectedConnection);
            const recipient = selectedConnection.sender.username === user.username ? selectedConnection.receiver.username : selectedConnection.sender.username
            setRecipient(recipient)
        }
    }, [connections, state, state?.connectionId, user, navigate, setRecipient])

    useEffect(() => {
        if (selectedConnection) {
            console.log(selectedConnection.isOnline);

            setHeaderText(
                <>
                    Inbox • {recipient}
                    {selectedConnection.isOnline && (
                        <span className="chat-online">
                            <i className="fa fa-circle" aria-hidden="true"></i>
                        </span>
                    )}
                </>
            );
        }
    }, [selectedConnection, setHeaderText, recipient])

    const sendMessage = () => {
        if (messageInput.trim()) {
            stompClient.sendMessage(user.username, recipient, messageInput, selectedConnection);
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