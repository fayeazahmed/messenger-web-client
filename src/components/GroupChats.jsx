import React, { useCallback, useContext, useEffect, useState } from 'react'
import "../styles/GroupChats.css";
import apiClient from '../services/ApiClient';
import { Context } from '../services/Context';
import GroupChat from './GroupChat';

const GroupChats = () => {
    const [groupChats, setGroupChats] = useState([])
    const [newGroupTitle, setNewGroupTitle] = useState("")
    const [newGroupMembers, setNewGroupMembers] = useState("")
    const [memberSuggestions, setMemberSuggestions] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([])
    const [createPanel, setCreatePanel] = useState(false)
    const { connections, user } = useContext(Context);

    const getGroupChats = useCallback(async () => {
        const groupChats = await apiClient.getGroupChats()
        setGroupChats(groupChats)
    }, [setGroupChats]);

    useEffect(() => {
        getGroupChats()
    }, [getGroupChats])

    const showAddMemberSuggestion = e => {
        const username = e.target.value
        setNewGroupMembers(username)
        if (username.trim()) {
            const connectionList = connections.map(connection => connection.sender.username === user.username ? connection.receiver.username : connection.sender.username)
            const suggestedUsers = connectionList.filter(user => user.includes(username) && !selectedMembers.includes(user))
            setMemberSuggestions(suggestedUsers)
        } else {
            setMemberSuggestions([])
        }
    }

    const addMember = username => {
        setSelectedMembers([...selectedMembers, username])
        setNewGroupMembers("")
        setMemberSuggestions([])
    }

    const removeMember = username => {
        setSelectedMembers(prev => prev.filter(user => user !== username))
    }

    const createGroupChat = async () => {
        if (selectedMembers.length > 1) {
            const newGroupChat = await apiClient.createGroupChat({
                title: newGroupTitle,
                usernames: selectedMembers
            })

            if (newGroupChat) {
                setGroupChats([...groupChats, newGroupChat])
                setNewGroupTitle("")
                setNewGroupMembers("")
                setMemberSuggestions([])
                setSelectedMembers([])
                setCreatePanel(false)
            }
        }
    }

    return (
        <div className="group-chats">
            <p className="group-chats-header">Group Chats</p>
            {
                groupChats.map(chat => <GroupChat key={chat.id} chat={chat} />)
            }
            <div className="my-2 text-start">
                <button className="btn btn-sm btn-primary" onClick={() => setCreatePanel(!createPanel)}>+ Create New</button>
            </div>
            {
                createPanel && <div className="group-chats-create">
                    <input className="group-chats-create-title" type="text" placeholder="title" value={newGroupTitle} onChange={e => setNewGroupTitle(e.target.value)} />
                    <input className="group-chats-create-members" type="text" placeholder="members" value={newGroupMembers} onChange={showAddMemberSuggestion} />
                    <div className="group-chats-create-members-list">
                        {
                            selectedMembers.map((member, i) => <div key={i} className="group-chats-create-members-list-item">
                                @{member} <i onClick={() => removeMember(member)} className="fa fa-minus-circle" aria-hidden="true"></i>
                            </div>)
                        }
                    </div>
                    <div>
                        {
                            memberSuggestions.map((member, i) => <p key={i} onClick={() => addMember(member)} className="group-chats-create-members-suggestion">@{member}</p>)
                        }
                    </div>
                    <button onClick={createGroupChat} className="group-chats-create-submit btn btn-sm btn-success">Start Group Chat</button>
                </div>
            }
        </div>
    )
}

export default GroupChats