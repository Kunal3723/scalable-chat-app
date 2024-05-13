import React from 'react';
import { MESSAGE_SEEN, MESSAGE_SENDING, MESSAGE_SENT } from '../../utils/types';
import { Box, Flex, Text } from '@chakra-ui/react';

interface ChatMessageProps {
  message: string;
  isSender: boolean;
  seen?: 'message sent' | 'message seen' | 'message delivered' | 'message sending'
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender, seen }) => {
  return (
    <Flex justifyContent={isSender ? 'flex-end' : 'flex-start'} marginBottom={4}>
      <Box
        borderRadius={10}
        p={3}
        position='relative'
        textColor={isSender ? 'white' : 'black'}
        bgColor={isSender ? 'blue.500' : 'gray.200'}
      // className={`rounded-lg p-3 relative ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
      >
        {isSender && (
          <>
            {seen === MESSAGE_SENDING || !seen ? (
              <Text position='absolute' mt={2} bottom={1} right={1} fontSize='xs' textColor='gray.400' >Sending..</Text>
            ) : seen === MESSAGE_SENT ? (
              <Text position='absolute' mt={2} bottom={1} right={1} fontSize='xs' textColor='gray.400'>sent</Text>
            ) : seen === MESSAGE_SEEN ? (
              <Text position='absolute' mt={2} bottom={1} right={1} fontSize='xs' textColor='gray.400'>seen</Text>
            ) : (
              <Text position='absolute' mt={2} bottom={1} right={1} fontSize='xs' textColor='gray.400'>delivered</Text>
            )}
          </>
        )}
        <Text fontSize="lg">{message}</Text>
      </Box>
    </Flex >
  );
};

export default ChatMessage;
