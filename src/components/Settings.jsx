import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Context } from '../services/Context';
import "../styles/Settings.css"
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/ApiClient';

const Settings = () => {
    const { darkMode, setDarkMode, user, setHeaderText } = useContext(Context);
    const [activeStatus, setActiveStatus] = useState(true)
    const navigate = useNavigate();

    const setTheme = () => {
        setDarkMode(!darkMode)
        localStorage.setItem("allin1-theme", darkMode ? "light" : "dark")
    }

    const getSettings = useCallback(async () => {
        const settings = await apiClient.getUserSettings()
        setActiveStatus(settings.onlineVisible)
    }, []);

    const updateSettings = async () => {
        const isOnlineVisible = !activeStatus
        await apiClient.updateUserSettings({ isOnlineVisible })
        setActiveStatus(isOnlineVisible)
    }

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            setHeaderText("Settings")
            getSettings()
        }
    }, [user, navigate, setHeaderText, getSettings])

    return (
        <div className="settings p-3">
            <div className="settings-content theme">
                <div className="settings-content-image">
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={setTheme}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <div>Dark Mode</div>
            </div>
            <div className="settings-content active-status">
                <div className="settings-content-image">
                    <div className={`status-indicator ${activeStatus ? "active" : "inactive"}`}
                        onClick={updateSettings}>
                    </div>
                </div>
                <div className="status-text">Online Status</div>
            </div>
        </div>
    )
}

export default Settings