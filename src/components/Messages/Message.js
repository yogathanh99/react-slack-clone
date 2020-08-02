import React from 'react';
import moment from 'moment';
import { Comment, Image } from 'semantic-ui-react';

import './style/message.css';

const isOwnerMessage = (message, user) => {
  return message.user.id === user.uid ? 'messageSelf' : '';
};

const isImage = (message) => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
};

const timeFromNow = (timestamp) => {
  return moment(timestamp).fromNow();
};

const Message = ({ message, user }) => {
  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnerMessage(message, user)}>
        <Comment.Author as='a'>{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? (
          <Image src={message.image} style={{ padding: '1em' }} />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
