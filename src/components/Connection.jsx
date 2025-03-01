import React, { useContext, useEffect, useState } from "react";
import "../styles/Connection.css";
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";
import { getLastOnlineAt } from '../utils/dateUtils.js';

const Connection = ({ connection }) => {
    const [title, setTitle] = useState("");
    const [lastSeen, setLastSeen] = useState("")
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const renderConnection = () => {
        if (user && connection) {
            const username =
                connection.sender.username === user.username
                    ? connection.receiver.username
                    : connection.sender.username;
            setTitle(username);

            if (!connection.isOnline) {
                const lastOnlineAt =
                    connection.sender.username === user.username
                        ? connection.receiver.lastOnlineAt
                        : connection.sender.lastOnlineAt;
                const lastSeen = getLastOnlineAt(lastOnlineAt)
                setLastSeen(lastSeen);
            }
        }
    }

    useEffect(renderConnection, [setTitle, user, connection]);

    return (
        <div
            className="connection"
            onClick={() =>
                navigate("/inbox", { state: { connectionId: connection.id } })
            }
        >
            <div className="chat-dp me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div className="chat-title">{title}</div>
            <div className="chat-online">
                {
                    connection?.isOnline ? (<i className="fa fa-circle" aria-hidden="true"></i>) : (<p className="m-0">{lastSeen}</p>)
                }
            </div>
        </div>
    );
};

export default Connection;
