import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { AddCircleOutlineOutlined, ArrowBackIos, Person, RecordVoiceOverOutlined, SentimentVerySatisfied } from '@mui/icons-material';
import Message from './Message';
import ChatDate from './ChatDate';
import db from '../firebase';
import firebase from 'firebase/compat/app';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import { useParams } from 'react-router-dom';

function Chat() {
  const inputRef = useRef(null);
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const user = useSelector(selectUser);
  const { roomId } = useParams();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const cleanup = db.collection('rooms').doc(roomId).onSnapshot((snapShot) => {
      if (snapShot.data()) {
        setRoomName(snapShot.data().name);
      }
    });

    const cleanup2 = db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapShot) => {
      setMessages(snapShot.docs.map(doc => doc.data()))
    });
    return () => {
      cleanup();
      cleanup2();
    }

  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection('rooms').doc(roomId).collection('messages').add({
      message: inputRef.current.value,
      name: user.displayName,
      uid: user.uid,
      profilePic: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    db.collection('rooms').doc(roomId).update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    inputRef.current.value = '';
  }

  return (
      <div className='chat'>
        <div className="chat_header">
          <ArrowBackIos />
          <div className="chat_headerInfo">
            <h3>{roomName}</h3>
          </div>
          <Person />
        </div>
        <div className="chat_body">
        {messages.map((message, index) => {
            
            const prevMessage = messages[index - 1];
            const showDate = !prevMessage || (message?.timestamp?.seconds - prevMessage.timestamp?.seconds) > 60;
            const dateNow = new Date();
            const showFullDate = ((dateNow.getDate() !== message.timestamp?.toDate().getDate()) ||
                                (dateNow.getMonth() !== message.timestamp?.toDate().getMonth()) || 
                                dateNow.getYear() !== message.timestamp?.toDate().getYear())

              return (
                <>
                  {showDate && <ChatDate date={message.timestamp?.toDate()} showFullDate={showFullDate} />}
                  <Message
                    name={message.name}
                    text={message.message}
                    profilePicSrc={message.profilePic}
                    isSender={message.uid === user.uid}
                  />
                </>
              )
            })}
            <div ref={messagesEndRef}></div>
        </div>
        <div className="chat_footer">
          <RecordVoiceOverOutlined />
          <form>
            <input type="text" ref={inputRef} />
            <button onClick={sendMessage} type="submit"></button>
          </form>
          <SentimentVerySatisfied />
          <AddCircleOutlineOutlined />
        </div>
      </div>
  )
}

export default Chat