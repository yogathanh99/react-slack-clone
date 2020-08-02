import React from 'react';
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

class Channels extends React.Component {
  state = {
    activeChannel: '',
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false,
    firstLoad: true,
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
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
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
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
        <Menu.Menu>
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
                active={channel.id === this.state.activeChannel}
              >
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
});

const mapDispatchToProps = {
  setCurrentChannel: actions.setCurrentChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
