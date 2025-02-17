import React, { useContext, useState } from "react";
import apiClient from "../services/ApiClient";
import { Link } from "react-router-dom";
import { Context } from "../services/Context";

const Connect = ({ caller, user, connection: connectionFromProps }) => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [connectionState, setConnectionState] = useState(connectionFromProps);
    const { setConnections } = useContext(Context);

    const addConnection = async () => {
        setBtnDisabled(true);
        const { username } = user;
        await apiClient.addConnection(username);
    };

    const acceptConnection = async () => {
        const connectionResponse = await apiClient.acceptConnection(connectionFromProps?.id);
        const { connection, online, ...rest } = connectionResponse;
        const connectionFlattened = {
            ...connection,
            isOnline: online,
            ...rest
        }
        setConnectionState(connectionFlattened);
        setConnections(prev => [...prev, connectionFlattened])
    };

    const getButton = () => {
        let isChatButton = false;
        const connectIcon = <i className="fa fa-user-plus" aria-hidden="true"></i>;
        const requestedIcon = (
            <i className="fa fa-check-circle-o" aria-hidden="true"></i>
        );
        const chatIcon = <i className="fa fa-paper-plane-o" aria-hidden="true"></i>;
        // disable- request sent, request came
        // enable- send request, accept, chat

        const disabled =
            btnDisabled ||
            (caller === "SEARCH" &&
                connectionState?.status &&
                connectionState.status !== "ACCEPTED");

        const text = disabled
            ? "Requested"
            : caller === "SEARCH"
                ? connectionState?.status === "ACCEPTED"
                    ? "Chat"
                    : "Connect"
                : connectionState?.status && connectionState.status === "ACCEPTED"
                    ? "Chat"
                    : "Accept";

        let icon;
        if (disabled) {
            icon = requestedIcon;
        } else {
            if (caller === "REQUESTS") {
                if (connectionState?.status && connectionState.status === "ACCEPTED") {
                    icon = chatIcon;
                    isChatButton = true;
                } else {
                    icon = connectIcon;
                }
            } else {
                if (connectionState) {
                    icon = chatIcon;
                    isChatButton = true;
                } else {
                    icon = connectIcon;
                }
            }
        }
        const onClick =
            !disabled &&
            (connectionState
                ? connectionState.status === "REQUESTED"
                    ? acceptConnection
                    : null
                : addConnection);

        return isChatButton ? (
            <Link
                to="/inbox"
                state={{ connectionId: connectionState.id }}
                className="btn btn-sm btn-outline-success"
            >
                {
                    <>
                        {text}&nbsp;{icon}
                    </>
                }
            </Link>
        ) : (
            <button
                disabled={disabled}
                onClick={onClick ? onClick : undefined}
                className="btn btn-sm btn-outline-success"
            >
                {
                    <>
                        {text}&nbsp;{icon}
                    </>
                }
            </button>
        );
    };

    return (
        <div key={user.id} className="add-connection-user">
            <div className="me-3">
                <i className="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div className="add-connection-user-username">@{user.username}</div>
            {getButton()}
        </div>
    );
};

export default Connect;
