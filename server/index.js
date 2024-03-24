import express from "express";
import http from "http";
import { Server } from "socket.io";
import { InMemorySessionStore } from "./sessionStore.js";
import crypto from 'crypto';
import { MESSAGE_SEEN, PRIVATE_MESSAGE, SEND_TYPING_STATUS, SESSION, USERS, USER_DISCONNECTED, CONNECTION, DISCONNECT, MESSAGE_SENT, MESSAGE_DELIVERED, USER_CONNECTED, SEND_ALL_UNSENT_MESSAGES } from "./types.js";
import { MessageStore } from "./messageStore.js";
import { Redis } from "ioredis";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        allowedHeaders: ['*'],
        origin: "*",
    }
});

const pub = new Redis({
    host: 'redis-3ef71560-dtom7628-12a0.a.aivencloud.com',
    password: 'AVNS_60F23DRcodnrbSyeQ_i',
    port: 26911,
    username: 'default'
});

const sub = new Redis({
    host: 'redis-3ef71560-dtom7628-12a0.a.aivencloud.com',
    password: 'AVNS_60F23DRcodnrbSyeQ_i',
    port: 26911,
    username: 'default'
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

io.on(CONNECTION,async (socket) => {

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

    // no redis
    socket.emit(SESSION, {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    sub.subscribe(PRIVATE_MESSAGE);
    sub.subscribe(MESSAGE_DELIVERED);
    sub.subscribe(MESSAGE_SEEN);
    sub.subscribe(SEND_TYPING_STATUS);
    sub.subscribe(USER_DISCONNECTED);
    sub.subscribe(USER_CONNECTED);

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
    // no redis
    socket.emit(USERS, users);

    await pub.publish(USER_CONNECTED, JSON.stringify({
        userID: socket.userID,
        username: socket.username,
        connected: true,
        lastSeen: Date.now()
    }))

    socket.broadcast.emit(USER_CONNECTED, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        lastSeen: Date.now()
    });

    socket.on(PRIVATE_MESSAGE, async ({ content, to, id, from }) => {
        //no redis
        socket.emit(MESSAGE_SENT, { messageID: id, to });
        messageStore.addMessage({ id, content, from, to });
        await pub.publish(PRIVATE_MESSAGE, JSON.stringify({
            content,
            from: from,
            to,
            id: id
        }))
    });

    socket.on(MESSAGE_DELIVERED, async ({ messageID, to, from }) => {
        messageStore.removeMessage(messageID);
        await pub.publish(MESSAGE_DELIVERED, JSON.stringify({
            messageID, to, from
        }))
    })

    socket.on(MESSAGE_SEEN, async ({ messageID, to, from }) => {
        await pub.publish(MESSAGE_SEEN, JSON.stringify({
            messageID, to, from
        }))
    })

    socket.on(SEND_TYPING_STATUS, async ({ from, to, status }) => {
        await pub.publish(SEND_TYPING_STATUS, JSON.stringify({ from, to, status }))
    })

    socket.on(DISCONNECT, async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            sessionStore.updateSessionOnlineStatus(socket.sessionID, false);
            sessionStore.updateSessionlastSeen(socket.userID, Date.now());
            const user = sessionStore.findSession(socket.sessionID);
            await pub.publish(USER_DISCONNECTED, JSON.stringify({ user }))
            sub.unsubscribe(PRIVATE_MESSAGE);
            sub.unsubscribe(MESSAGE_DELIVERED);
            sub.unsubscribe(MESSAGE_SEEN);
            sub.unsubscribe(SEND_TYPING_STATUS);
            sub.unsubscribe(USER_DISCONNECTED);
            sub.unsubscribe(USER_CONNECTED);
        }
    });
});

sub.on('message', async (channel, message) => {
    if (channel === PRIVATE_MESSAGE) {
        const msg = JSON.parse(message);
        io.to(msg.to).to(msg.from).emit(PRIVATE_MESSAGE, msg);
    }
    else if (channel === MESSAGE_DELIVERED) {
        const msg = JSON.parse(message);
        io.to(msg.to).to(msg.from).emit(MESSAGE_DELIVERED, msg);
    }
    else if (channel === MESSAGE_SEEN) {
        const msg = JSON.parse(message);
        io.to(msg.to).to(msg.from).emit(MESSAGE_SEEN, msg);
    }
    else if (channel === SEND_TYPING_STATUS) {
        const msg = JSON.parse(message);
        io.to(msg.to).to(msg.from).emit(SEND_TYPING_STATUS, msg);
    }
    else if (channel === USER_DISCONNECTED) {
        const msg = JSON.parse(message);
        io.emit(USER_DISCONNECTED, msg.user);
    }
    else if (channel === USER_CONNECTED) {
        const msg = JSON.parse(message);
        if(msg.userID!==io.userID)
        io.emit(USER_CONNECTED, msg);
    }
})

app.get('/', (req, res) => {
    res.send('hello how are you?');
})

server.listen(3001, () => {
    console.log("server started at port " + 3001);
})