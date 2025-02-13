import React, { useState } from "react";
import apiClient from "../services/ApiClient";

const Connect = ({ caller, user, connection }) => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [connectionState, setConnectionState] = useState(connection);

    const addConnection = async () => {
        setBtnDisabled(true);
        const { username } = user;
        await apiClient.addConnection(username);
    };

    const acceptConnection = async () => {
        const connectionResponse = await apiClient.acceptConnection(connection?.id);
        setConnectionState(connectionResponse);
    };

    const getButton = () => {
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
        const icon = disabled
            ? requestedIcon
            : caller === "REQUESTS"
                ? connectionState?.status && connectionState.status === "ACCEPTED"
                    ? chatIcon
                    : connectIcon
                : connectionState
                    ? chatIcon
                    : connectIcon;
        const onClick =
            !disabled &&
            (connectionState
                ? connectionState.status === "REQUESTED"
                    ? acceptConnection
                    : null
                : addConnection);

        return (
            <button
                disabled={disabled}
                onClick={onClick ? onClick : undefined}
                className="btn btn-sm btn-outline-success "
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
