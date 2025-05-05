import axios from 'axios';

class ApiClient {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
    }

    setAuthorizationHeader(token) {
        this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    removeAuthorizationHeader() {
        this.client.defaults.headers['Authorization'] = null
    }

    async signIn(username, password) {
        const response = await this.client.post("/user/authenticate", { username, password })
        console.log(response);
        return response.data.data
    }

    async getUserFromJwt(jwt) {
        this.client.defaults.headers['Authorization'] = `Bearer ${jwt}`;
        const response = await this.client.get("/user")
        console.log(response);
        return response.data.data
    }

    async getConnections() {
        const response = await this.client.get(`/connection`)
        console.log(response);
        return response.data.data
    }

    async search(query) {
        const response = await this.client.get(`/connection/search?query=${query}`)
        console.log(response);
        return response.data.data
    }

    async getConnectionRequests() {
        const response = await this.client.get(`/connection/request`)
        console.log(response);
        return response.data.data
    }

    async addConnection(username) {
        const response = await this.client.post(`/connection/request?receiverUsername=${username}`)
        console.log(response);
        return response.data
    }

    async handleConnectionRequest(connectionId, isAccepted) {
        const response = await this.client.post(`/connection/request/accept?connectionId=${connectionId}&isAccepted=${isAccepted}`)
        console.log(response);
        return response.data.data
    }

    async getMessages(chatId) {
        const response = await this.client.get(`/message/${chatId}`)
        console.log(response);
        return response.data.data
    }

    async updateConnectionTheme(connectionId, theme) {
        const response = await this.client.put(`/connection/theme/${connectionId}?theme=${theme}`)
        console.log(response);
        return response.data.data
    }

    async getLastReadMessage(chatId) {
        const response = await this.client.get(`/read-message/${chatId}`)
        console.log(response);
        return response.data.data
    }

    async deleteConnection(connectionId) {
        const response = await this.client.delete(`/connection/${connectionId}`)
        console.log(response);
        return response.data.data
    }

    async getUserSettings() {
        const response = await this.client.get(`/user/user-settings`)
        console.log(response);
        return response.data.data
    }

    async updateUserSettings(settings) {
        const response = await this.client.put(`/user/user-settings`, settings)
        console.log(response);
        return response.data.data
    }

    async getGroupChats() {
        const response = await this.client.get(`/chat/group`)
        console.log(response);
        return response.data.data
    }

    async createGroupChat(groupChatDto) {
        const response = await this.client.post(`/chat/group`, groupChatDto)
        console.log(response);
        return response.data.data
    }

    async getChat(chatId) {
        const response = await this.client.get(`/chat/${chatId}`)
        console.log(response);
        return response.data.data
    }

    async updateGroupChatSettings(settings) {
        const response = await this.client.put(`/chat/group-settings`, settings)
        console.log(response);
        return response.data.data
    }
}

const apiClient = new ApiClient('http://localhost:8080');
export default apiClient;
