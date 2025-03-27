import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Context } from "../services/Context";
import apiClient from "../services/ApiClient"

const Header = () => {
    const { user, setUser, stompClient, headerText, setHeaderText, setConnections, setNotifications, setNewMessages, setReadMessageObj, darkMode } = useContext(Context);
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
        <div className={`chat-header ${darkMode ? "chat-header-dark" : ""}`}>
            <div className="chat-header-text">
                <h2 className="text-start logo" onClick={() => navigate("/")}>AllIN1</h2>
                <h6 className="text-start">{headerText}</h6>
            </div>
            {
                user &&
                <div className="chat-header-menu">
                    <button onClick={() => navigate("/settings")} className="btn btn-sm btn-dark me-2"><i className="fa fa-cog" aria-hidden="true"></i></button>
                    <button onClick={signout} className="btn btn-sm btn-dark"><i className="fa fa-sign-out" aria-hidden="true"></i></button>
                </div>
            }
        </div>
    )
}

export default Header