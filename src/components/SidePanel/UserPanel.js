import React, { useState } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';

import firebase from 'config/firebase';

const UserPanel = (props) => {
  const [user] = useState(props.currentUser);

  const dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span>Change avatar</span>,
    },
    {
      key: 'signout',
      text: <span onClick={() => firebase.auth().signOut()}>Sign out</span>,
    },
  ];

  return (
    <>
      {user ? (
        <Grid style={{ background: '#4c3c4c' }}>
          <Grid.Column>
            <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
              <Header inverted floated='left' as='h2'>
                <Icon name='code' />
                <Header.Content>Thanh Vo</Header.Content>
              </Header>

              <Header inverted as='h4' style={{ padding: '0.25em' }}>
                <Dropdown
                  trigger={
                    <span>
                      <Image src={user.photoURL} spaced='right' avatar />
                      {user.displayName}
                    </span>
                  }
                  options={dropdownOptions()}
                />
              </Header>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(UserPanel);
