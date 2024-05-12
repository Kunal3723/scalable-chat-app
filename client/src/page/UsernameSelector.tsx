// UsernameSelector.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../services/auth';
import { auth } from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";

const UsernameSelector: React.FC = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user])

  return (
    loading ? <></> : <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Username Selector</h1>
        <div className="flex flex-col items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={googleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>

  );
};

export default UsernameSelector;
