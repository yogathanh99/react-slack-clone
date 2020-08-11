import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import * as actions from 'store/actions';
import firebase from 'config/firebase';

class StarChannels extends React.Component {
  state = {
    starredChannels: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListener(this.state.user.uid);
    }
  }

  addListener(userId) {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .on('child_added', (snap) => {
        const starredChannels = { id: snap.key, ...snap.val() };

        this.setState({
          starredChannels: [...this.state.starredChannels, starredChannels],
        });
      });

    this.state.usersRef
      .child(userId)
      .child('starred')
      .on('child_removed', (snap) => {
        const channelRemove = { id: snap.key, ...snap.val() };

        const filterChannels = this.state.starredChannels.filter(
          (channel) => channel.id !== channelRemove.id,
        );

        this.setState({
          starredChannels: filterChannels,
        });
      });
  }

  handleChangeChannel = (channel) => {
    this.props.setActiveChannel(channel.id);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  render() {
    const { starredChannels } = this.state;

    return (
      <>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='star' /> STARED{' '}
            </span>
            ({starredChannels.length}){' '}
          </Menu.Item>
          {starredChannels.length > 0 &&
            starredChannels.map((channel) => (
              <Menu.Item
                key={channel.id}
                name={channel.name}
                onClick={() => this.handleChangeChannel(channel)}
                style={{ opacity: 0.7, cursor: 'pointer' }}
                active={channel.id === this.props.isActiveChannel}
              >
                # {channel.name}
              </Menu.Item>
            ))}
        </Menu.Menu>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isActiveChannel: state.channel.isActiveChannel,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = {
  setCurrentChannel: actions.setCurrentChannel,
  setPrivateChannel: actions.setPrivateChannel,
  setActiveChannel: actions.setActiveChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(StarChannels);
