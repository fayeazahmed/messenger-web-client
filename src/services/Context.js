import React, { createContext, useState } from "react";

const Context = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessages, setNewMessages] = useState([]);
    const [connections, setConnections] = useState([]);
    const [headerText, setHeaderText] = useState("Home");

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
                headerText,
                setHeaderText,
                connections,
                setConnections
            }}
        >
            {children}
        </Context.Provider>
    );
}

export { Context, Provider };
