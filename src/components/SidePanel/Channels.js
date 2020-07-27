import React, { useState, useEffect } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import firebase from 'config/firebase';
import * as actions from 'store/actions';

const StyleButtonOpenModal = styled(Icon)`
  cursor: pointer;
  transition: all 0.7s;

  &:hover {
    color: #fff;
  }
`;

const Channels = (props) => {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState('');
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');
  const [channelRef] = useState(firebase.database().ref('channels'));
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    displayChannel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstLoad && channels.length > 0) {
      const firstChannel = channels[0];

      props.setCurrentChannel(firstChannel);
      setActiveChannel(firstChannel.id);
      setFirstLoad(false);
    }

    // Disconnect to channels
    return () => {
      channelRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoad, channels]);

  const displayChannel = async () => {
    let loadedChannels = [];

    await channelRef.on('child_added', (snap) => {
      loadedChannels = [...loadedChannels, snap.val()];
      setChannels(loadedChannels);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid(channelName, channelDetails)) {
      handleAddChannel();
    }
  };

  const isValid = (channelName, channelDetails) =>
    channelName && channelDetails;

  const handleAddChannel = () => {
    const key = channelRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createBy: {
        name: props.currentUser.displayName,
        avatar: props.currentUser.photoURL,
      },
    };

    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setChannelName('');
        setChannelDetails('');
        setModal(false);

        console.log('Done add channel...');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const handleChange = (e) => {
    if (e.target.name === 'channelName') setChannelName(e.target.value);
    else if (e.target.name === 'channelDetails')
      setChannelDetails(e.target.value);
  };

  const handleChangeChannel = (channel) => {
    props.setCurrentChannel(channel);
    setActiveChannel(channel.id);
  };

  return (
    <>
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS{' '}
          </span>
          ({channels.length}){' '}
          <StyleButtonOpenModal name='add' onClick={handleModal} />
        </Menu.Item>
        {channels.length > 0 &&
          channels.map((channel) => (
            <Menu.Item
              key={channel.id}
              name={channel.name}
              onClick={() => handleChangeChannel(channel)}
              style={{ opacity: 0.7, cursor: 'pointer' }}
              active={channel.id === activeChannel}
            >
              # {channel.name}
            </Menu.Item>
          ))}
      </Menu.Menu>
      <Modal basic open={modal} onClose={handleModal}>
        <Modal.Header>Add a channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label='Name of Channel'
                name='channelName'
                onChange={handleChange}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label='About the Channel'
                name='channelDetails'
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={handleSubmit}>
            <Icon name='checkmark' /> Add
          </Button>
          <Button color='red' inverted onClick={handleModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

const mapDispatchToProps = {
  setCurrentChannel: actions.setCurrentChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
