import express from "express";
import http from "http";
import { Server } from "socket.io";
import { InMemorySessionStore } from "./sessionStore.js";
import crypto from 'crypto';
import { MESSAGE_SEEN, PRIVATE_MESSAGE, SEND_TYPING_STATUS, SESSION, USERS, USER_DISCONNECTED, CONNECTION, DISCONNECT, MESSAGE_SENT, MESSAGE_DELIVERED, USER_CONNECTED, SEND_ALL_UNSENT_MESSAGES } from "./types.js";
import { MessageStore } from "./messageStore.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        allowedHeaders: ['*'],
        origin: "*",
    }
});

const sessionStore = new InMemorySessionStore();
const messageStore = new MessageStore();
const randomId = () => crypto.randomBytes(8).toString("hex");

io.use((socket, next) => {
    const { username, sessionID } = socket.handshake.auth;
    if (sessionID) {
        // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    if (!username) {
        return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
});

io.on(CONNECTION, (socket) => {

    if (!sessionStore.findSession(socket.sessionID)) {
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: true,
            lastSeen: Date.now()
        });
    }
    else {
        sessionStore.updateSessionOnlineStatus(socket.sessionID, true);
        sessionStore.updateSessionlastSeen(socket.sessionID, Date.now());
        const messages = messageStore.getMessages(socket.userID);
        if (messages) {
            messages.forEach((msg) => {
                console.log(msg);
                socket.emit(SEND_ALL_UNSENT_MESSAGES, msg);
                messageStore.removeMessage(msg.id);
            })
        }
    }

    socket.emit(SESSION, {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    socket.join(socket.userID);

    const users = [];
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userID: session.userID,
            username: session.username,
            connected: session.connected,
            lastSeen: session.lastSeen
        });
    });
    socket.emit(USERS, users);

    socket.broadcast.emit(USER_CONNECTED, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        lastSeen: Date.now()
    });

    socket.on(PRIVATE_MESSAGE, async ({ content, to, id, from }) => {
        socket.emit(MESSAGE_SENT, { messageID: id, to });
        messageStore.addMessage({ id, content, from, to });
        socket.to(to).to(from).emit(PRIVATE_MESSAGE, {
            content,
            from: from,
            to,
            id: id
        });
    });

    socket.on(MESSAGE_DELIVERED, ({ messageID, to, from }) => {
        messageStore.removeMessage(messageID);
        socket.to(to).to(from).emit(MESSAGE_DELIVERED, {
            messageID, to, from
        });
    })

    socket.on(MESSAGE_SEEN, ({ messageID, to, from }) => {
        socket.to(to).to(from).emit(MESSAGE_SEEN, {
            messageID, to, from
        });
    })

    socket.on(SEND_TYPING_STATUS, ({ from, to, status }) => {
        socket.to(to).to(from).emit(SEND_TYPING_STATUS, { from, to, status })
    })

    socket.on(DISCONNECT, async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            sessionStore.updateSessionOnlineStatus(socket.sessionID, false);
            sessionStore.updateSessionlastSeen(socket.userID, Date.now());
            const user = sessionStore.findSession(socket.sessionID);
            socket.broadcast.emit(USER_DISCONNECTED, user);
        }
    });
});

app.get('/', (req, res) => {
    res.send('hello how are you?');
})

server.listen(3001, () => {
    console.log("server started at port " + 3001);
})
