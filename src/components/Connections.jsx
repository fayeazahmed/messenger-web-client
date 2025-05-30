import React, { useCallback, useContext, useEffect } from 'react'
import Connection from './Connection'
import { Context } from "../services/Context";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient"
import AddConnection from './AddConnection';
import { modifyConnectionListResponse } from '../utils/connectionUtils';
import GroupChats from './GroupChats';

const Connections = () => {
    const { user, setHeaderText, connections, setConnections } = useContext(Context);
    const navigate = useNavigate();

    console.log(connections);

    const getConnections = useCallback(async () => {
        const connectionListResponse = await apiClient.getConnections()
        const connections = modifyConnectionListResponse(connectionListResponse)
        setConnections(connections)
    }, [setConnections])

    useEffect(() => {
        if (!user) {
            navigate("/");
        } else {
            setHeaderText("Connections")
            getConnections()
        }
    }, [user, navigate, getConnections, setHeaderText])

    if (!user) return
    return (
        <div className="connections">
            {
                connections.map((connection, index) => <Connection key={index} connection={connection} />)
            }
            <GroupChats />
            <AddConnection />
        </div>
    )
}

export default Connections