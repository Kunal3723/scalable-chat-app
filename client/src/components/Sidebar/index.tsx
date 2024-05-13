import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { users } from '../../utils/types';
import { useSelector } from 'react-redux';
import { selectUnseenMessages } from '../../store/messagesSlice';

interface SidebarProps {
    users: users[];
    setSelectedUser: React.Dispatch<React.SetStateAction<users | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({ users, setSelectedUser }) => {
    const unseenMessages = useSelector(selectUnseenMessages);

    const handleClick = (user: users) => {
        setSelectedUser(user)
    }

    return (
        <Box bg="blue.500" p="4" w="72" h="100vh">
            <Text color="white" fontSize="lg" mb="4">Chat App </Text>
            <Box>
                {users.map(user => (
                    <Box
                        key={user.userID}
                        bg="white"
                        rounded="lg"
                        p="3"
                        mb="2"
                        cursor="pointer"
                        _hover={{ bg: 'gray.100', transition: 'background-color 0.3s ease' }}
                        onClick={() => handleClick(user)}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Text>{user.username}</Text>
                            {unseenMessages[user.userID] && unseenMessages[user.userID].length > 0 && (
                                <Box bg="red.500" color="white" rounded="full" px="2" py="1">
                                    {unseenMessages[user.userID].length}
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Sidebar;
