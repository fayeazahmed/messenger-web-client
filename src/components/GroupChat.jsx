import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Context } from "../services/Context";

const GroupChat = ({ chat }) => {
    const navigate = useNavigate();
    const { darkMode } = useContext(Context);

    return (
        <div onClick={() => navigate("/group", { state: { chatId: chat.id, title: chat.title } })} className={`connection ${darkMode ? "connection-dark" : ""}`}>
            <div className="connection-dp me-3">
                <i className="fa fa-users" aria-hidden="true"></i>
            </div>
            <div className={`connection-title ${chat.unread ? "connection-title-bold" : ""}`}>
                <div className="connection-user">{chat.title}</div>
                <div className="connection-last-message">{chat.lastMessage}</div>
            </div>
        </div>
    )
}

export default GroupChat