import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { SEND_TYPING_STATUS } from '../utils/types';

interface ChatInputProps {
  onSend: (message: string) => void;
  from: string | null;
  to: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, from, to }) => {
  const [message, setMessage] = useState<string>('');
  const [typing, setTyping] = useState<boolean>(false);
  let timer: ReturnType<typeof setTimeout>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleTyping = () => {
    if (typing) return;
    socket.emit(SEND_TYPING_STATUS, { from, to, status: true });
    setTyping(true);
    timer = setTimeout(() => {
      socket.emit(SEND_TYPING_STATUS, { from, to, status: false });
      setTyping(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (typing)
        socket.emit(SEND_TYPING_STATUS, { from, to, status: false });
      setTyping(false);
      setMessage('');
      console.log(timer);
      clearTimeout(timer); // Clear the timeout if the component unmounts
    };
  }, []);

  return (
    <div className="flex items-center border-t border-gray-300 p-3">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        onInput={handleTyping} // Directly passing the function reference
        className="flex-grow border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        onClick={() => {
          onSend(message);
          setMessage('');
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
