import express from "express";
import http from "http";
import { Server } from "socket.io";
import { RedisSessionStore } from "./stores/sessionStore.js";
import crypto from 'crypto';
import { MESSAGE_SEEN, PRIVATE_MESSAGE, SEND_TYPING_STATUS, SESSION, USERS, USER_DISCONNECTED, CONNECTION, DISCONNECT, MESSAGE_SENT, MESSAGE_DELIVERED, USER_CONNECTED, SEND_ALL_UNSENT_MESSAGES } from "./constants.js";
import { MessageStore } from "./stores/messageStore.js";
import { Redis } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const pub = new Redis();
const sub = pub.duplicate();

pub.on("error", (err) => {
    console.log(err.message);
});

sub.on("error", (err) => {
    console.log(err.message);
});

const init = () => {
    try {
        io.adapter(createAdapter(pub, sub));
    } catch (error) {
        console.log("error 48", error);
    }
}
init();

const sessionStore = new RedisSessionStore();
const messageStore = new MessageStore();
const randomId = () => crypto.randomBytes(8).toString("hex");

io.use(async (socket, next) => {
    const { username, sessionID, userID } = socket.handshake.auth;
    if (sessionID) {
        // find existing session
        const session = await sessionStore.findSession(sessionID);
        if (session.userID) {
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
    socket.userID = userID;
    socket.username = username;
    next();
});

io.on(CONNECTION, async (socket) => {
    const session = await sessionStore.findSession(socket.sessionID);
    if (!session.userID) {
        await sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: true,
            lastSeen: Date.now()
        });
    }
    else {
        await sessionStore.updateSessionOnlineStatus(socket.sessionID, true);
        await sessionStore.updateSessionlastSeen(socket.sessionID, Date.now());
        const messages = await messageStore.getMessages(socket.userID);
        if (messages.length) {
            messages.forEach(async (msg) => {
                socket.emit(SEND_ALL_UNSENT_MESSAGES, msg);
                await messageStore.removeMessage(socket.userID);
            })
        }
    }

    socket.emit(SESSION, {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    socket.join(socket.userID);

    const users = [];
    const sessions = await sessionStore.findAllSessions();
    sessions.forEach((session) => {
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

    // u1 --> server 
    

    socket.on(PRIVATE_MESSAGE, async ({ content, to, id, from }) => {
        socket.emit(MESSAGE_SENT, { messageID: id, to });
        await messageStore.addMessage(to, { id, content, from, to });
        socket.to(to).to(from).emit(PRIVATE_MESSAGE, {
            content,
            from: from,
            to,
            id: id
        });
    });

    socket.on(MESSAGE_DELIVERED, async ({ messageID, to, from }) => {
        await messageStore.removeMessage(socket.userID);
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
            await sessionStore.updateSessionOnlineStatus(socket.sessionID, false);
            await sessionStore.updateSessionlastSeen(socket.userID, Date.now());
            const user = await sessionStore.findSession(socket.sessionID);
            socket.broadcast.emit(USER_DISCONNECTED, user);
        }
    });
});

app.get('/', (req, res) => {
    res.send('hello how are you?');
})

server.listen(3001, () => {
    console.log("server started at port " + process.env.PORT || 3001);
})
