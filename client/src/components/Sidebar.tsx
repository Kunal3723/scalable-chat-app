import React from 'react';
import { users } from '../utils/types';
import { useSelector } from 'react-redux';
import { selectUnseenMessages } from '../store/messagesSlice';

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
        <div className="bg-blue-500 p-4 w-72 h-screen">
            <div className="text-white text-lg mb-4">Chat App </div>
            <div>
                {users.map(user => (
                    <div
                        key={user.userID}
                        className="bg-white rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleClick(user)}
                    >
                        <div className="flex justify-between items-center">
                            <div>{user.username}</div>
                            {unseenMessages[user.userID] && unseenMessages[user.userID].length>0 && (
                                <div className="bg-red-500 text-white rounded-full px-2 py-1">
                                    {unseenMessages[user.userID].length}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;