import React, { useCallback, useContext, useEffect } from 'react'
import Connection from './Connection'
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"
import AddConnection from './AddConnection';

const Connections = () => {
    const { user, setHeaderText, connections, setConnections } = useContext(Context);
    const navigate = useNavigate();

    const getConnections = useCallback(async () => {
        const connectionListResponse = await apiClient.getConnections()
        const existingIds = new Set(connections.map(conn => conn.id))

        const updatedConnections = [
            ...connections.filter(conn => existingIds.has(conn.id)),
            ...connectionListResponse.filter(conn => !existingIds.has(conn.id))
        ]

        setConnections(updatedConnections)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            setHeaderText("Connections")
            getConnections()
        }
    }, [user, navigate, getConnections, setHeaderText])

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