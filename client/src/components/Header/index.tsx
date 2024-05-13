import React, { useEffect, useState } from 'react';
import { SEND_TYPING_STATUS, users } from '../../utils/types';
import socket from '../../socket';
import { selectUsers, updateTypingStatus } from '../../store/usersSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import More from './More';
import { Box, Flex, Text } from '@chakra-ui/react';
import TimeAgo, { DateInput } from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { formatDate } from '../../utils';

interface HeaderProps {
    user: users | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<users | null>>;
}

const Header: React.FC<HeaderProps> = ({ user, setSelectedUser }) => {
    const dispatch = useDispatch();
    const [isTyping, setisTyping] = useState<boolean>(user?.isTyping || false);
    const userID = localStorage.getItem('userID');
    const userState = useSelector(selectUsers);
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US')

    useEffect(() => {
        socket.on(SEND_TYPING_STATUS, ({ from, to, status }) => {
            if (from === user?.userID && to === userID) {
                setisTyping(status);
            }
            dispatch(updateTypingStatus({ userID: from, status }));
        })

        const updatedUser = userState.filter((us) => us.userID === user?.userID)
        setSelectedUser(updatedUser[0]);

        return () => {
            socket.off(SEND_TYPING_STATUS)
        }
    }, [user, userState, dispatch]);

    return (
        <Flex bg="gray.200" h="16" p="4" alignItems="center" justifyContent="space-between" w="full">
            <Box w="full">
                <Text fontWeight="semibold" fontSize="lg">{user?.username}</Text>
                <Text fontSize="sm" color="gray.600">{isTyping ? 'Typing...' : user?.connected ? 'Online' : formatDate(user?.lastSeen?.toString() || Date.now().toString())}</Text>
            </Box>
            {user?.userID && <More userID={user?.userID} />}
        </Flex>
    );
};

export default Header;
