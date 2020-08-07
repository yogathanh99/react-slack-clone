import React from 'react';
import { Menu } from 'semantic-ui-react';
import styled from 'styled-components';

import UserPanel from './UserPanel';
import Channels from './Channels';
import StarChannels from './StarChannels';
import DirectMessages from './DirectMessages';

const StyleMenu = styled(Menu)`
  background: #4c3c4c !important;
  font-size: '1.2rem';
`;

const SidePanel = () => {
  return (
    <StyleMenu size='large' inverted fixed='left' vertical>
      <UserPanel />
      <StarChannels />
      <Channels />
      <DirectMessages />
    </StyleMenu>
  );
};

export default SidePanel;
