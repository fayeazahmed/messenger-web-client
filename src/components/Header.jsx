import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../services/Context";
import apiClient from "../services/ApiClient";
import "../styles/Header.css";

const Header = () => {
    const {
        user,
        setUser,
        stompClient,
        headerText,
        setHeaderText,
        setConnections,
        setNotifications,
        setNewMessages,
        setReadMessageObj,
        darkMode
    } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    const signout = () => {
        apiClient.removeAuthorizationHeader();
        localStorage.removeItem("jwt");
        stompClient.disconnect();
        navigate("/");
        setUser(null);
        setReadMessageObj(null);
        setHeaderText("");
        setConnections([]);
        setNotifications([]);
        setNewMessages([]);
    };

    return (
        <div className={`chat-header ${darkMode ? "chat-header-dark" : ""}`}>
            <div className="chat-header-user-menu">
                <h2 className="text-start logo" onClick={() => navigate("/")}>
                    AllIN1
                </h2>
                {user && (
                    <div>
                        <button
                            onClick={() => navigate("/settings")}
                            className="btn btn-sm btn-dark me-2"
                        >
                            <i className="fa fa-cog" aria-hidden="true"></i>
                        </button>
                        <button onClick={signout} className="btn btn-sm btn-dark">
                            <i className="fa fa-sign-out" aria-hidden="true"></i>
                        </button>
                    </div>
                )}
            </div>
            <div className="chat-header-connection-menu">
                <h6 className="m-0">{headerText}</h6>
                {
                    (location.pathname === "/inbox" || location.pathname === "/group")
                    && <button
                        onClick={() => navigate("/connection-settings")}
                        className="btn btn-sm btn-dark ms-2"
                    >
                        Manage
                    </button>
                }
            </div>
        </div>
    );
};

export default Header;
