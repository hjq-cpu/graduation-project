import config from "./base";

export const friendsService = {
    // 获取好友列表
    async getFriends(): Promise<any> {
        const response = await config.request.get("/friends");
        return response.data;
    },
    // 添加好友
    async addFriend(friendId: string): Promise<any> {
        const response = await config.request.post("/friends", { friendId });
        return response.data;
    },
    // 删除好友
    async removeFriend(friendId: string): Promise<any> {
        const response = await config.request.delete(`/friends/${friendId}`);
        return response.data;
    },
    // 获取好友请求
    async getFriendRequests(): Promise<any> {
        const response = await config.request.get("/friends/requests");
        return response.data;
    },
    // 接受好友请求
    async acceptFriendRequest(friendId: string): Promise<any> {
        const response = await config.request.post(`/friends/requests/${friendId}/accept`);
        return response.data;
    },
    // 拒绝好友请求
    async rejectFriendRequest(friendId: string): Promise<any> {
        const response = await config.request.post(`/friends/requests/${friendId}/reject`);
        return response.data;
    }
}