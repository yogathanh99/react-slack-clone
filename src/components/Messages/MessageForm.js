import React, { useState } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import firebase from 'config/firebase';

const StyleSegment = styled(Segment)`
  position: fixed !important;
  margin-left: 320px !important;
  bottom: 1em;
  left: 0;
  right: 1em;
  z-index: 200;
`;

const MessageForm = (props) => {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const { messageRef, currentUser, currentChannel } = props;

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const createMessage = () => ({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user: {
      id: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL,
    },
    content: message,
  });

  const handleSendMessage = () => {
    if (message) {
      setLoading(true);

      messageRef
        .child(currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage('');
          setErrors([]);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setErrors([...errors, err]);
        });
    } else {
      setErrors([...errors, { message: 'Add a message' }]);
    }
  };

  return (
    <StyleSegment>
      <Input
        fluid
        name='message'
        onChange={handleChange}
        placeholder='Write you message'
        style={{ marginBottom: '.7em' }}
        label={<Button icon={'add'} />}
        labelPosition='left'
        className={
          errors.some((err) => err.message.includes('message')) // eslint-disable-next-line
            ? 'error'
            : ''
        }
      />
      <Button.Group icon widths='2'>
        <Button
          onClick={handleSendMessage}
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

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(MessageForm);
