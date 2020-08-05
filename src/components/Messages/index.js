import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';

import firebase from 'config/firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

const StyleScroll = styled(ScrollToBottom)`
  height: 69vh;
  overflow: auto;
`;

const Messages = (props) => {
  const [messageRef] = useState(firebase.database().ref('messages'));
  const [privateMessageRef] = useState(
    firebase.database().ref('privateMessages'),
  );
  const [messages, setMessages] = useState([]);
  const [prevChannel, setPrevChannel] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { currentChannel, currentUser, isPrivateChannel } = props;

  useEffect(() => {
    let loadedMessages = [];
    if (currentChannel !== prevChannel) {
      setMessagesLoading(true);
      setPrevChannel(currentChannel);
    }

    if (currentUser && currentChannel) {
      getMessagesRef()
        .child(currentChannel.id)
        .on('child_added', (snap) => {
          loadedMessages = [...loadedMessages, snap.val()];

          setMessages(loadedMessages);
          setMessagesLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessageRef : messageRef;
  };

  const countUniqueUser = (messages) => {
    if (messages.length > 0) {
      const uniqueUsers = messages.reduce((result, message) => {
        if (!result.includes(message.user.name)) {
          result = [...result, message.user.name];
        }
        return result;
      }, []);
      const pluralNoun = Boolean(uniqueUsers.length > 1);
      return `${uniqueUsers.length} user${pluralNoun ? 's' : ''}`;
    }
    return 'Loading...';
  };

  const handleSearchMessages = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
  };

  useEffect(() => {
    if (searchTerm) {
      const currentChannelMessages = [...messages];
      const regex = new RegExp(searchTerm, 'gi');

      const searchResultsData = currentChannelMessages.reduce(
        (result, message) => {
          if (
            (message.content && message.content.match(regex)) ||
            message.user.name.match(regex)
          ) {
            result = [...result, message];
          }
          return result;
        },
        [],
      );

      setSearchResults(searchResultsData);
      setTimeout(() => setSearchLoading(false), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const displayMessages = (messages) =>
    messages.map((message) => (
      <Message key={message.timestamp} message={message} user={currentUser} />
    ));

  return (
    <>
      <MessagesHeader
        isPrivateChannel={isPrivateChannel}
        channel={currentChannel}
        uniqueUsers={countUniqueUser(messages)}
        handleSearchMessages={handleSearchMessages}
        loading={searchLoading}
      />

      <Segment>
        <StyleScroll>
          <Comment.Group>
            {messagesLoading
              ? null
              : searchTerm.length > 0
              ? displayMessages(searchResult)
              : displayMessages(messages)}
          </Comment.Group>
        </StyleScroll>
      </Segment>
      <MessageForm
        getMessagesRef={getMessagesRef}
        isPrivateChannel={isPrivateChannel}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps)(Messages);
