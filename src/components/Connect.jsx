import React, { useContext } from "react";
import apiClient from "../services/ApiClient";
import { Link } from "react-router-dom";
import { Context } from "../services/Context";

const connectIcon = <i className="fa fa-user-plus" aria-hidden="true"></i>;
const requestedIcon = (
    <i className="fa fa-check-circle-o" aria-hidden="true"></i>
);
const chatIcon = <i className="fa fa-paper-plane-o" aria-hidden="true"></i>;
const disconnectIcon = <i className="fa fa-user-times" aria-hidden="true"></i>

const Connect = ({ caller, user, currentUser, connection: connectionFromProps, setConnectionRequests, setSearchList }) => {
    const { setConnections, darkMode } = useContext(Context);
    if (!currentUser || !user) return

    const addConnection = async () => {
        setSearchList(prev => prev.map(c =>
            c.user.id === user.id
                ? {
                    ...c,
                    connection: {
                        ...connectionFromProps,
                        "status": "REQUESTED",
                        "sender": {
                            "username": currentUser.username
                        }
                    }
                }
                : c
        )
        );
        const { username } = user;
        await apiClient.addConnection(username);
    };

    const handleConnectionRequest = async (isAccepted) => {
        if (isAccepted) {
            const connectionResponse = await apiClient.handleConnectionRequest(connectionFromProps?.id, isAccepted);
            const { connection, online, ...rest } = connectionResponse;
            const connectionFlattened = {
                ...connection,
                isOnline: online,
                ...rest
            }
            const updatedConnectionState = {
                ...connectionFlattened,
                "status": "ACCEPTED"
            }
            setConnections(prev => [...prev, connectionFlattened])
            setConnectionRequests(prev =>
                prev.map(connection => connection.id === updatedConnectionState.id
                    ? updatedConnectionState
                    : connection
                )
            );
            setSearchList(prev =>
                prev.map(c =>
                    c.connection?.id === updatedConnectionState.id
                        ? {
                            ...c,
                            connection: updatedConnectionState
                        }
                        : c
                )
            );
        } else {
            await apiClient.handleConnectionRequest(connectionFromProps?.id, isAccepted);
            setConnectionRequests(prev =>
                prev.filter(connection => connection.id !== connectionFromProps.id)
            );

            setSearchList(prev =>
                prev.map(c => c.user.id === user.id
                    ? {
                        ...c,
                        "connection": {
                            ...c.connection,
                            "status": "REJECTED"
                        }
                    }
                    : c
                )
            );
        }
    };

    const getButtons = () => {
        let handler1, onClick1, text1, icon1
        let handler2, onClick2, text2, icon2
        let disabled = false

        if (caller === "SEARCH") {
            if (connectionFromProps === null) {
                icon1 = connectIcon;
                text1 = "Connect"
                onClick1 = addConnection
                handler1 = <button
                    key={0}
                    disabled={disabled}
                    onClick={onClick1}
                    className="btn btn-sm btn-outline-success"
                >
                    {
                        <>
                            {text1}&nbsp;{icon1}
                        </>
                    }
                </button>
            } else if (connectionFromProps.status === "DELETED") {
                icon1 = connectIcon;
                text1 = "Connect"
                onClick1 = addConnection
                handler1 = <button
                    key={0}
                    disabled={disabled}
                    onClick={onClick1}
                    className="btn btn-sm btn-outline-success"
                >
                    {
                        <>
                            {text1}&nbsp;{icon1}
                        </>
                    }
                </button>
            } else if (connectionFromProps.status === "REQUESTED") {
                if (currentUser.username === connectionFromProps.sender.username) {
                    icon1 = requestedIcon;
                    text1 = "Requested"
                    onClick1 = undefined
                    disabled = true
                    handler1 = <button
                        key={0}
                        disabled={disabled}
                        onClick={onClick1}
                        className="btn btn-sm btn-outline-success"
                    >
                        {
                            <>
                                {text1}&nbsp;{icon1}
                            </>
                        }
                    </button>
                } else {
                    icon1 = connectIcon;
                    text1 = "Accept"
                    onClick1 = () => handleConnectionRequest(true)
                    handler1 = <button
                        key={0}
                        disabled={disabled}
                        onClick={onClick1}
                        className="btn btn-sm btn-outline-success"
                    >
                        {
                            <>
                                {text1}&nbsp;{icon1}
                            </>
                        }
                    </button>

                    icon2 = disconnectIcon;
                    text2 = "Remove"
                    onClick2 = () => handleConnectionRequest(false)
                    handler2 = <button
                        key={1}
                        disabled={disabled}
                        onClick={onClick2}
                        className="btn btn-sm btn-outline-danger"
                    >
                        {
                            <>
                                {text2}&nbsp;{icon2}
                            </>
                        }
                    </button>
                }
            } else if (connectionFromProps.status === "ACCEPTED") {
                icon1 = chatIcon;
                text1 = "Chat"
                handler1 = <Link
                    key={0}
                    to="/inbox"
                    state={{ connectionId: connectionFromProps.id }}
                    className="btn btn-sm btn-outline-primary"
                >
                    {
                        <>
                            {text1}&nbsp;{icon1}
                        </>
                    }
                </Link>
            } else if (connectionFromProps.status === "REJECTED") {
                if (currentUser.username === connectionFromProps.sender.username) {
                    icon1 = requestedIcon;
                    text1 = "Requested"
                    onClick1 = undefined
                    disabled = true
                    handler1 = <button
                        key={0}
                        disabled={disabled}
                        onClick={onClick1}
                        className="btn btn-sm btn-outline-success"
                    >
                        {
                            <>
                                {text1}&nbsp;{icon1}
                            </>
                        }
                    </button>
                } else {
                    icon1 = connectIcon;
                    text1 = "Connect"
                    onClick1 = addConnection
                    handler1 = <button
                        key={0}
                        disabled={disabled}
                        onClick={onClick1}
                        className="btn btn-sm btn-outline-success"
                    >
                        {
                            <>
                                {text1}&nbsp;{icon1}
                            </>
                        }
                    </button>
                }
            }
        } else {
            if (connectionFromProps.status === "REQUESTED") {
                icon1 = connectIcon;
                text1 = "Accept"
                onClick1 = () => handleConnectionRequest(true)
                handler1 = <button
                    key={0}
                    disabled={disabled}
                    onClick={onClick1}
                    className="btn btn-sm btn-outline-success"
                >
                    {
                        <>
                            {text1}&nbsp;{icon1}
                        </>
                    }
                </button>

                icon2 = disconnectIcon;
                text2 = "Remove"
                onClick2 = () => handleConnectionRequest(false)
                handler2 = <button
                    key={1}
                    disabled={disabled}
                    onClick={onClick2}
                    className="btn btn-sm btn-outline-danger"
                >
                    {
                        <>
                            {text2}&nbsp;{icon2}
                        </>
                    }
                </button>
            } else if (connectionFromProps.status === "ACCEPTED") {
                icon1 = chatIcon;
                text1 = "Chat"
                handler1 = <Link
                    key={0}
                    to="/inbox"
                    state={{ connectionId: connectionFromProps.id }}
                    className="btn btn-sm btn-outline-primary"
                >
                    {
                        <>
                            {text1}&nbsp;{icon1}
                        </>
                    }
                </Link>
            } else if (connectionFromProps.status === "REJECTED") {
                icon1 = connectIcon;
                text1 = "Connect"
                onClick1 = addConnection
                handler1 = <button
                    key={0}
                    disabled={disabled}
                    onClick={onClick1}
                    className="btn btn-sm btn-outline-success"
                >
                    {
                        <>
                            {text1}&nbsp;{icon1}
                        </>
                    }
                </button>
            }
        }

        return [handler1, handler2]
    }

    return (
        <div key={user?.id} className={`add-connection-user ${darkMode ? "add-connection-user-dark" : ""}`}>
            <div className="me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div className="add-connection-user-username">@{user?.username}</div>
            {getButtons()}
        </div>
    );
};


export default Connect;
