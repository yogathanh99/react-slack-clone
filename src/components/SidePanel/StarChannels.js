import React from 'react';
import { Menu, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';

import * as actions from 'store/actions';

class StarChannels extends React.Component {
  state = {
    starredChannels: [],
  };

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
                {this.getNotificationCount(channel) && (
                  <Label color='red'>
                    {this.getNotificationCount(channel)}
                  </Label>
                )}
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
});

const mapDispatchToProps = {
  setCurrentChannel: actions.setCurrentChannel,
  setPrivateChannel: actions.setPrivateChannel,
  setActiveChannel: actions.setActiveChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(StarChannels);
