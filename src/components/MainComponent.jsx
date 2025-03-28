import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Connections from './Connections'
import Inbox from './Inbox'
import Settings from './Settings'
import Home from './Home'
import { Context } from '../services/Context'
import ConnectionSettings from './ConnectionSettings'

const MainComponent = () => {
    const { darkMode } = useContext(Context);

    return (
        <div className={`main-content ${darkMode ? "main-content-dark" : ""}`}>
            <Routes>
                <Route path="/connections" element={<Connections />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/connection-settings" element={<ConnectionSettings />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </div>
    )
}

export default MainComponent