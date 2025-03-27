import React, { useContext, useEffect } from 'react'
import { Context } from '../services/Context';
import "../styles/Settings.css"
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { darkMode, setDarkMode, user, setHeaderText } = useContext(Context);
    const navigate = useNavigate();

    const setTheme = () => {
        setDarkMode(!darkMode)
        localStorage.setItem("allin1-theme", darkMode ? "light" : "dark")
    }

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            setHeaderText("Settings")
        }
    }, [user, navigate, setHeaderText])

    return (
        <div className="settings p-3">
            <div className="theme">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={setTheme}
                    />
                    <span className="slider"></span>
                </label>
                <div>Dark Mode</div>
            </div>
        </div>
    )
}

export default Settings