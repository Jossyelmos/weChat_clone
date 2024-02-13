import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import './App.css';
import Login from './Login';
import { useSelector } from 'react-redux';
import { selectUser } from './features/counter/userSlice';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';
import { login } from './features/counter/userSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(login({
          email: authUser.email,
          uid: authUser.uid,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        })
        );
      }
    })
    return () => { unsubscribe() };
    
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
          <div className="app_body">
            <Router>
              <Routes>
                <Route path='/rooms/:roomId/' element={
                  <>
                    <Sidebar />
                    <Chat />
                  </>
                }>
                </Route>
                <Route path='/' element={<Sidebar />}></Route>
              </Routes>
            </Router>
          </div>
      )}
    </div>
  );
}

export default App;
