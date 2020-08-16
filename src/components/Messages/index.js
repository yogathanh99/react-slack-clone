import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';
import Skeleton from 'react-loading-skeleton';

import firebase from 'config/firebase';
import * as actions from 'store/actions';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import Typing from 'components/Typing';

const StyleScroll = styled(ScrollToBottom)`
  height: 69vh;
  overflow: auto;
`;

const WrapperTypingUsers = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.2em;
`;

const UserTyping = styled.span`
  font-style: italic;
  font-weight: bold;
  margin-right: 5px;
`;

const Messages = (props) => {
  const messagesEnd = React.createRef();
  const [messageRef] = useState(firebase.database().ref('messages'));
  const [typingRef] = useState(firebase.database().ref('typing'));
  const [connectedRef] = useState(firebase.database().ref('.info/connected'));
  const [privateMessageRef] = useState(
    firebase.database().ref('privateMessages'),
  );
  const [messages, setMessages] = useState([]);
  const [prevChannel, setPrevChannel] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  const { currentChannel, currentUser, isPrivateChannel, setUserPosts } = props;

  useEffect(() => {
    let loadedMessages = [];
    let typingUsers = [];
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

      // Handle Typing
      typingRef.child(currentChannel.id).on('child_added', (snap) => {
        if (snap.key !== currentUser.uid) {
          typingUsers = [
            ...typingUsers,
            {
              id: snap.key,
              name: snap.val(),
            },
          ];
          setTypingUsers(typingUsers);
        }
      });

      typingRef.child(currentChannel.id).on('child_removed', (snap) => {
        const indexUser = typingUsers.findIndex((user) => user.id === snap.key);

        if (indexUser !== -1) {
          typingUsers = typingUsers.filter((user) => user.id !== snap.key);
          setTypingUsers(typingUsers);
        }
      });

      connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
          typingRef
            .child(currentChannel.id)
            .child(currentUser.uid)
            .onDisconnect()
            .remove((err) => {
              if (err !== null) console.error(err);
            });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  useEffect(() => {
    if (messages.length > 0) {
      let userPosts = messages.reduce((result, message) => {
        if (message.user.name in result) {
          result[message.user.name].count += 1;
        } else {
          result[message.user.name] = {
            avatar: message.user.avatar,
            count: 1,
          };
        }
        return result;
      }, {});

      setUserPosts(userPosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

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

  // Control auto bottom scroll when have new massages
  useEffect(() => {
    if (messagesEnd.current) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesEnd]);

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const displayMessages = (messages) =>
    messages.map((message) => (
      <Message key={message.timestamp} message={message} user={currentUser} />
    ));

  const displayTypingUsers = (users) => {
    return (
      users.length > 0 &&
      users.map((user) => (
        <WrapperTypingUsers key={user.id}>
          <UserTyping>{user.name} is typing</UserTyping> <Typing />
        </WrapperTypingUsers>
      ))
    );
  };

  const displayLoadingSkeleton = () => {
    return [...Array(10)].map((_, i) => (
      <div key={i} style={{ marginBottom: '10px', width: '50vw' }}>
        <Skeleton
          circle={true}
          height={50}
          width={50}
          style={{ marginRight: '5px' }}
        />
        <Skeleton
          height={51}
          width='46vw'
          style={{ display: 'inline-block' }}
        />
      </div>
    ));
  };

  return (
    <>
      {currentChannel ? (
        <MessagesHeader
          isPrivateChannel={isPrivateChannel}
          channel={currentChannel}
          user={currentUser}
          uniqueUsers={countUniqueUser(messages)}
          handleSearchMessages={handleSearchMessages}
          loading={searchLoading}
        />
      ) : (
        <Segment>
          <Skeleton width='50vw' />
        </Segment>
      )}

      <Segment>
        <StyleScroll>
          <Comment.Group>
            {messagesLoading
              ? displayLoadingSkeleton()
              : searchTerm.length > 0
              ? displayMessages(searchResult)
              : displayMessages(messages)}
            {displayTypingUsers(typingUsers)}
            <div ref={messagesEnd} />
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

const mapDispatchToProps = {
  setUserPosts: actions.setUserPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
