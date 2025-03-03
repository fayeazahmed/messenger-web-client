import React, { useContext, useEffect, useState } from "react";
import "../styles/Connection.css";
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";
import { getConnectionOnlineComponent, getConnectionTitleComponent, getLastOnlineAtFromConnection, getUsernameTitleFromConnection } from "../utils/connectionUtils.js";

const Connection = ({ connection }) => {
    const [title, setTitle] = useState("");
    const [lastSeen, setLastSeen] = useState("")
    const [lastMessage, setLastMessage] = useState("")
    const [lastMessageUnread, setLastMessageUnread] = useState(false)
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const renderConnection = () => {
        if (user && connection) {
            setTitle(getUsernameTitleFromConnection(connection, user));
            setLastMessage(connection.lastMessage)
            setLastMessageUnread(connection.isUnread)
            if (!connection.isOnline) {
                setLastSeen(getLastOnlineAtFromConnection(connection, user));
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
            <div className="connection-dp me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            {
                getConnectionTitleComponent(title, lastMessage, lastMessageUnread)
            }
            <div className="connection-online">
                {
                    getConnectionOnlineComponent(connection, lastSeen)
                }
            </div>
        </div>
    );
};

export default Connection;
