import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from 'config/firebase';
import * as actions from 'store/actions';

const Container = styled.div`
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 35px;
  border-radius: 3px;
`;

const StylePrimary = styled.div`
  width: 35px;
  height: 35px;
`;

const StyleSecondary = styled.div`
  width: 85px;
  height: 35px;
  transform: rotate(225deg);
`;

const ColorPanel = ({ user, setColors }) => {
  const [modal, setModal] = useState(false);
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [usersRef] = useState(firebase.database().ref('users'));
  const [userColors, setUserColors] = useState([]);

  useEffect(() => {
    if (user) {
      let userColors = [];
      usersRef.child(`${user.uid}/colors`).on('child_added', (snap) => {
        userColors = [snap.val(), ...userColors];
        setUserColors(userColors);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleSaveColors = () => {
    if (primary && secondary) {
      usersRef
        .child(`${user.uid}/colors`)
        .push()
        .update({
          primary,
          secondary,
        })
        .then(() => {
          console.log('Color Added');
          toggleModal();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <Sidebar
      as={Menu}
      icon='labeled'
      inverted
      vertical
      visible
      width='very thin'
    >
      <Divider />
      <Button icon='add' size='small' color='blue' onClick={toggleModal} />
      {userColors.length > 0 &&
        userColors.map((color, i) => (
          <React.Fragment key={i}>
            <Divider />
            <Container
              onClick={() => setColors(color.primary, color.secondary)}
            >
              <StylePrimary style={{ background: color.primary }}>
                <StyleSecondary style={{ background: color.secondary }} />
              </StylePrimary>
            </Container>
          </React.Fragment>
        ))}
      <Modal basic open={modal} onClose={toggleModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Label content='Primary Color' />
          <SliderPicker
            color={primary}
            onChange={(color) => setPrimary(color.hex)}
          />
          <Label content='Secondary Color' />
          <SliderPicker
            color={secondary}
            onChange={(color) => setSecondary(color.hex)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={handleSaveColors}>
            <Icon name='checkmark' /> Save Colors
          </Button>
          <Button color='red' inverted onClick={toggleModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
});

const mapDispatchToProps = {
  setColors: actions.setColors,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorPanel);
