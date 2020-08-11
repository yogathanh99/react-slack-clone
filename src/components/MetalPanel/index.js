import React, { useState } from 'react';
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

const MetalPanel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { isPrivateChannel, currentChannel, userPosts } = props;

  const handleActiveIndex = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = index === activeIndex ? -1 : index;

    setActiveIndex(newIndex);
  };

  const displayUserPosts = (posts) =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image src={val.avatar} avatar />
          <List.Content>
            <List.Header as='a'>{key}</List.Header>
            <List.Description>
              {val.count > 1 ? `${val.count} posts` : `${val.count} post`}
            </List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  if (isPrivateChannel || !currentChannel) return null;

  return (
    <Segment loading={!currentChannel || !userPosts}>
      <Header as='h3' attached='top'>
        About #{currentChannel.name}
      </Header>
      <Accordion styled attached='true'>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleActiveIndex}
        >
          <Icon name='dropdown' />
          <Icon name='info' />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {currentChannel.details}
        </Accordion.Content>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleActiveIndex}
        >
          <Icon name='dropdown' />
          <Icon name='user circle' />
          Top 5 Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>{userPosts && displayUserPosts(userPosts)}</List>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleActiveIndex}
        >
          <Icon name='dropdown' />
          <Icon name='pencil alternate' />
          Create By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Image
            avatar
            src={currentChannel.createBy.avatar}
            style={{ marginRight: '5px' }}
          />
          {currentChannel.createBy.name}
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

const mapStateToProps = (state) => ({
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
});

export default connect(mapStateToProps)(MetalPanel);
