// ChatMain.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, clearUnseenMessagesIds, fetchMessages, pushUnseenMessagesIds, selectMessages, selectUnseenMessages, updateMessages } from '../store/messagesSlice';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import socket from '../socket';
import { randomId } from '../utils';
import { MESSAGE_DELIVERED, MESSAGE_SEEN, MESSAGE_SENT, Message, PRIVATE_MESSAGE, users } from '../utils/types';
import Header from './Header';
import { deleteUnseenMessage, saveMessage, saveUnseenMessage, updateMessage } from '../services/database';

interface ChatMainProps {
  user: users;
  setSelectedUser: React.Dispatch<React.SetStateAction<users | null>>;
}

const ChatMain: React.FC<ChatMainProps> = ({ user, setSelectedUser }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const unseenMessages = useSelector(selectUnseenMessages);
  const userID = localStorage.getItem('userID') || '';

  const handleSend = async (message: string) => {
    if (!message) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      from: userID,
      to: user?.userID,
      seen: 'message sending'
    };
    await saveMessage(user.userID, newMessage);
    dispatch(addMessage({ userID: user.userID, message: newMessage }));
    socket.emit(PRIVATE_MESSAGE, {
      content: message,
      to: user?.userID,
      id: newMessage.id,
      from: userID,
      seen: 'message sending'
    });
  };

  useEffect(() => {
    dispatch(fetchMessages(user?.userID))
  }, [])

  useEffect(() => {
    if (unseenMessages[user.userID]) {
      unseenMessages[user.userID].forEach(async (message) => {
        await deleteUnseenMessage(message.id);
        socket.emit(MESSAGE_SEEN, { messageID: message.id, from: message.to, to: message.from });
        dispatch(clearUnseenMessagesIds({ userID: user.userID, messageID: message.id }));
      })
    }
  }, [user])

  useEffect(() => {

    socket.on(PRIVATE_MESSAGE, async ({ content, from, to, id }) => {
      const newMessage: Message = {
        id: id,
        content: content,
        from: from,
        to: to
      };
      socket.emit(MESSAGE_DELIVERED, { messageID: id, to: from, from: to });
      dispatch(addMessage({ userID: from, message: newMessage }));
      if (from === user.userID) {
        socket.emit(MESSAGE_SEEN, { messageID: id, from: to, to: from });
      }
      else {
        await saveUnseenMessage(newMessage);
        dispatch(pushUnseenMessagesIds({ userID: from, message: newMessage }));
      }
    });

    socket.on(MESSAGE_SENT, async ({ messageID, to }) => {
      await updateMessage(to, messageID, MESSAGE_SENT);
      dispatch(updateMessages({ userID: to || '', messageID: messageID, value: MESSAGE_SENT }))
    })

    socket.on(MESSAGE_DELIVERED, async ({ messageID, to, from }) => {
      if (to === userID) {
        await updateMessage(from, messageID, MESSAGE_DELIVERED);
        dispatch(updateMessages({ userID: from, messageID: messageID, value: MESSAGE_DELIVERED }))
      }
    })

    socket.on(MESSAGE_SEEN, async ({ messageID, to, from }) => {
      if (to === userID) {
        await updateMessage(from, messageID, MESSAGE_SEEN);
        dispatch(updateMessages({ userID: from, messageID: messageID, value: MESSAGE_SEEN }))
      }
    })

    return () => {
      socket.off(MESSAGE_SENT);
      socket.off(PRIVATE_MESSAGE);
      socket.off(MESSAGE_DELIVERED);
      socket.off(MESSAGE_SEEN);
    };

  }, [dispatch, messages, user]);

  return (
    <div key={user.userID} className="flex flex-col h-full">
      <Header setSelectedUser={setSelectedUser} user={user} />
      <div className="flex-grow p-4 overflow-y-auto">
        {messages[user?.userID] && messages[user?.userID].map(msg => (
          <ChatMessage key={msg.id} seen={msg?.seen} message={msg.content} isSender={msg.from === userID} />
        ))}
      </div>
      <ChatInput onSend={handleSend} from={userID} to={user.userID} />
    </div>
  );
};

export default ChatMain;
