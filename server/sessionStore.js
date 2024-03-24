class SessionStore {
    findSession(id) { }
    saveSession(id, session) { }
    findAllSessions() { }
}

export class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    removeSession(id) {
        this.sessions.delete(id);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }

    updateSessionOnlineStatus(id, isOnline) {
        const session = this.findSession(id);
        if (session) {
            session.connected = isOnline;
            this.saveSession(id, session);
        }
    }

    updateSessionlastSeen(id, lastSeen) {
        const session = this.findSession(id);
        if (session) {
            session.lastSeen = lastSeen;
            this.saveSession(id, session);
        }
    }
}