import React from 'react'
import { useNavigate } from 'react-router-dom';

const GroupChat = ({ chat }) => {
    const navigate = useNavigate();

    console.log(chat);

    return (
        <div onClick={() => navigate("/group", { state: { chatId: chat.id } })} className={`connection`}>
            <div className="connection-dp me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div className={`connection-title`}>
                <div className="connection-user">{chat.title}</div>
                <div className="connection-last-message">{chat.lastMessage}</div>
            </div>
        </div>
    )
}

export default GroupChat