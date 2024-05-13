import React, { useEffect, useState } from 'react';
import socket from '../../socket';
import { SEND_TYPING_STATUS } from '../../utils/types';
import { Button, Flex, Input } from '@chakra-ui/react';

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
      clearTimeout(timer); // Clear the timeout if the component unmounts
    };
  }, []);

  const handleSend = () => {
    onSend(message);
    setMessage('');
  };

  return (
    <Flex alignItems="center" borderTop="1px" borderColor="gray.300" p={3}>
      <Input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        onInput={handleTyping}
        flex="1"
        borderWidth="1px"
        borderRadius="lg"
        px={3}
        py={2}
        mr={2}
        _focus={{
          outline: 'none',
          ring: '1px',
          borderColor: 'blue.300',
        }}
      />
      <Button
        onClick={handleSend}
        bg="blue.500"
        color="white"
        px={4}
        py={2}
        rounded="lg"
      >
        Send
      </Button>
    </Flex>
  );
};

export default ChatInput;
