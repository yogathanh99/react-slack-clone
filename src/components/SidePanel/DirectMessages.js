import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import firebase from 'config/firebase';
import * as actions from 'store/actions';

const StyleMenu = styled(Menu.Menu)`
  padding-bottom: 2em;
`;

class DirectMessages extends React.Component {
  state = {
    user: this.props.currentUser,
    users: [],
    userRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence'),
  };

  componentDidMount() {
    const { user } = this.state;

    if (user) {
      this.handleEvent(user.uid);
    }
  }

  handleEvent = (currentUserID) => {
    const { userRef, connectedRef, presenceRef } = this.state;
    let loadedUsers = [];

    userRef.on('child_added', (snap) => {
      if (currentUserID !== snap.key) {
        const user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers = [...loadedUsers, user];

        this.setState({ users: loadedUsers });
      }
    });

    connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserID);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    presenceRef.on('child_added', (snap) => {
      if (currentUserID !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    presenceRef.on('child_removed', (snap) => {
      if (currentUserID !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const usersStatus = this.state.users.reduce((result, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }

      return result.concat(user);
    }, []);

    this.setState({ users: usersStatus });
  };

  handleChangeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);

    const channelData = {
      id: channelId,
      name: user.name,
    };

    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.props.setActiveChannel(user.uid);
  };

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  render() {
    const { users } = this.state;

    return (
      <StyleMenu>
        <Menu.Item>
          <span>
            <Icon name='mail' /> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            active={user.uid === this.props.isActiveChannel}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
            onClick={() => this.handleChangeChannel(user)}
          >
            <Icon
              style={{ float: 'left', margin: '0 .5em 0 0' }}
              name={user.status === 'online' ? 'circle' : 'circle outline'}
              color={user.status === 'online' ? 'green' : 'red'}
            />
            {user.name}
          </Menu.Item>
        ))}
      </StyleMenu>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  isActiveChannel: state.channel.isActiveChannel,
});

const mapDispatchToProps = {
  setCurrentChannel: actions.setCurrentChannel,
  setPrivateChannel: actions.setPrivateChannel,
  setActiveChannel: actions.setActiveChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectMessages);
