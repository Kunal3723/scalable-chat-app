// UsernameSelector.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsernameSelector: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/chat');
    }
  }, [])

  const handleUsernameSelection = () => {
    if (username) {
      localStorage.setItem('username', username);
      navigate('/chat');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Username Selector</h1>
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your username"
            className="border border-gray-300 p-2 rounded-md mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleUsernameSelection}
          >
            Select Username
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernameSelector;
