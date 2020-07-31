import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from 'config/firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

const StyleCommentGroup = styled(Comment.Group)`
  height: 69vh;
  overflow-y: scroll;
`;

const Messages = (props) => {
  const [messageRef] = useState(firebase.database().ref('messages'));
  const [messages, setMessages] = useState([]);
  const [prevChannel, setPrevChannel] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(true);

  const { currentChannel, currentUser } = props;

  useEffect(() => {
    if (currentChannel !== prevChannel) {
      setMessagesLoading(true);
      setPrevChannel(currentChannel);
    }

    if (currentUser && currentChannel) {
      let loadedMessages = [];

      messageRef.child(currentChannel.id).on('child_added', (snap) => {
        loadedMessages = [...loadedMessages, snap.val()];

        setMessages(loadedMessages);
        setMessagesLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  return (
    <>
      <MessagesHeader />

      <Segment>
        <StyleCommentGroup>
          {messagesLoading
            ? null
            : messages.length > 0 &&
              messages.map((message) => (
                <Message
                  key={message.timestamp}
                  message={message}
                  user={currentUser}
                />
              ))}
        </StyleCommentGroup>
      </Segment>
      <MessageForm messageRef={messageRef} />
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(Messages);
