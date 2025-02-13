import React, { createContext, useState } from 'react';

const Context = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState("")
    const [stompClient, setStompClient] = useState(null)
    const [newMessages, setNewMessages] = useState([])

    return (
        <Context.Provider value={{ user, setUser, notification, setNotification, stompClient, setStompClient, newMessages, setNewMessages }}>
            {children}
        </Context.Provider>
    );
}

export { Context, Provider }