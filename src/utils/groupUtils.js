function getUsernameList(users) {
    return users.map(user => user.username)
}

export {
    getUsernameList
}