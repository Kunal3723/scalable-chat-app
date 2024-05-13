import { useEffect } from 'react'
import UsernameSelector from './page/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './page/Chat';
import socket from './socket';
import { CONNECT_ERROR } from './utils/types';
import { fetchUnseenMessages } from './store/messagesSlice';
import { useDispatch } from 'react-redux';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {

    dispatch(fetchUnseenMessages());

    socket.on(CONNECT_ERROR, (err) => {
      if (err.message === "invalid username") {
        console.log('Enter valid username');
      }
    });

    return () => {
      socket.off(CONNECT_ERROR);
      socket.disconnect();
    }
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UsernameSelector />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
