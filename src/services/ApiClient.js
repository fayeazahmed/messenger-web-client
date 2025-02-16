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

    async acceptConnection(connectionId) {
        const response = await this.client.post(`/connection/request/accept?connectionId=${connectionId}`)
        console.log(response);
        return response.data.data
    }

    async getMessages(chatId) {
        const response = await this.client.get(`/message/${chatId}`)
        console.log(response);
        return response.data.data
    }
}

const apiClient = new ApiClient('http://localhost:8080');
export default apiClient;
