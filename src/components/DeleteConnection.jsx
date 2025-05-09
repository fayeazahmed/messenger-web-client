import React from 'react'
import apiClient from '../services/ApiClient'
import { useNavigate } from 'react-router-dom';

const DeleteConnection = ({ connectionId, chatId, setDeleteConnectionSelected }) => {
    const navigate = useNavigate();

    const handler = async () => {
        if (connectionId) {
            await apiClient.deleteConnection(connectionId)
        } else if (chatId) {
            await apiClient.leaveGroupChat(chatId)
        }
        navigate("/");
    }

    return (
        <div className="delete-connection">
            <button className="btn btn-sm btn-primary" onClick={() => setDeleteConnectionSelected(false)}>Cancel</button>
            <button className="btn btn-sm btn-danger" onClick={handler}>Confirm</button>
        </div>
    )
}

export default DeleteConnection