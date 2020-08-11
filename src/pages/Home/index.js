import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ColorPanel from 'components/ColorPanel';
import SidePanel from 'components/SidePanel';
import Messages from 'components/Messages';
import MetalPanel from 'components/MetalPanel';

const Home = (props) => {
  const { currentChannel } = props;

  return (
    <Grid columns='equal' style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetalPanel currentChannel={currentChannel} />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(Home);
