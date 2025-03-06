import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Context } from "../services/Context";
import apiClient from "../services/ApiClient"

const Header = () => {
    const { user, setUser, stompClient, headerText, setHeaderText, setConnections, setNotifications, setNewMessages, setReadMessageObj } = useContext(Context);
    const navigate = useNavigate();

    const signout = () => {
        apiClient.removeAuthorizationHeader()
        localStorage.removeItem("jwt")
        stompClient.disconnect()
        navigate("/");
        setUser(null)
        setReadMessageObj(null)
        setHeaderText("")
        setConnections([])
        setNotifications([])
        setNewMessages([])
    }

    return (
        <div className="chat-header">
            <div className="chat-header-text">
                <h2 className="text-start logo" onClick={() => navigate("/")}>AllIN1</h2>
                <h6 className="text-start">{headerText}</h6>
            </div>
            <div className="chat-header-menu">
                {
                    user && <button onClick={signout} className="btn btn-sm btn-warning"><i className="fa fa-sign-out" aria-hidden="true"></i></button>
                }
            </div>
        </div>
    )
}

export default Header