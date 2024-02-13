import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import {ChatBubble, ChatBubbleOutline, Explore, ExploreOutlined, People, PeopleOutline, Person, PersonOutline, Search} from '@mui/icons-material';
import {AddCircleOutline} from '@mui/icons-material';
import SidebarChat from './SidebarChat';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { logout } from '../features/counter/userSlice';
import db from '../firebase';
import firebase from 'firebase/compat/app';

function Sidebar() {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const cleanup = db.collection('rooms')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapShot) => setRooms(snapShot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        }))
        )
    );
    return () => {
      cleanup();
    }
    
  }, []);

  const createChat = () => {
    const roomName = prompt('Please enter a name for chat room');
    if (roomName) {
      db.collection('rooms').add({
        name: roomName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }

  const SidebarOption = ({ Icon, IconOnHover, caption, onClick }) => (
    <>
      <div className="sidebar_option">
        <div className="sidebar_option_noHover"><Icon /></div>
        <div className="sidebar_option_hover"><IconOnHover onClick={onClick} /></div>
        <span className="sidebar_caption">{caption}</span>
      </div>
    </>
  )

  const signOut = async () => {
    await auth.signOut();
    dispatch(logout());
  }

  return (
      <div className='sidebar'>
        <div className="sidebar_header">
          <h1>WeChat</h1>
          <div className="sidebar_headerIcons">
            <Search />
            <AddCircleOutline onClick={createChat} />
          </div>
        </div>
        <div className="sidebar_chats">
        {rooms.map((room) => (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          ))}
        </div>
        <div className="sidebar_footer">
          <SidebarOption Icon={ChatBubbleOutline} IconOnHover={ChatBubble} caption='Chats' />
          <SidebarOption Icon={PeopleOutline} IconOnHover={People} caption='Contacts' />
          <SidebarOption Icon={ExploreOutlined} IconOnHover={Explore} caption='Discover' />
          <SidebarOption Icon={PersonOutline} IconOnHover={Person} caption='Logout' onClick={signOut} />
        </div>
      </div>
  )
}

export default Sidebar;