// ChatMain.tsx
import React, {  useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, clearUnseenMessagesIds, pushUnseenMessagesIds, selectMessages, selectUnseenMessages, updateMessages } from '../store/messagesSlice';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import socket from '../socket';
import { randomId } from '../utils';
import { MESSAGE_DELIVERED, MESSAGE_SEEN, MESSAGE_SENT, Message, PRIVATE_MESSAGE, users } from '../utils/types';
import Header from './Header';

interface ChatMainProps {
  user: users;
  setSelectedUser: React.Dispatch<React.SetStateAction<users | null>>;
}

const ChatMain: React.FC<ChatMainProps> = ({ user, setSelectedUser }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const unseenMessages = useSelector(selectUnseenMessages);
  const userID = localStorage.getItem('userID');

  const handleSend = (message: string) => {
    if (!message) return;
    const newMessage: Message = {
      id: randomId(),
      content: message,
      from: userID,
      to: user?.userID,
      seen: undefined
    };
    dispatch(addMessage({ userID: user.userID, message: newMessage }));
    socket.emit(PRIVATE_MESSAGE, {
      content: message,
      to: user?.userID,
      id: newMessage.id,
      from: userID
    });
  };

  useEffect(() => {
    if (unseenMessages[user.userID]) {
      unseenMessages[user.userID].forEach((message) => {
        socket.emit(MESSAGE_SEEN, { messageID: message.id, from: message.to, to: message.from });
        dispatch(clearUnseenMessagesIds({ userID: user.userID, messageID: message.id }));
      })
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(messages));

    socket.on(PRIVATE_MESSAGE, ({ content, from, to, id }) => {
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
        dispatch(pushUnseenMessagesIds({ userID: from, message: newMessage }));
        localStorage.setItem('unseen_chats', JSON.stringify(unseenMessages));
      }
    });

    socket.on(MESSAGE_SENT, ({ messageID, to }) => {
      setTimeout(() => {
        dispatch(updateMessages({ userID: to || '', messageID: messageID, value: MESSAGE_SENT }))
      }, 1000);
    })

    socket.on(MESSAGE_DELIVERED, ({ messageID, to, from }) => {
      if (to === userID) {
        setTimeout(() => {
          dispatch(updateMessages({ userID: from, messageID: messageID, value: MESSAGE_DELIVERED }))
        }, 2000);
      }
    })

    socket.on(MESSAGE_SEEN, ({ messageID, to, from }) => {
      if (to === userID) {
        setTimeout(() => {
          dispatch(updateMessages({ userID: from, messageID: messageID, value: MESSAGE_SEEN }))
        }, 3000);
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
          <ChatMessage key={msg.id} seen={msg.seen || undefined} message={msg.content} isSender={msg.from === userID} />
        ))}
      </div>
      <ChatInput onSend={handleSend} from={userID} to={user.userID} />
    </div>
  );
};

export default ChatMain;
