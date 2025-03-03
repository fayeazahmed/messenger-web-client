import { getLastOnlineAt } from "./dateUtils";

function modifyConnectionListResponse(connections) {
    return connections.map((item) => ({
        ...item.connection,
        isOnline: item.online,
        lastMessage: item.lastMessage,
        isUnread: item.unread,
    }));
}

function getUsernameTitleFromConnection(connection, currentUser) {
    return connection.sender.username === currentUser.username
        ? connection.receiver.username
        : connection.sender.username;
}

function getLastOnlineAtFromConnection(connection, currentUser) {
    const lastOnlineAt =
        connection.sender.username === currentUser.username
            ? connection.receiver.lastOnlineAt
            : connection.sender.lastOnlineAt;

    return getLastOnlineAt(lastOnlineAt)
}

function getConnectionTitleComponent(title, lastMessage, lastMessageUnread) {
    return <div className={`connection-title ${lastMessageUnread ? "connection-title-bold" : ""}`}>
        <div className="connection-user">{title}</div>
        <div className="connection-last-message">{lastMessage}</div>
    </div>
}

function getConnectionOnlineComponent(connection, lastSeen) {
    return connection?.isOnline ? (<i className="fa fa-circle" aria-hidden="true"></i>) : (<p className="m-0">{lastSeen}</p>)
}

export {
    modifyConnectionListResponse,
    getUsernameTitleFromConnection,
    getLastOnlineAtFromConnection,
    getConnectionTitleComponent,
    getConnectionOnlineComponent,
};
