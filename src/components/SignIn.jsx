import React, { useCallback, useContext, useEffect, useState } from 'react'
import apiClient from "../services/ApiClient"
import "../styles/SignIn.css"
import { Context } from '../services/Context'
import { useNavigate } from "react-router-dom";
import StompClient from "../services/StompClient"

const SignIn = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { setNotification, setUser, user, setStompClient, setNewMessages, setConnections } = useContext(Context);
    const navigate = useNavigate();

    const finishSignIn = useCallback((jwt, username, user) => {
        apiClient.setAuthorizationHeader(jwt)
        const stompClientInstance = new StompClient(
            "http://localhost:8080/ws",
            jwt,
            username,
            setNewMessages,
            setConnections
        )
        stompClientInstance.connect()
        setStompClient(stompClientInstance)
        setUser(user)
    }, [setNewMessages, setConnections, setStompClient, setUser])

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
        if (user) {
            navigate("/connections");
        } else {
            authenticateUser()
        }
    }, [user, navigate, authenticateUser])


    const handleInputKeyDown = (key) => {
        if (key === "Enter" && username.trim() && password.trim()) {
            signIn()
        }
    }

    const signIn = async () => {
        try {
            const response = await apiClient.signIn(username, password)
            const jwt = response?.jwtToken
            localStorage.setItem("jwt", jwt)
            finishSignIn(jwt, response.username, response)
        } catch (error) {
            console.log(error);
            setNotification(error.response?.data?.message || "Bad credentials probably")
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
            <button onClick={signIn} className="w-100 btn btn-sm btn-success mt-2">
                Signin
            </button>
        </div>
    )
}

export default SignIn