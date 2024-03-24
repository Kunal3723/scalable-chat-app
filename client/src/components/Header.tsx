import React, { useEffect, useState } from 'react';
import { SEND_TYPING_STATUS, users } from '../utils/types';
import socket from '../socket';
import { selectUsers, updateTypingStatus } from '../store/usersSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface HeaderProps {
    user: users | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<users | null>>;
}

const Header: React.FC<HeaderProps> = ({ user, setSelectedUser }) => {
    const dispatch = useDispatch();
    const [isTyping, setisTyping] = useState<boolean>(user?.isTyping || false);
    const userID = localStorage.getItem('userID');
    const userState = useSelector(selectUsers);

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
        <div className="bg-gray-200 h-16 p-4 flex items-center justify-between w-full">
            <div className='w-full'>
                <div className="font-semibold text-lg">{user?.username}</div>
                <div className="text-sm text-gray-600">
                    {isTyping ? 'Typing...' : user?.connected ? 'Online' : user?.lastSeen}
                </div>
            </div>
        </div>
    );
};

export default Header;
