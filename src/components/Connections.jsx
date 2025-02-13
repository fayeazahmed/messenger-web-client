import React, { useContext, useEffect, useState } from 'react'
import Connection from './Connection'
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"
import AddConnection from './AddConnection';

const Connections = () => {
    const [connections, setConnections] = useState([])
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            getConnections()
        }

        async function getConnections() {
            const connections = await apiClient.getConnections()
            setConnections(connections)
        }
    }, [user, navigate])

    return (
        <div className="connections">
            {
                connections.map((connection, index) => <Connection key={index} connection={connection} />)
            }
            <AddConnection />
        </div>
    )
}

export default Connections