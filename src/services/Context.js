import React, { createContext, useState } from "react";

const Context = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessages, setNewMessages] = useState([]);
    const [newGroupMessages, setNewGroupMessages] = useState([]);
    const [connections, setConnections] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [headerText, setHeaderText] = useState("Home");
    const [readMessageObj, setReadMessageObj] = useState(null);
    const [typeMessageObj, setTypeMessageObj] = useState(null);
    const [typeMessageGroupChatObj, setTypeMessageGroupChatObj] = useState(null);
    const [darkMode, setDarkMode] = useState(false)
    const [selectedConnectionInInbox, setSelectedConnectionInInbox] = useState(null);
    const [selectedGroupChatInbox, setSelectedGroupChatInbox] = useState(null);

    return (
        <Context.Provider
            value={{
                user,
                setUser,
                notifications,
                setNotifications,
                stompClient,
                setStompClient,
                newMessages,
                setNewMessages,
                newGroupMessages,
                setNewGroupMessages,
                headerText,
                setHeaderText,
                connections,
                setConnections,
                groupChats,
                setGroupChats,
                readMessageObj,
                setReadMessageObj,
                typeMessageObj,
                setTypeMessageObj,
                typeMessageGroupChatObj,
                setTypeMessageGroupChatObj,
                darkMode,
                setDarkMode,
                selectedConnectionInInbox,
                setSelectedConnectionInInbox,
                selectedGroupChatInbox,
                setSelectedGroupChatInbox
            }}
        >
            {children}
        </Context.Provider>
    );
}

export { Context, Provider };
