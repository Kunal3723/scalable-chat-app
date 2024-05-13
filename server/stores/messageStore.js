import { Redis } from "ioredis";

const prefix = 'messages:'
export class MessageStore {
    constructor(redisConfig) {
        this.redis = new Redis(redisConfig);
    }

    async addMessage(userId, message) {
        try {
            await this.redis.rpush(prefix+userId, JSON.stringify(message));
        } catch (error) {
            console.log("addMessage", error);
        }
    }

    async removeMessage(userId) {
        try {
            await this.redis.lpop(prefix+userId);
        } catch (error) {
            console.log("removeMessage", error);
        }
    }

    async getMessages(userId) {
        try {
            const messages = await this.redis.lrange(prefix+userId, 0, -1);
            return messages.map(message => JSON.parse(message));
        } catch (error) {
            console.log("getMessages ", error);
            return null;
        }
    }

    async isEmpty(userId) {
        const length = await this.redis.llen(prefix+userId);
        return length === 0;
    }
}
