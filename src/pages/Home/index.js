import React from 'react';
import { Grid } from 'semantic-ui-react';

import ColorPanel from '../../components/ColorPanel';
import SidePanel from '../../components/SidePanel';
import Messages from '../../components/Messages';
import MetalPanel from '../../components/MetalPanel';

const Home = () => {
  return (
    <Grid columns='equal' style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetalPanel />
      </Grid.Column>
    </Grid>
  );
};

export default Home;
