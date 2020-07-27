import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import styled from 'styled-components';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

const StyleCommentGroup = styled(Comment.Group)`
  height: 69vh;
  overflow-y: scroll;
`;

const Messages = () => {
  return (
    <>
      <MessagesHeader />

      <Segment>
        <StyleCommentGroup></StyleCommentGroup>
      </Segment>
      <MessageForm />
    </>
  );
};

export default Messages;
