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
    const [groupMembers, setGroupMembers] = useState([])
    const [newGroupMembers, setNewGroupMembers] = useState("")
    const [memberSuggestions, setMemberSuggestions] = useState([])

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
            const members = chat.users.filter(u => u.username !== user.username)
            setGroupMembers(members.map(member => member.username))
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

    const showAddMemberSuggestion = e => {
        const username = e.target.value
        setNewGroupMembers(username)
        if (username.trim()) {
            const connectionList = connections.map(connection => connection.sender.username === user.username ? connection.receiver.username : connection.sender.username)
            const suggestedUsers = connectionList.filter(user => user.includes(username) && !groupMembers.includes(user))
            setMemberSuggestions(suggestedUsers)
        } else {
            setMemberSuggestions([])
        }
    }

    const addMember = async (username) => {
        try {
            const usernames = [...groupMembers, username]
            await apiClient.updateGroupChatSettings({
                chatId: selectedGroupChatInbox,
                title: groupTitle,
                usernames
            })
            setGroupMembers(usernames)
            setNewGroupMembers("")
            setMemberSuggestions([])
        } catch (e) {
            console.log(e);
        }
    }

    const removeMember = async (username) => {
        try {
            const usernames = groupMembers.filter(user => user !== username)
            await apiClient.updateGroupChatSettings({
                chatId: selectedGroupChatInbox,
                title: groupTitle,
                usernames
            })
            setGroupMembers(usernames)
        } catch (e) {
            console.log(e);
        }
    }

    if (!user) return
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
                            connection={connection}
                            selectedTheme={connection.chat.theme}
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
                        className={`signin-input ${darkMode ? "group-title-input-dark" : ""}`}
                        type="text"
                        placeholder="Group title"
                        value={groupTitle}
                        onChange={e => setGroupTitle(e.target.value)}
                        onKeyDown={handleGroupTitleChange}
                        disabled={groupTitleDisabled}
                    />
                    {
                        user.username === groupChat.admin.username &&
                        <button onClick={handleGroupTitleButtonClicked} className="btn btn-sm btn-dark ms-2"><i className="fa fa-pencil" aria-hidden="true"></i></button>
                    }
                </div>
                <div className="group-settings-members">
                    {
                        groupMembers.length < 1 ?
                            <div className="group-chats-no-member">There is no other member here</div> :
                            <div className="group-chats-create-members-list group-chats-settings-members-list">
                                {
                                    groupMembers.map((member, i) => <div key={i} className="group-chats-create-members-list-item text-start">
                                        @{member} {user.username === groupChat.admin.username &&
                                            <i onClick={() => removeMember(member)} className="fa fa-minus-circle" aria-hidden="true"></i>}
                                    </div>)
                                }
                            </div>
                    }
                    {
                        user.username === groupChat.admin.username &&
                        <input className="group-chats-create-members" type="text" placeholder="Add new members" value={newGroupMembers} onChange={showAddMemberSuggestion} />
                    }
                    {
                        memberSuggestions.map((member, i) => <p key={i} onClick={() => addMember(member)} className="group-chats-create-members-suggestion">@{member}</p>)
                    }
                </div>
                <div
                    className={`mt-2 connection-settings-button-container ${darkMode ? "connection-settings-button-container-dark" : ""
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
                    Leave Group
                </div>
                <div className="connection-settings-details">
                    {themesSelected && (
                        <InboxThemes
                            groupChatId={selectedGroupChatInbox}
                            selectedTheme={groupChat.theme}
                        />
                    )}
                    {deleteConnectionSelected && (
                        <DeleteConnection
                            chatId={groupChat.id}
                            setDeleteConnectionSelected={setDeleteConnectionSelected}
                        />
                    )}
                </div>
            </div>
        );
    }
};

export default ConnectionSettings;
