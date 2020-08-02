import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';

import firebase from 'config/firebase';
import FileModal from 'components/FileModal';

const StyleSegment = styled(Segment)`
  position: fixed !important;
  margin-left: 320px !important;
  bottom: 1em;
  left: 0;
  right: 1em;
  z-index: 200;
`;

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState: '',
    percentUploaded: 0,
    message: '',
    loading: false,
    errors: [],
    modal: false,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggleModal = () => {
    this.setState((currentState) => ({ modal: !currentState.modal }));
  };

  createMessage = (fileUrl = null) => {
    const { currentUser } = this.props;

    const messageToSend = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    if (fileUrl !== null) {
      messageToSend['image'] = fileUrl;
    } else {
      messageToSend['content'] = this.state.message;
    }

    return messageToSend;
  };

  handleSendMessage = () => {
    const { message } = this.state;
    const { messageRef, currentChannel } = this.props;

    if (message) {
      this.setState({ loading: true });

      messageRef
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch((err) => {
          console.error(err);
          this.setState((currentState) => ({
            loading: false,
            errors: [...currentState.errors, err],
          }));
        });
    } else {
      this.setState((currentState) => ({
        errors: [...currentState.errors, { message: 'Add a message' }],
      }));
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.props.messageRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: 'uploading',
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100,
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState((currentState) => ({
              errors: [...currentState.errors, err],
              uploadState: 'error',
              uploadTask: null,
            }));
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                console.log(downloadUrl);
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState((currentState) => ({
                  errors: [...currentState.errors, err],
                  uploadState: 'error',
                  uploadTask: null,
                }));
              });
          },
        );
      },
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    console.log(ref);
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: 'done' });
      })
      .catch((err) => {
        console.error(err);
        this.setState((currentState) => ({
          errors: [...currentState.errors, err],
        }));
      });
  };

  render() {
    const { message, errors, loading, modal } = this.state;

    return (
      <StyleSegment>
        <Input
          fluid
          name='message'
          value={message}
          onChange={this.handleChange}
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
            onClick={this.handleSendMessage}
            color='orange'
            content='Add Reply'
            labelPosition='left'
            disabled={loading}
            icon='edit'
          />
          <Button
            onClick={this.toggleModal}
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
          <FileModal
            modal={modal}
            closeModal={this.toggleModal}
            uploadFile={this.uploadFile}
          />
        </Button.Group>
      </StyleSegment>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(MessageForm);
