import React, { useContext, useEffect, useState } from 'react'
import apiClient from "../services/ApiClient"
import "../styles/SignIn.css"
import { Context } from '../services/Context'
import { useNavigate } from "react-router-dom";
import StompClient from "../services/StompClient"

const SignIn = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { setNotification, setUser, user, setStompClient, setNewMessages } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/connections");
        } else {
            authenticateUser()
        }

        async function authenticateUser() {
            const jwt = localStorage.getItem("jwt")
            if (jwt) {
                try {
                    const response = await apiClient.getUserFromJwt(jwt)
                    if (response) {
                        const stompClient = new StompClient("http://localhost:8080/ws", jwt, response.username, setNewMessages);
                        stompClient.connect()
                        setStompClient(stompClient)
                        setUser(response)
                    } else {
                        localStorage.removeItem("jwt")
                    }
                } catch (ex) {
                    console.log(ex);
                    localStorage.removeItem("jwt")
                }
            }
        }
    }, [user, navigate, setUser, setNewMessages, setStompClient])

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
            apiClient.setAuthorizationHeader(jwt)
            const stompClient = new StompClient("http://localhost:8080/ws", jwt, response.username, setNewMessages);
            stompClient.connect()
            setStompClient(stompClient)
            setUser(response)
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