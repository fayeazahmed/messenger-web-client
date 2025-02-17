import React, { useContext, useEffect, useState } from "react";
import "../styles/Connection.css";
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";

const Connection = ({ connection }) => {
    const [title, setTitle] = useState("")
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && connection) {
            const username = connection.sender.username === user.username ? connection.receiver.username : connection.sender.username
            setTitle(username)
        }
    }, [setTitle, user, connection])

    return (
        <div className="connection" onClick={() => navigate("/inbox", { state: { connectionId: connection.id } })}>
            <div className="chat-dp me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div className="chat-title">{title}</div>
            {
                connection?.isOnline && <div className="chat-online"><i className="fa fa-circle" aria-hidden="true"></i></div>
            }
        </div>
    );
};

export default Connection;
