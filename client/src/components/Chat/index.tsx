// ChatMain.tsx
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, clearUnseenMessagesIds, fetchMessages, pushUnseenMessagesIds, selectMessages, selectUnseenMessages, setChat, updateMessages } from '../../store/messagesSlice';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import socket from '../../socket';
import { MESSAGE_DELIVERED, MESSAGE_SEEN, MESSAGE_SENDING, MESSAGE_SENT, Message, PRIVATE_MESSAGE, users } from '../../utils/types';
import Header from '../Header';
import { deleteUnseenMessage, saveMessage, saveUnseenMessage, updateMessage } from '../../services/database'; import { arr } from '../../utils';
import { Box, Flex, VStack } from '@chakra-ui/react';
import useScrollToBottom from '../../customHooks/useScrollToBottom';

interface ChatMainProps {
  user: users;
  setSelectedUser: React.Dispatch<React.SetStateAction<users | null>>;
}

const ChatMain: React.FC<ChatMainProps> = ({ user, setSelectedUser }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const unseenMessages = useSelector(selectUnseenMessages);
  const userID = localStorage.getItem('userID') || '';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useScrollToBottom(messagesEndRef);

  const handleSend = async (message: string) => {
    if (!message) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      from: userID,
      to: user?.userID,
      seen: MESSAGE_SENDING
    };
    await saveMessage(user.userID, newMessage);
    dispatch(addMessage({ userID: user.userID, message: newMessage }));
    socket.emit(PRIVATE_MESSAGE, {
      content: message,
      to: user?.userID,
      id: newMessage.id,
      from: userID,
      seen: MESSAGE_SENDING
    });
  };

  useEffect(() => {
    const type = JSON.parse(localStorage.getItem('Type') || '{}');
    if (type[user?.userID]) {
      if (type[user?.userID] === 'Original')
        dispatch(fetchMessages(user?.userID))
      else dispatch(setChat({ userID: user.userID, chat: arr[type[user?.userID]] }));
    }
    else {
      dispatch(fetchMessages(user?.userID))
    }

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
    <Flex h='full' flexDir='column' key={user.userID}>
      <Header setSelectedUser={setSelectedUser} user={user} />
      <Flex flexDir='column' flexGrow={1} p={2} overflowY='auto'>
        {messages[user?.userID] && messages[user?.userID].map(msg => (
          <ChatMessage key={msg.id} seen={msg?.seen} message={msg.content} isSender={msg.from === userID} />
        ))}
        <div ref={messagesEndRef} />
      </Flex>
      <ChatInput onSend={handleSend} from={userID} to={user.userID} />
    </Flex>
  );
};

export default ChatMain;
