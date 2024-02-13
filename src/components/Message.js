import React from 'react';
import './Message.css';
import { Avatar } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

function Message({ name, text, profilePicSrc, isSender}) {
  return (
    <div className={`message ${isSender && 'message_sent'}`}>
          {!isSender && <div className='message_name'>{name}</div>}
          <Avatar alt="Remy Sharp" variant='square' className='message_avatar' src={profilePicSrc} />
          {isSender ? <ArrowRight className='message_sentArrow' /> : <ArrowLeft className='message_recievedArrow' />}
          <div className="message_info">
              <div className="message_text">{text}</div>
          </div>
    </div>
  )
}

export default Message