import React from 'react'
import apiClient from '../services/ApiClient'
import { useNavigate } from 'react-router-dom';

const DeleteConnection = ({ connectionId, setDeleteConnectionSelected }) => {
    const navigate = useNavigate();

    const deleteConnection = async () => {
        await apiClient.deleteConnection(connectionId)
        navigate("/");
    }

    return (
        <div className="delete-connection">
            <button className="btn btn-sm btn-primary" onClick={() => setDeleteConnectionSelected(false)}>Cancel</button>
            <button className="btn btn-sm btn-danger" onClick={deleteConnection}>Confirm delete</button>
        </div>
    )
}

export default DeleteConnection