import React, { useState, useEffect } from 'react';
import { Segment, Input, Header, Icon } from 'semantic-ui-react';

import firebase from 'config/firebase';

const MessagesHeader = (props) => {
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const [usersRef] = useState(firebase.database().ref('users'));
  const [isFirstLoading, setFirstLoading] = useState(true);

  const {
    user,
    channel,
    isPrivateChannel,
    uniqueUsers,
    handleSearchMessages,
    loading,
  } = props;

  // First Loading Star and handle isChannel ?
  useEffect(() => {
    if (isFirstLoading) {
      handleLoadingStar();
      setFirstLoading(false);
    } else if (isChannelStarred) {
      usersRef.child(`${user.uid}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createBy: {
            name: channel.createBy.name,
            avatar: channel.createBy.avatar,
          },
        },
      });
      localStorage.setItem(`${user.uid}/starred/${channel.id}`, true);
    } else {
      usersRef
        .child(`${user.uid}/starred`)
        .child(channel.id)
        .remove((err) => {
          localStorage.removeItem(`${user.uid}/starred/channel.id`);
          if (err !== null) {
            console.error(err);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChannelStarred]);

  // Handle change channel
  useEffect(() => {
    if (channel && user) handleLoadingStar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, user]);

  const handleStar = () => {
    setIsChannelStarred(!isChannelStarred);
  };

  const handleLoadingStar = () => {
    usersRef
      .child(`${user.uid}`)
      .child('starred')
      .once('value')
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const starredChannel = channelIds.includes(channel.id);
          setIsChannelStarred(starredChannel);
        }
      });
  };

  return (
    <Segment clearing>
      <Header fluid='true' as='h2' floated='left' style={{ marginBotton: 0 }}>
        <span>
          {isPrivateChannel ? `${channel.name}` : `#${channel.name}`}
          {!isPrivateChannel && (
            <Icon
              style={{ cursor: 'pointer' }}
              onClick={handleStar}
              name={isChannelStarred ? 'star' : 'star outline'}
              color={isChannelStarred ? 'yellow' : 'black'}
            />
          )}
        </span>
        <Header.Subheader>{uniqueUsers}</Header.Subheader>
      </Header>

      <Header floated='right'>
        <Input
          icon='search'
          name='searchTerm'
          placeholder='Search Messages'
          size='mini'
          onChange={handleSearchMessages}
          loading={loading}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
