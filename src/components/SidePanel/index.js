import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import StarChannels from './StarChannels';
import DirectMessages from './DirectMessages';

const SidePanel = ({ primaryColor }) => {
  return (
    <Menu
      style={{
        background: primaryColor,
        fontSize: '1.2rem',
      }}
      size='large'
      inverted
      fixed='left'
      vertical
    >
      <UserPanel primaryColor={primaryColor} />
      <StarChannels />
      <Channels />
      <DirectMessages />
    </Menu>
  );
};

export default SidePanel;
