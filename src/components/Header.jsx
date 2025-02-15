import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css"
import { Context } from "../services/Context";
import apiClient from "../services/ApiClient"

const Header = () => {
    const { user, setUser, stompClient, headerText } = useContext(Context);
    const navigate = useNavigate();

    const signout = () => {
        apiClient.removeAuthorizationHeader()
        localStorage.removeItem("jwt")
        stompClient.disconnect()
        navigate("/");
        setUser(null)
    }

    return (
        <div className="chat-header">
            <div className="chat-header-text">
                <h2 className="text-start">AllIN1</h2>
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