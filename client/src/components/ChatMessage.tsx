import React from 'react';
import { MESSAGE_SEEN, MESSAGE_SENDING, MESSAGE_SENT } from '../utils/types';

interface ChatMessageProps {
  message: string;
  isSender: boolean;
  seen?: 'message sent' | 'message seen' | 'message delivered' | 'message sending'
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender, seen }) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`rounded-lg p-3 relative ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        {isSender && (
          (seen === MESSAGE_SENDING || !seen) ? <span className="absolute mt-2 bottom-1 right-1 text-xs text-gray-400">Sending..</span> : seen === MESSAGE_SENT ? <span className="absolute mt-2 bottom-1 right-1 text-xs text-gray-400">sent</span>
            : seen === MESSAGE_SEEN ? <span className="absolute mt-2 bottom-1 right-1 text-xs text-gray-400">seen</span> : <span className="absolute mt-2 bottom-1 right-1 text-xs text-gray-400">delivered</span>
        )}
        <span className='text-lg'>
          {message}
        </span>
      </div>
    </div >
  );
};

export default ChatMessage;
