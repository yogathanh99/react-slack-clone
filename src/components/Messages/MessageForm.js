import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import firebase from 'config/firebase';
import FileModal from 'components/FileModal';
import ProgressBar from 'components/ProgressBar';

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
    typingRef: firebase.database().ref('typing'),
    uploadTask: null,
    uploadState: '',
    percentUploaded: 0,
    message: '',
    loading: false,
    errors: [],
    modal: false,
    isToggleEmoji: false,
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
    const { message, typingRef } = this.state;
    const { getMessagesRef, currentChannel, currentUser } = this.props;

    if (message) {
      this.setState({ loading: true });

      getMessagesRef()
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] });
          // prettier-ignore
          typingRef 
            .child(currentChannel.id)
            .child(currentUser.uid)
            .remove()
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

  getPath = () => {
    const { currentChannel, isPrivateChannel } = this.props;

    return isPrivateChannel
      ? `chat/private-${currentChannel.id}`
      : `chat/public`;
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

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

  handleKeyDown = (e) => {
    const { message, typingRef } = this.state;
    const { currentChannel, currentUser } = this.props;

    // if (e.metaKey && e.keyCode === 13) this.handleSendMessage();
    // Handle Enter key to send Message
    if (e.keyCode === 13) this.handleSendMessage();

    if (message) {
      typingRef
        .child(currentChannel.id)
        .child(currentUser.uid)
        .set(currentUser.displayName);
    } else {
      // prettier-ignore
      typingRef
        .child(currentChannel.id)
        .child(currentUser.uid)
        .remove()
    }
  };

  handleToggleEmoji = () => {
    this.setState((currentState) => ({
      isToggleEmoji: !currentState.isToggleEmoji,
    }));
  };

  handleAddEmoji = (emoji) => {
    const oldMessage = this.state.message;
    const newMessage = this.colonMessageToUnicode(
      `${oldMessage} ${emoji.colons} `,
    );
    this.setState((currentState) => ({
      message: newMessage,
      isToggleEmoji: !currentState.isToggleEmoji,
    }));
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  colonMessageToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, '');
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native;
        if (typeof unicode !== 'undefined') {
          return unicode;
        }
      }
      x = ':' + x + ':';
      return x;
    });
  };

  render() {
    const {
      message,
      errors,
      loading,
      modal,
      uploadState,
      percentUploaded,
      isToggleEmoji,
    } = this.state;

    return (
      <StyleSegment>
        {isToggleEmoji && (
          <Picker
            darkMode={false}
            set='apple'
            emoji='point_up'
            title='Pick your emoji'
            onSelect={this.handleAddEmoji}
            style={{
              position: 'absolute',
              bottom: '100px',
            }}
          />
        )}
        <Input
          fluid
          name='message'
          value={message}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder='Write you message'
          style={{ marginBottom: '.7em' }}
          ref={(node) => (this.messageInputRef = node)}
          label={
            <Button
              icon={isToggleEmoji ? 'close' : 'add'}
              content={isToggleEmoji ? 'Close' : null}
              onClick={this.handleToggleEmoji}
            />
          }
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
            disabled={uploadState === 'uploading'}
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.toggleModal}
          uploadFile={this.uploadFile}
        />
        {percentUploaded > 0 && uploadState !== 'done' ? (
          <ProgressBar percentUploaded={percentUploaded} />
        ) : null}
      </StyleSegment>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(MessageForm);
