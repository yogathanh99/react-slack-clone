import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';

const StyleSegment = styled(Segment)`
  position: fixed !important;
  margin-left: 320px !important;
  bottom: 1em;
  left: 0;
  right: 1em;
  z-index: 200;
`;

const MessageForm = () => {
  return (
    <StyleSegment>
      <Input
        fluid
        name='message'
        placeholder='Write you message'
        style={{ marginBottom: '.7em' }}
        label={<Button icon={'add'} />}
        labelPosition='left'
      />
      <Button.Group icon widths='2'>
        <Button
          color='orange'
          content='Add Reply'
          labelPosition='left'
          icon='edit'
        />
        <Button
          color='teal'
          content='Upload Media'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
    </StyleSegment>
  );
};

export default MessageForm;
