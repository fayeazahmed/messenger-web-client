import React, { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";
import "../styles/ConnectionSettings.css";
import { getRecipient } from "../utils/inboxUtils";
import InboxThemes from "./InboxThemes";
import DeleteConnection from "./DeleteConnection";
import apiClient from "../services/ApiClient";

const ConnectionSettings = () => {
    const {
        user,
        setHeaderText,
        connections,
        darkMode,
        selectedConnectionInInbox,
        selectedGroupChatInbox,
    } = useContext(Context);
    const navigate = useNavigate();
    const [connection, setConnection] = useState(null);
    const [groupChat, setGroupChat] = useState(null);
    const [themesSelected, setThemesSelected] = useState(false);
    const [deleteConnectionSelected, setDeleteConnectionSelected] =
        useState(false);
    const [groupTitle, setGroupTitle] = useState("");
    const [groupTitleDisabled, setGroupTitleDisabled] = useState(true);

    const getSettings = useCallback(async () => {
        if (!user || (!selectedConnectionInInbox && !selectedGroupChatInbox)) {
            navigate("/");
        } else if (selectedConnectionInInbox) {
            const connection = connections.find(
                (conn) => conn.chat.id === selectedConnectionInInbox.chat.id
            );
            if (!connection) navigate("/");
            setConnection(connection);
            setHeaderText(`Manage • ${getRecipient(connection, user)}`);
        } else if (selectedGroupChatInbox) {
            const chat = await apiClient.getChat(selectedGroupChatInbox);
            setGroupChat(chat)
            setGroupTitle(chat.title)
        }
    }, [
        user,
        navigate,
        setHeaderText,
        selectedConnectionInInbox,
        selectedGroupChatInbox,
        connections,
    ]);

    useEffect(() => {
        getSettings()
    }, [getSettings])

    const handleGroupTitleChange = async e => {
        if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
            const title = e.target.value.trim()
            const settings = {
                chatId: selectedGroupChatInbox,
                title,
                users: []
            }
            await apiClient.updateGroupChatSettings(settings)
            setGroupTitleDisabled(true)
            setHeaderText(title)
        }
    }

    const handleGroupTitleButtonClicked = async () => {
        if (groupTitleDisabled) {
            setGroupTitleDisabled(false)
        } else {
            setGroupTitleDisabled(true)
            if (groupTitle.trim()) {
                const title = groupTitle.trim()
                const settings = {
                    chatId: selectedGroupChatInbox,
                    title,
                    users: []
                }
                await apiClient.updateGroupChatSettings(settings)
                setHeaderText(title)
            }
        }
    }

    if (selectedConnectionInInbox) {
        return (
            <div className="connection-settings p-3">
                <div
                    className={`connection-settings-button-container ${darkMode ? "connection-settings-button-container-dark" : ""
                        }`}
                    onClick={() => {
                        setDeleteConnectionSelected(false);
                        setThemesSelected(!themesSelected);
                    }}
                >
                    <i className="fa fa-picture-o me-2" aria-hidden="true"></i>
                    Change theme
                </div>
                <div
                    className={`connection-settings-button-container ${darkMode ? "connection-settings-button-container-dark" : ""
                        }`}
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
    } else if (selectedGroupChatInbox && groupChat) {
        return (
            <div className="connection-settings p-3">
                <div className="group-settings-title d-flex align-items-center">
                    <input
                        className="signin-input"
                        type="text"
                        placeholder="Group title"
                        value={groupTitle}
                        onChange={e => setGroupTitle(e.target.value)}
                        onKeyDown={handleGroupTitleChange}
                        disabled={groupTitleDisabled}
                    />
                    <button onClick={handleGroupTitleButtonClicked} className="btn btn-sm btn-dark ms-2"><i className="fa fa-pencil" aria-hidden="true"></i></button>
                </div>
            </div>
        );
    }
};

export default ConnectionSettings;
