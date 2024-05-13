import { Redis } from "ioredis";

class SessionStore {
    // Abstract methods
    findSession(id) { }
    saveSession(id, session) { }
    findAllSessions() { }
}
const prefix = 'session:'
export class RedisSessionStore extends SessionStore {
    constructor(redisConfig) {
        super();
        this.redis = new Redis(redisConfig);
    }

    async findSession(id) {
        try {
            const session = await this.redis.hgetall(prefix+id);
            return session;
        } catch (error) {
            console.log("findSession", error);
            return {};
        }
    }

    async saveSession(id, session) {
        try {
            await this.redis.hmset(prefix+id, session);
        } catch (error) {
            console.log("saveSession", error);
        }
    }

    async removeSession(id) {
        try {
            await this.redis.del(prefix+id);
        } catch (error) {
            console.log("removeSession", error);
        }
    }

    async findAllSessions() {
        try {
            const keys = await this.redis.keys(prefix+'*');
            const sessions = await Promise.all(keys.map(key => this.redis.hgetall(key)));
            return sessions;
        } catch (error) {
            console.log('findAllSession', error);
            return [];
        }
    }

    async updateSessionOnlineStatus(id, isOnline) {
        try {
            const session = await this.findSession(prefix+id);
            if (session.userID)
                await this.redis.hset(prefix+id, 'connected', isOnline);
        } catch (error) {
            console.log("updateSessionOnlineStatus", error);
        }
    }

    async updateSessionlastSeen(id, lastSeen) {
        try {
            const session = await this.findSession(prefix+id);
            if (session.userID)
                await this.redis.hset(prefix+id, 'lastSeen', lastSeen);
        } catch (error) {
            console.log("updateSessionlastSeen", error);
        }
    }
}
