import React, { useState } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import styled from 'styled-components';

import firebase from 'config/firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

const StyleCommentGroup = styled(Comment.Group)`
  height: 69vh;
  overflow-y: scroll;
`;

const Messages = () => {
  const [messageRef] = useState(firebase.database().ref('messages'));
  return (
    <>
      <MessagesHeader />

      <Segment>
        <StyleCommentGroup></StyleCommentGroup>
      </Segment>
      <MessageForm messageRef={messageRef} />
    </>
  );
};

export default Messages;
