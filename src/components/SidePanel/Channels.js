import React from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from 'semantic-ui-react';
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

class Channels extends React.Component {
  state = {
    channel: this.props.currentChannel,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    notifications: [],
    modal: false,
    firstLoad: true,
  };

  componentDidMount() {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationsListener(snap.key);
    });
  }

  componentWillUnmount() {
    this.state.channelsRef.off();
  }

  addNotificationsListener = (channelId) => {
    const { channel, notifications, messagesRef } = this.state;
    messagesRef.child(channelId).on('value', (snap) => {
      if (channel) {
        this.handleNotifications(channelId, channel.id, notifications, snap);
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      (notification) => notification.id === channelId,
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }
    this.setState({ notifications });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.props.setActiveChannel(firstChannel.id);
      this.setState({ channel: firstChannel });
      this.props.setPrivateChannel(false);
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const user = this.props.currentUser;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState((currentState) => ({
          channelName: '',
          channelDetails: '',
          modal: !currentState.modal,
        }));
        console.log('channel added');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeChannel = (channel) => {
    this.props.setActiveChannel(channel.id);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let indexNoti = this.state.notifications.findIndex(
      (noti) => noti.id === this.state.channel.id,
    );

    if (indexNoti !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[indexNoti].total = this.state.notifications[
        indexNoti
      ].lastKnownTotal;
      updatedNotifications[indexNoti].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationCount = (channel) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  handleModal = () => {
    this.setState((currentState) => ({
      modal: !currentState.modal,
    }));
  };

  render() {
    const { channels, modal } = this.state;
    return (
      <>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS{' '}
            </span>
            ({channels.length}){' '}
            <StyleButtonOpenModal name='add' onClick={this.handleModal} />
          </Menu.Item>
          {channels.length > 0 &&
            channels.map((channel) => (
              <Menu.Item
                key={channel.id}
                name={channel.name}
                onClick={() => this.handleChangeChannel(channel)}
                style={{ opacity: 0.7, cursor: 'pointer' }}
                active={channel.id === this.props.isActiveChannel}
              >
                {this.getNotificationCount(channel) && (
                  <Label color='red'>
                    {this.getNotificationCount(channel)}
                  </Label>
                )}
                # {channel.name}
              </Menu.Item>
            ))}
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.handleModal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label='About the Channel'
                  name='channelDetails'
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' inverted onClick={this.handleSubmit}>
              <Icon name='checkmark' /> Add
            </Button>
            <Button color='red' inverted onClick={this.handleModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isActiveChannel: state.channel.isActiveChannel,
});

const mapDispatchToProps = {
  setCurrentChannel: actions.setCurrentChannel,
  setPrivateChannel: actions.setPrivateChannel,
  setActiveChannel: actions.setActiveChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
