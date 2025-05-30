import React, { useCallback, useContext, useEffect, useState } from 'react'
import apiClient from "../services/ApiClient"
import "../styles/SignIn.css"
import { Context } from '../services/Context'
import { useNavigate } from "react-router-dom";
import StompClient from "../services/StompClient"

const SignIn = () => {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const { setUser, user, setStompClient, setNewMessages, setNewGroupMessages, setConnections, setGroupChats, setNotifications, setReadMessageObj, setTypeMessageObj, setDarkMode, setTypeMessageGroupChatObj } = useContext(Context);
    const navigate = useNavigate();

    const setTheme = useCallback(() => {
        const value = localStorage.getItem("allin1-theme")
        if (value) {
            setDarkMode(value === "dark" ? true : false)
        }
    }, [setDarkMode])

    const finishSignIn = useCallback((jwt, username, user) => {
        apiClient.setAuthorizationHeader(jwt)
        const stompClientInstance = new StompClient(
            "https://allin1-messenger.onrender.com/ws",
            jwt,
            username,
            setNotifications,
            setNewMessages,
            setNewGroupMessages,
            setConnections,
            setGroupChats,
            setReadMessageObj,
            setTypeMessageObj,
            setTypeMessageGroupChatObj
        )
        stompClientInstance.connect()
        setStompClient(stompClientInstance)
        setUser(user)
    }, [setNewMessages, setNewGroupMessages, setConnections, setGroupChats, setStompClient, setUser, setNotifications, setReadMessageObj, setTypeMessageObj, setTypeMessageGroupChatObj])

    const authenticateUser = useCallback(async () => {
        const jwt = localStorage.getItem("jwt")
        if (jwt) {
            try {
                const response = await apiClient.getUserFromJwt(jwt)
                if (response) {
                    finishSignIn(jwt, response.username, response)
                } else {
                    localStorage.removeItem("jwt")
                }
            } catch (ex) {
                console.log(ex);
                localStorage.removeItem("jwt")
            }
        }
    }, [finishSignIn])

    useEffect(() => {
        setTheme()
        if (user) {
            navigate("/connections");
        } else {
            authenticateUser()
        }
    }, [user, navigate, authenticateUser, setTheme])


    const handleInputKeyDown = (key) => {
        if (key === "Enter" && username.trim() && password.trim()) {
            signIn()
        }
    }

    const signIn = async () => {
        try {
            setLoading(true)
            setErrMessage("")
            const response = await apiClient.signIn(username, password)
            const jwt = response?.jwtToken
            localStorage.setItem("jwt", jwt)
            finishSignIn(jwt, response.username, response)
        } catch (error) {
            console.log(error);
            setErrMessage(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="signin">
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e.key)}
                placeholder="Username"
                type="text"
                className="mb-2 signin-input"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e.key)}
                placeholder="Password (5-12 characters)"
                type="password"
                className="signin-input"
            />
            <button disabled={loading} onClick={signIn} className="w-100 btn btn-sm btn-success mt-2">
                {loading ? <i className="fa fa-circle-o-notch" aria-hidden="true"></i> : "Signin"}
            </button>
            <div className="signin-error">{errMessage}</div>
        </div>
    )
}

export default SignIn