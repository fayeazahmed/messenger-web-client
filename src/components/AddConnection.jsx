import React, { useContext, useEffect, useState } from 'react'
import "../styles/AddConnection.css";
import apiClient from "../services/ApiClient"
import Connect from './Connect';
import { Context } from "../services/Context";

const AddConnection = () => {
    const [connectionRequests, setConnectionRequests] = useState([])
    const [searchList, setSearchList] = useState([])
    const [searchText, setSearchText] = useState("")
    const { user } = useContext(Context);


    useEffect(() => {
        async function getConnectionRequests() {
            const connectionRequests = await apiClient.getConnectionRequests()
            setConnectionRequests(connectionRequests);
        }

        getConnectionRequests()
    }, [])

    const searchUsers = async (e) => {
        if (e.target.value.length > 2) {
            const users = await apiClient.search(e.target.value)
            setSearchList(users)
        } else {
            setSearchList([])
        }
    }

    return (
        <div className="add-connection mt-4">
            <div className="add-connection-requests">
                {connectionRequests.length > 0 && <p className="add-connection-requests-header">Connection Requests</p>}
                {
                    connectionRequests.map((result, index) => <Connect caller="REQUESTS" key={index} connection={result} user={result.sender} currentUser={user} setConnectionRequests={setConnectionRequests} setSearchList={setSearchList} />)
                }
            </div>
            <input className="add-connection-search-input" value={searchText} onInput={searchUsers} onChange={e => setSearchText(e.target.value)} type="text" placeholder="Type to search for users..." />
            <div className="add-connection-users">
                {
                    searchList.map((result, index) => <Connect caller="SEARCH" key={index} connection={result.connection} user={result.user} currentUser={user} setConnectionRequests={setConnectionRequests} setSearchList={setSearchList} />)
                }
            </div>
        </div>
    )
}

export default AddConnection