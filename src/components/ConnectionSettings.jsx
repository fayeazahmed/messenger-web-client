import React, { useContext, useEffect, useState } from "react";
import { Context } from "../services/Context";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ConnectionSettings.css";
import { getRecipient } from "../utils/inboxUtils";
import InboxThemes from "./InboxThemes";
import DeleteConnection from "./DeleteConnection";

const ConnectionSettings = () => {
    const { user, setHeaderText, connections, darkMode } = useContext(Context);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [connection, setConnection] = useState(null);
    const [themesSelected, setThemesSelected] = useState(false);
    const [deleteConnectionSelected, setDeleteConnectionSelected] =
        useState(false);

    useEffect(() => {
        if (!user || !state?.connectionId) {
            navigate("/");
        } else {
            const connection = connections.find(
                (conn) => conn.id === state.connectionId
            );
            if (!connection) navigate("/");

            setConnection(connection);
            const recipient = getRecipient(connection, user);
            setHeaderText(`Manage • ${recipient}`);
        }
    }, [user, navigate, setHeaderText, state?.connectionId, connections]);

    return (
        <div className="connection-settings p-3">
            <div
                className={`connection-settings-button-container ${darkMode ? "connection-settings-button-container-dark" : ""}`}
                onClick={() => {
                    setDeleteConnectionSelected(false);
                    setThemesSelected(!themesSelected);
                }}
            >
                <i className="fa fa-picture-o me-2" aria-hidden="true"></i>
                Change theme
            </div>
            <div
                className={`connection-settings-button-container ${darkMode ? "connection-settings-button-container-dark" : ""}`}
                onClick={() => {
                    setThemesSelected(false);
                    setDeleteConnectionSelected(!deleteConnectionSelected);
                }}
            >
                <i className="fa fa-user-times me-2" aria-hidden="true"></i>
                Delete connection
            </div>
            <div className="connection-settings-details">
                {themesSelected && (
                    <InboxThemes
                        connectionId={connection.id}
                        selectedTheme={connection.inboxTheme}
                    />
                )}
                {deleteConnectionSelected && (
                    <DeleteConnection
                        connectionId={connection.id}
                        setDeleteConnectionSelected={setDeleteConnectionSelected}
                    />
                )}
            </div>
        </div>
    );
};

export default ConnectionSettings;
