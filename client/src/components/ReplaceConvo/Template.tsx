import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Message } from '../../utils/types';

type Props = {
    messages: Message[];
}

interface ChatMessageProps {
    message: string;
    isSender: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => {
    return (
        <Flex justify={isSender ? 'flex-end' : 'flex-start'} mb="2">
            <Box
                rounded="lg"
                p="3"
                position="relative"
                bg={isSender ? 'blue.500' : 'gray.200'}
                color={isSender ? 'white' : 'black'}
            >
                <Text fontSize="lg">
                    {message}
                </Text>
            </Box>
        </Flex>
    );
};

const Template = ({ messages }: Props) => {
    return (
        <Flex flexDir="column" h="full" bg="blue.50" rounded="lg">
            <Box flex="1" p="4" overflowY="auto">
                {messages.map((msg, idx) => (
                    <ChatMessage key={msg.id} message={msg.content} isSender={idx % 2 === 0} />
                ))}
            </Box>
        </Flex>
    );
}

export default Template;
