import React, { useContext, useEffect, useState } from "react";
import "../styles/Connection.css";
import { Link } from "react-router-dom";
import { Context } from "../services/Context";

const Connection = ({ connection }) => {
    const [title, setTitle] = useState("")
    const { user } = useContext(Context);

    useEffect(() => {
        if (user && connection) {
            const username = connection.sender.username === user.username ? connection.receiver.username : connection.sender.username
            setTitle(username)
        }
    }, [setTitle, user, connection])

    return (
        <Link to="/inbox" state={{ connection }} className="connection">
            <div className="chat-dp me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div className="chat-title">{title}</div>
            {
                connection?.isOnline && <div className="chat-online"><i className="fa fa-circle" aria-hidden="true"></i></div>
            }
        </Link>
    );
};

export default Connection;
