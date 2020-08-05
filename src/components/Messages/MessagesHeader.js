import React from 'react';
import { Segment, Input, Header, Icon } from 'semantic-ui-react';

const MessagesHeader = (props) => {
  const {
    channel,
    uniqueUsers,
    handleSearchMessages,
    loading,
    isPrivateChannel,
  } = props;

  return (
    <Segment clearing>
      <Header fluid='true' as='h2' floated='left' style={{ marginBotton: 0 }}>
        <span>
          {channel
            ? isPrivateChannel
              ? `${channel.name}`
              : `#${channel.name}`
            : 'Loading...'}
          <Icon name={'star outline'} color='black' />
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
