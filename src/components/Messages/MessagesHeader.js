import React from 'react';
import { Segment, Input, Header, Icon } from 'semantic-ui-react';

const MessagesHeader = () => {
  return (
    <Segment clearing>
      <Header fluid='true' as='h2' floated='left' style={{ marginBotton: 0 }}>
        <span>
          Channel
          <Icon name={'star outline'} color='black' />
        </span>
        <Header.Subheader>2 Users</Header.Subheader>
      </Header>

      <Header floated='right'>
        <Input
          icon='search'
          name='searchTerm'
          placeholder='Search Messages'
          size='mini'
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
