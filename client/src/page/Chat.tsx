import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import Sidebar from '../components/Sidebar';
import ChatMain from '../components/ChatMain';
import { MESSAGE_DELIVERED, Message, PRIVATE_MESSAGE, SEND_ALL_UNSENT_MESSAGES, SESSION, USERS, USER_CONNECTED, USER_DISCONNECTED, users } from '../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { addAllUsers, addUser, selectUsers, updateLastSeen, updateOnlineStatus } from '../store/usersSlice';
import { addMessage, pushUnseenMessagesIds, selectMessages, selectUnseenMessages } from '../store/messagesSlice';

const Chat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userState = useSelector(selectUsers);
    const [selectedUser, setSelectedUser] = useState<users | null>(null);
    const unseenMessages = useSelector(selectUnseenMessages);
    const messages = useSelector(selectMessages);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        }
        else {
            const sessionID = localStorage.getItem('sessionID');
            const authenticationData = {
                username: username,
                sessionID: sessionID
            };
            socket.auth = authenticationData
            socket.connect();
            socket.on(SESSION, ({ sessionID, userID }) => {
                socket.auth = { sessionID };
                localStorage.setItem("sessionID", sessionID);
                localStorage.setItem("userID", userID);
                socket.on(USERS, (users: users[]) => {
                    dispatch(addAllUsers({ users, userID }))
                })
            });
            socket.on(SEND_ALL_UNSENT_MESSAGES, ({ content, from, to, id }) => {
                const newMessage: Message = {
                    id: id,
                    content: content,
                    from: from,
                    to: to
                };
                socket.emit(MESSAGE_DELIVERED, { messageID: id, to: from, from: to });
                dispatch(addMessage({ userID: from, message: newMessage }));
                // dispatch(updateUnreadMessageStatus({ userID: from, status: 1 }));
                dispatch(pushUnseenMessagesIds({ userID: from, message: newMessage }));
                console.log(unseenMessages);
                localStorage.setItem('unseen_chats', JSON.stringify(unseenMessages));
            })
        }
        return () => {
            socket.off(SESSION)
            socket.off(SEND_ALL_UNSENT_MESSAGES)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('unseen_chats', JSON.stringify(unseenMessages));
        localStorage.setItem('chats', JSON.stringify(messages));
        if (!selectedUser) {
            socket.on(PRIVATE_MESSAGE, ({ content, from, to, id }) => {
                const newMessage: Message = {
                    id: id,
                    content: content,
                    from: from,
                    to: to
                };
                socket.emit(MESSAGE_DELIVERED, { messageID: id, to: from, from: to });
                dispatch(addMessage({ userID: from, message: newMessage }));
                dispatch(pushUnseenMessagesIds({ userID: from, message: newMessage }));
            });
        }
        return () => {
            socket.off(PRIVATE_MESSAGE);
            socket.off(MESSAGE_DELIVERED);
        };
    }, [dispatch, unseenMessages, messages]);

    useEffect(() => {
        socket.on(USER_CONNECTED, (user: users) => {
            console.log("user connected called");
            if (user.userID !== (localStorage.getItem('userID') || '')) {
                dispatch(addUser({ user }));
                dispatch(updateOnlineStatus({ userID: user.userID, status: true }));
            }
        })

        socket.on(USER_DISCONNECTED, (user: users) => {
            // console.log();
            dispatch(updateOnlineStatus({ userID: user.userID, status: false }));
            dispatch(updateLastSeen({ userID: user.userID, lastSeen: user.lastSeen }));
        })

        return () => {
            socket.off(USER_CONNECTED)
            socket.off(USER_DISCONNECTED)
        }
    }, [dispatch, userState])

    return (
        <div className='flex w-full h-screen'>
            <Sidebar users={userState} setSelectedUser={setSelectedUser} />
            {selectedUser ? <div className='w-full h-screen'>
                <ChatMain user={selectedUser} setSelectedUser={setSelectedUser} />
            </div> : <div className='flex justify-center items-center w-full h-screen'>
            </div>}
        </div>
    )
}

export default Chat