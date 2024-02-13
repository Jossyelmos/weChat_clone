import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import notificationAudio from '../audio/message-audio.wav';
import db from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';

function SidebarChat({ id, name }) {
  const user = useSelector(selectUser);
  const { roomId } = useParams();
  const [messages, setMessages] = useState('');
  const [audio] = useState(new Audio(notificationAudio));
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [seed, setSeed] = useState('');

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 50));
    const cleanup = db.collection('rooms')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot((snapShot) => {
        setMessages(snapShot.docs.map((doc) => 
          doc.data()
        ))
        setInitialDataFetched(true);
      }
    )
    return () => {
      cleanup();
    }

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      if (messages[0]?.uid !== user.uid) {
        audio.play().catch(function (error) {
    console.log("Chrome cannot play sound without user interaction first")});
      }
    }

    // eslint-disable-next-line
  }, [messages]);

  return (
    <Link to={`/rooms/${id}`}>
      <div className={`sidebarChat ${id === roomId && "sidebarChat_active"}`}>
          <Avatar alt="Remy Sharp" variant='square' src={`https://picsum.photos/200/300?random=${seed}`} />
          <div className="sidebarChat_info">
              <h2>{name}</h2>
              <p>{messages[0] && `${user.uid === messages[0]?.uid ? 'Me': messages[0]?.name} : ${messages[0]?.message}`}</p>
          </div>
          <div className="sidebarChat_timestamp">
              {messages[0]?.timestamp?.toDate().toLocaleDateString()}
          </div>
      </div>
     </Link>
  )
}

export default SidebarChat